import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';
import {
  Conversation,
  ConversationDocument,
} from './schemas/conversation.schema';
import { JwtService } from '@nestjs/jwt';
import { UsePipes } from '@nestjs/common';
import { OneToOneMessageDto } from './dto/one-to-one-message.dto';
import { GroupMessageDto } from './dto/group-message.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}
  @WebSocketServer()
  server: Server;
  async handleConnection(client: Socket, ...args: any[]) {
    // console.log('client.handshake.headers', client.handshake.headers);
    const token = client.handshake.headers.authorization?.split(' ')[1];
    // console.log('token', token);

    if (!token) {
      client.emit('unauthorized', { message: 'Missing access token' });
      client.disconnect();
      return;
    }

    try {
      const decoded = await this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_JWT_SECRET,
      });
      // console.log('decoded', decoded);
      const userId = decoded.id;
      client.data.userId = userId;

      const conversations: ConversationDocument[] =
        await this.conversationModel.find({
          participants: userId,
        });

      // console.log('conversations', conversations);

      for (const convo of conversations) {
        client.join(String(convo._id));
      }

      // console.log('Client connected:');

      console.log('Client rooms connected', Array.from(client.rooms));
    } catch (error) {
      console.log('error in try catch', error);
      client.emit('unauthorized', { message: 'Invalid access token' });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    console.log('client disconneted', client.id);
  }

  @SubscribeMessage('one-to-one-message')
  @UsePipes(OneToOneMessageDto)
  async handleMessage(
    @MessageBody() payload: { conversationId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('client payload', client);
    console.log('payload', payload);
    const fromUserId = client.data.userId;

    console.log('fromUserId', fromUserId);

    if (!fromUserId) {
      client.emit('missing-userId', {
        success: false,
        message: 'Missing fromUserId',
      });
      return;
    }

    const { conversationId, content } = payload;

    console.log('conversation Id and content', conversationId, content);

    if (!conversationId) {
      client.emit('missing-conversationId', {
        success: false,
        message: 'Missing to User Id',
      });
      return;
    }

    if (!content) {
      client.emit('missing-content', {
        success: false,
        message: 'Missing Content',
      });
      return;
    }

    let existingConversatin =
      await this.conversationModel.findById(conversationId);

    console.log('existingConversation', existingConversatin);

    if (!existingConversatin) {
      client.emit('conversation-not-found', {
        success: false,
        message: 'Invalid conversation ID or unauthorized access.',
      });
      return;
    }

    if (!existingConversatin.participants.includes(fromUserId)) {
      client.emit('unauthorized', {
        success: false,
        message: 'You are not a participant in this conversation.',
      });
      return;
    }

    const message = await this.messageModel.create({
      conversationId,
      fromUserId,
      content,
    });

    console.log('message', message);

    this.server
      .to(conversationId)
      .emit('new-message', { success: true, data: message });
  }

  @SubscribeMessage('group-message')
  @UsePipes(GroupMessageDto)
  async handleGroupMessage(
    @MessageBody() payload: { conversationId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const fromUserId = client.data.userId;

    if (!fromUserId) {
      client.emit('missing-userId', {
        success: false,
        message: 'Missing user Id',
      });
      return;
    }

    const { conversationId, content } = payload;

    if (!conversationId || !content) {
      client.emit('invalid-payload', {
        success: false,
        message: 'ConversationId and content are required',
      });
      return;
    }

    const conversation = await this.conversationModel.findById(conversationId);

    if (!conversation) {
      client.emit('conversation-not-found', {
        success: false,
        message: 'Invalid conversation ID.',
      });
      return;
    }

    if (!conversation.isGroup) {
      client.emit('not-a-group', {
        success: false,
        message: 'This conversation is not a group chat.',
      });
      return;
    }

    if (!conversation.participants.includes(fromUserId)) {
      client.emit('unauthorized', {
        success: false,
        message: 'You are not a participant in this group.',
      });
      return;
    }

    const message = await this.messageModel.create({
      conversationId,
      fromUserId,
      content,
    });

    this.server
      .to(conversationId)
      .emit('group-message', { success: true, data: message });
  }
}

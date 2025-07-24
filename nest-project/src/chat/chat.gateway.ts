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
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { OneToOneMessageDto } from './dto/one-to-one-message.dto';
import { GroupMessageDto } from './dto/group-message.dto';
import { SocketFilter } from 'src/common/filters/socket/socket.filter';

@WebSocketGateway({ cors: true })
@UseFilters(SocketFilter)
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

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @SubscribeMessage('one-to-one-message')
  async handleMessage(
    @MessageBody() payload: OneToOneMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('payload', payload);
    const fromUserId = client.data.userId;
    const { content, conversationId } = payload;

    console.log('fromUserId', fromUserId);

    if (!fromUserId) {
      client.emit('missing-userId', {
        success: false,
        message: 'Missing fromUserId',
      });
      return;
    }

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

    this.server
      .to(conversationId)
      .emit('new-message', { success: true, data: message });
  }

  @UsePipes(new ValidationPipe({ whitelist: true }))
  @SubscribeMessage('group-message')
  async handleGroupMessage(
    @MessageBody() payload: GroupMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { content, conversationId } = payload;
    const fromUserId = client.data.userId;

    if (!fromUserId) {
      client.emit('missing-userId', {
        success: false,
        message: 'Missing user Id',
      });
      return;
    }

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

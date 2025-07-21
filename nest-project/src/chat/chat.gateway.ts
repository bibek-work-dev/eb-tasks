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
import { Conversation } from './schemas/conversation.schema';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly chatService: ChatService,
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}
  @WebSocketServer()
  server: Server;
  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   return 'Hello world!';
  // }
  async handleConnection(client: Socket, ...args: any[]) {
    console.log('here');

    const userId = client.handshake.query.userId as string;
    if (!userId) {
      console.log('here it was');
      client.emit('no-userId', { message: 'No user Id at all' });
      client.disconnect();
      return;
    }
    client.data.userId = userId;
  }

  handleDisconnect(client: Socket) {
    console.log('client Disconnecrted', client);
    const userId = client.data.userId;
    console.log('client disconneted', client.id);
  }

  @SubscribeMessage('one-to-one-message')
  async handleMessage(
    @MessageBody() payload: { conversationId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('payload', payload);
    const fromUserId = client.data.userId;

    if (!fromUserId) {
      client.emit('missing-userId', { message: 'Missing fromUserId' });
      return;
    }

    const { conversationId, content } = payload;

    if (!conversationId) {
      client.emit('missing-toUserId', { message: 'Missing to User Id' });
      return;
    }

    if (!content) {
      client.emit('missing-content', { message: 'Missing Content' });
      return;
    }

    let existingConversatinId =
      await this.conversationModel.findById(conversationId);
    if (!existingConversatinId) {
      existingConversatinId = await this.conversationModel.create({
        participants: [fromUserId],
      });
    }

    const message = await this.messageModel.create({
      conversationId,
      fromUserId,
      content,
    });

    client.emit('message-sent', message);

    // look for conversationId if it exist and save the message right ?
  }

  @SubscribeMessage('group-message')
  async handleGroupMessage() {}
}

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
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}
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
      client.disconnect();
      return;
    }
    client.data.userId = userId;
    const conversationIds =
      await this.chatService.getUserConversationIds(userId);

    for (const conversationId of conversationIds) {
      client.join(conversationId); // joining room man
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    console.log('client disconneted', client.id);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() payload: { toUserid: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const fromUserId = client.data.userId;

    const conversation = await this.chatService.findOrCreateConversation(
      fromUserId,
      payload.toUserid,
    );

    if (!conversation) throw new NotFoundException('Conversation is not found');

    const message = await this.chatService.createMessage(
      (conversation._id as Types.ObjectId).toString(),
      fromUserId,
      payload.toUserid,
      payload.content,
    );
  }
}

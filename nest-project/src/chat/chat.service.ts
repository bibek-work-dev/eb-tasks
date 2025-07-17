import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationDocument,
} from './schemas/conversation.schema';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async findOrCreateConversation(
    userA: string,
    userB: string,
  ): Promise<ConversationDocument> {
    const participants = [userA, userB].sort();
    let convo = await this.conversationModel.findOne({
      participants: { $all: participants, $size: 2 },
    });
    if (!convo) {
      convo = await this.conversationModel.create({ participants });
    }
    return convo;
  }

  async createMessage(
    conversationId: string,
    fromUserId: string,
    toUserId: string,
    content: string,
  ): Promise<MessageDocument> {
    const message = new this.messageModel({
      conversationId,
      fromUserId,
      toUserId,
      content,
    });

    const updatingLastMessage = await this.conversationModel.findByIdAndUpdate(
      conversationId,
      {
        lastMessage: content,
      },
    );

    if (!updatingLastMessage)
      throw new NotFoundException('No such conversation found');

    return message.save();
  }

  async getUserConversationIds(userId: string): Promise<string[]> {
    const conversations = await this.conversationModel
      .find(
        {
          participants: userId,
        },
        { _id: 1 },
      )
      .lean();

    return conversations.map((c) => c._id.toString());
  }
}

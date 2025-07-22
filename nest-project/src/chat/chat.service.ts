import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationDocument,
} from './schemas/conversation.schema';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { CreateOneToOneChatDto } from './dto/create-one-to-one-chat.dto';
import { CreateGroupChatDto } from './dto/create-group-chat.dto';
import { AddGroupMembersDto } from './dto/add-group-members.dto';
import { RemoveGroupMembersDto } from './dto/remove-group-members.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async createOneToOneConversationService(
    userId: string,
    createOneToOneChatDto: CreateOneToOneChatDto,
  ): Promise<ConversationDocument> {
    console.log('userId and create one', userId, createOneToOneChatDto);

    const participants = [userId, createOneToOneChatDto.participantId].sort();
    let conversation = await this.conversationModel.findOne({
      participants: { $all: participants, $size: 2 },
      isGroup: false,
      adminId: userId,
    });

    if (!conversation) {
      const title = `one to one conversation with ${participants.toString()}`;
      conversation = await this.conversationModel.create({
        participants,
        isGroup: false,
        adminId: userId,
      });
    } else {
      throw new ConflictException('The conversation has already been made');
    }
    return conversation;
  }

  async createGroupConversationService(
    userId: string,
    createGroupChatDto: CreateGroupChatDto,
  ): Promise<ConversationDocument> {
    const { participantIds, title } = createGroupChatDto;
    const conversation = await this.conversationModel.create({
      participants: Array.from(new Set([...participantIds, userId])),
      isGroup: true,
      adminId: userId,
      title,
    });
    return conversation;
  }

  async getMessagesForConversationService(
    userId: string,
    conversationId: string,
    limit: number,
    page: number,
  ): Promise<MessageDocument[]> {
    const conversationExists = await this.conversationModel.exists({
      _id: conversationId,
      participants: userId,
    });
    if (!conversationExists) {
      throw new NotFoundException('Conversation not found access denied');
    }

    const messages = await this.messageModel
      .find({ conversationId })
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return messages;
  }

  async findUserConversations(userId: string): Promise<ConversationDocument[]> {
    const conversations = await this.conversationModel
      .find({ participants: userId })
      .sort({ updatedAt: -1 });
    return conversations;
  }

  async addGroupMembers(
    userId: string,
    conversationId: string,

    addGroupMembersDto: AddGroupMembersDto,
  ) {
    const conversation = await this.conversationModel.findById(conversationId);
    if (!conversation) throw new NotFoundException('Conversation not found');
    if (!conversation.isGroup) {
      throw new ForbiddenException('Not a group conversation');
    }
    if (conversation.adminId.toString() !== userId) {
      throw new ForbiddenException('Only admin can add members');
    }
    const updatedParticipants = Array.from(
      new Set([
        ...conversation.participants,
        ...addGroupMembersDto.userIdsToAdd,
      ]),
    );
    conversation.participants = updatedParticipants;
    await conversation.save();
    return conversation;
  }

  async removeGroupMembers(
    userId: string,
    conversationId: string,
    removeGroupMembersDto: RemoveGroupMembersDto,
  ) {
    const conversation = await this.conversationModel.findById(conversationId);
    if (!conversation) throw new NotFoundException('Conversation not found');

    if (!conversation.isGroup) {
      throw new ForbiddenException('Not a group conversation');
    }

    if (conversation.adminId.toString() !== userId) {
      throw new ForbiddenException('Only admin can remove members');
    }

    conversation.participants = conversation.participants.filter(
      (participantId) =>
        !removeGroupMembersDto.userIdsToRemove.includes(
          participantId.toString(),
        ),
    );
    await conversation.save();
    return conversation;
  }

  async deleteConversation(userId: string, conversationId: string) {
    const conversation = await this.conversationModel.findById(conversationId);
    if (!conversation) throw new NotFoundException('Conversation not found');

    if (conversation.adminId.toString() !== userId) {
      throw new ForbiddenException(
        'Only the admin can delete the conversation',
      );
    }

    await this.messageModel.deleteMany({ conversationId });
    const deletedConversation =
      await this.conversationModel.findByIdAndDelete(conversationId);
    return deletedConversation;
  }

  async deleteMessage(userId: string, messageId: string) {
    const toBeDeletedMessage =
      await this.ensureMessageExistsAndReturnItIfItExists(messageId);
    await this.ensureMessageOwnership(userId, toBeDeletedMessage);
    const deletedMessage = await this.messageModel.findByIdAndDelete(messageId);
    return deletedMessage;
  }

  private ensureMessageOwnership(userId: string, message: MessageDocument) {
    if (message.fromUserId !== userId) {
      throw new ForbiddenException("You aren't the owner of the message");
    }
    return message;
  }

  private async ensureMessageExistsAndReturnItIfItExists(messageId: string) {
    const messageExists = await this.messageModel.findById(messageId);
    if (!messageExists) throw new NotFoundException('No such message found');

    return messageExists;
  }
}

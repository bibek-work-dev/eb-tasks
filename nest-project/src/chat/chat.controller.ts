import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  DefaultValuePipe,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { createApiResponse } from 'src/common/utils/response';
import { User } from 'src/common/decorators/user/user.decorator';
import { CreateOneToOneChatDto } from './dto/create-one-to-one-chat.dto';
import { CreateGroupChatDto } from './dto/create-group-chat.dto';
import { ValidateMongooseObjectIdPipe } from 'src/common/pipes/validate.mongoose.object-id/validate.mongoose.object-id.pipe';
import { AddGroupMembersDto } from './dto/add-group-members.dto';
import { RemoveGroupMembersDto } from './dto/remove-group-members.dto';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';

@Controller('chat')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages/:conversationId')
  async getMessages(
    @Param('conversationId', ValidateMongooseObjectIdPipe)
    conversationId: string,
    @Query('limit', new DefaultValuePipe(10)) limit: number,
    @Query('page', new DefaultValuePipe(1)) page: number,
    @User('id') userId: string,
  ) {
    const messages = await this.chatService.getMessagesForConversationService(
      userId,
      conversationId,
      +limit,
      page,
    );
    return createApiResponse('Conversation have been fetched', messages);
  }

  // 4️⃣ Get all conversations for a user
  @Get('conversations')
  async findUserConversations(@User('id') userId: string) {
    console.log('userId', userId);
    const userConversations =
      await this.chatService.findUserConversations(userId);
    return createApiResponse(
      'User Conversation have been fetched',
      userConversations,
    );
  }

  @Post('conversation')
  async createConversation(
    @User('id') userId: string,
    @Body() createOneToOneChatDto: CreateOneToOneChatDto,
  ) {
    console.log('userId in controller', userId);
    const createConversation =
      await this.chatService.createOneToOneConversationService(
        userId,
        createOneToOneChatDto,
      );

    return createApiResponse(
      'One to One Conversation created successfully',
      createConversation,
    );
  }

  @Post('group')
  async createGroupConversation(
    @User('id') userId: string,
    @Body() createGroupChatDto: CreateGroupChatDto,
  ) {
    const createGroupConversation =
      await this.chatService.createGroupConversationService(
        userId,
        createGroupChatDto,
      );

    return createApiResponse(
      'Group Conversation created successfully',
      createGroupConversation,
    );
  }

  @Patch('group/add-members/:conversationId')
  async addGroupMembers(
    @Param('conversationId', ValidateMongooseObjectIdPipe)
    conversationId: string,
    @User('id')
    userId: string,
    @Body() addGroupMembersDto: AddGroupMembersDto,
  ) {
    const updatedConversation = await this.chatService.addGroupMembers(
      userId,
      conversationId,
      addGroupMembersDto,
    );
    return createApiResponse(
      'Members added to group successfully',
      updatedConversation,
    );
  }

  @Patch('group/remove-members/:conversationId')
  async removeGroupMembers(
    @Param('conversationId', ValidateMongooseObjectIdPipe)
    conversationId: string,
    @User('id') userId: string,
    @Body() removeGroupMembersDto: RemoveGroupMembersDto,
  ) {
    const updatedConversation = await this.chatService.removeGroupMembers(
      userId,
      conversationId,
      removeGroupMembersDto,
    );
    return createApiResponse(
      'Members removed from group successfully',
      updatedConversation,
    );
  }

  @Delete('conversation/:id')
  async deleteConversation(
    @User('id') userId: string,
    @Param('id', ValidateMongooseObjectIdPipe) conversationId: string,
  ) {
    const deletedConversation = await this.chatService.deleteConversation(
      userId,
      conversationId,
    );
    return createApiResponse(
      'Conversation have been deleted',
      deletedConversation,
    );
  }

  @Delete('message/:id')
  async deleteMessage(
    @User('id') userId: string,
    @Param('id', ValidateMongooseObjectIdPipe) messageId: string,
  ) {
    console.log('id', userId);
    const deletedMessage = await this.chatService.deleteMessage(
      userId,
      messageId,
    );
    return createApiResponse('Message have been deleted', deletedMessage);
  }
}

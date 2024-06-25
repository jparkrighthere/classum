import {
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  Delete,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from './chat.service';
import { GetUser } from 'src/user.decorator';
import { User } from 'src/user/user.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateReactionDto } from './dto/create-reaction.dto';

@Controller('chat')
@UseGuards(AuthGuard('jwt'))
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('/:space_id/:post_id')
  async getChatList(
    @Param('post_id') post_id: number,
    @Param('space_id') space_id: number,
    @GetUser() user: User,
  ): Promise<
    {
      content: string;
      author?: {
        last_name: string;
        first_name: string;
        profile: string;
      };
      reactions?: {
        content: string;
        author?: {
          last_name: string;
          first_name: string;
          profile: string;
        };
      }[];
    }[]
  > {
    const chats = await this.chatService.getAllChats(space_id, post_id, user);
    return chats.map((chat) => ({
      content: chat.content,
      author: chat.author
        ? {
            last_name: chat.author.last_name,
            first_name: chat.author.first_name,
            profile: chat.author.profile,
          }
        : undefined,
      reactions:
        chat.reactions?.map((reaction) => ({
          content: reaction.content,
          author: reaction.author
            ? {
                last_name: reaction.author.last_name,
                first_name: reaction.author.first_name,
                profile: reaction.author.profile,
              }
            : undefined,
        })) || undefined,
    }));
  }

  @Get('/space_id/:post_id/:chat_id')
  async getSingleChat(
    @Param('space_id') space_id: number,
    @Param('post_id') post_id: number,
    @Param('chat_id') chat_id: number,
    @GetUser() user: User,
  ): Promise<{ content: string }> {
    const chat = await this.chatService.getChat(
      space_id,
      post_id,
      chat_id,
      user,
    );
    return { content: chat.content };
  }

  @Post()
  async addChat(
    @Body() createChatDto: CreateChatDto,
    @GetUser() user: User,
  ): Promise<{ chat_id: number }> {
    const chat = await this.chatService.addChat(createChatDto, user);
    return { chat_id: chat.chat_id };
  }

  @Delete('/:space_id/:post_id/:chat_id')
  async deleteChat(
    @Param('space_id') space_id: number,
    @Param('post_id') post_id: number,
    @Param('chat_id') chat_id: number,
    @GetUser() user: User,
  ): Promise<void> {
    await this.chatService.deleteChat(space_id, post_id, chat_id, user);
  }

  @Post('/reaction')
  async addReaction(
    @Body() createReactionDto: CreateReactionDto,
    @GetUser() user: User,
  ): Promise<{ chat_id: number }> {
    const chatId = await this.chatService.addReaction(createReactionDto, user);
    return { chat_id: chatId.chat_id };
  }
}

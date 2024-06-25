import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { PostService } from 'src/post/post.service';
import { UserSpaceRepository } from 'src/userSpace/userSpace.repository';
import { CreateChatDto } from './dto/create-chat.dto';
import { User } from 'src/user/user.entity';
import { UserSpace } from 'src/userSpace/userSpace.entity';
import { Role } from 'src/spaceRole/enum/spaceRole.enum';
import { Chat } from './chat.entity';
import { CreateReactionDto } from './dto/create-reaction.dto';

@Injectable()
export class ChatService {
  constructor(
    private chatRepository: ChatRepository,
    private postService: PostService,
    private userSpaceRepository: UserSpaceRepository,
  ) {}

  // 모든 정보를 포함한 채팅 목록
  async getChatsEntity(
    space_id: number,
    post_id: number,
    user: User,
  ): Promise<Chat[]> {
    const post = await this.postService.getPostEntity(space_id, post_id, user);
    return post.chats;
  }

  // TODO: Implement getMyChats
  async getMyChats(user: User): Promise<Chat[]> {
    return this.chatRepository.find({
      where: { author: user },
    });
  }

  // Made for specific return type
  async getAllChats(
    space_id: number,
    post_id: number,
    user: User,
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
    // check if post exists
    const post = await this.postService.getPostEntity(space_id, post_id, user);
    if (!post) {
      throw new NotFoundException('Post does not exist');
    }
    const userSpace = await this.validateUserSpace(user.user_id, space_id);
    const userRole = userSpace.spaceRole.role;
    // check if the chat is anonymous and the user is neither the author nor an admin
    const rootChats = await this.chatRepository.findAllRootChats(post);
    if (!rootChats) {
      throw new NotFoundException('Chat does not exist');
    }
    const chatList = rootChats.map((chat: Chat) => {
      const reactions = chat.children.map((child: Chat) => {
        if (
          child.isAnonymous &&
          child.author.user_id !== user.user_id &&
          userRole === Role.USER
        ) {
          return {
            content: child.content,
          };
        } else {
          return {
            content: child.content,
            author: {
              last_name: child.author.last_name,
              first_name: child.author.first_name,
              profile: child.author.profile,
            },
          };
        }
      });

      if (
        chat.isAnonymous &&
        chat.author.user_id !== user.user_id &&
        userRole === Role.USER
      ) {
        return {
          content: chat.content,
          reactions: reactions.length > 0 ? reactions : undefined,
        };
      } else {
        return {
          content: chat.content,
          author: {
            last_name: chat.author.last_name,
            first_name: chat.author.first_name,
            profile: chat.author.profile,
          },
          reactions: reactions.length > 0 ? reactions : undefined,
        };
      }
    });
    return chatList;
  }

  async getChat(
    space_id: number,
    post_id: number,
    chat_id: number,
    user: User,
  ): Promise<Chat> {
    const post = await this.postService.getPostEntity(space_id, post_id, user);
    return await this.chatRepository.findChatById(chat_id, post);
  }

  async addChat(createChatDto: CreateChatDto, user: User): Promise<Chat> {
    const { space_id, post_id, isAnonymous } = createChatDto;
    const post = await this.postService.getPostEntity(space_id, post_id, user);
    const userSpace = await this.validateUserSpace(user.user_id, space_id);
    const userRole = userSpace.spaceRole.role;
    // check if user has permission to post anonymously
    if (isAnonymous && userRole !== Role.USER) {
      throw new ForbiddenException(
        'User does not have permission to post anonymously',
      );
    }
    const chat = await this.chatRepository.createChat(
      createChatDto,
      user,
      post,
    );
    return chat;
  }

  async deleteChat(
    space_id: number,
    post_id: number,
    chat_id: number,
    user: User,
  ): Promise<void> {
    const userSpace = await this.validateUserSpace(user.user_id, space_id);
    const post = await this.postService.getPostEntity(space_id, post_id, user);
    const chat = await this.chatRepository.findChatById(chat_id, post);
    if (!chat) {
      throw new NotFoundException('Chat does not exist');
    }
    const userRole = userSpace.spaceRole.role;
    if (
      chat.author.user_id !== user.user_id &&
      userRole !== Role.ADMIN &&
      userRole !== Role.OWNER
    ) {
      throw new ForbiddenException('User is not the author of the chat');
    }
    await this.chatRepository.softRemove(chat);
  }

  async addReaction(
    createReactionDto: CreateReactionDto,
    user: User,
  ): Promise<Chat> {
    const { isAnonymous, space_id, post_id, chat_id } = createReactionDto;
    const post = await this.postService.getPostEntity(space_id, post_id, user);
    // Find the parent chat
    const parentChat = await this.chatRepository.findChatById(chat_id, post);
    if (!parentChat) {
      throw new NotFoundException('Parent chat not found');
    }
    const userSpace = await this.validateUserSpace(user.user_id, space_id);
    const userRole = userSpace.spaceRole.role;
    // check if user has permission to post anonymously
    if (isAnonymous && userRole !== Role.USER) {
      throw new ForbiddenException(
        'User does not have permission to post anonymously',
      );
    }
    const reaction = await this.chatRepository.createReaction(
      createReactionDto,
      user,
      post,
      parentChat,
    );
    return newChat;
  }

  // helper function below
  private async validateUserSpace(
    user_id: number,
    space_id: number,
  ): Promise<UserSpace> {
    const currentUserSpace = await this.userSpaceRepository.getUserSpaceByIds(
      user_id,
      space_id,
    );
    if (!currentUserSpace) {
      throw new NotFoundException('Current user not in this space');
    }
    return currentUserSpace;
  }
}

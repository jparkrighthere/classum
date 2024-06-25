import { Injectable } from '@nestjs/common';
import { Chat } from './chat.entity';
import { DataSource, Repository } from 'typeorm';
import { Post } from 'src/post/post.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class ChatRepository extends Repository<Chat> {
  constructor(dataSource: DataSource) {
    super(Chat, dataSource.createEntityManager());
  }

  async findChatById(chat_id: number, post: Post): Promise<Chat> {
    return await this.findOne({
      where: { chat_id, post },
    });
  }

  async findAllRootChats(post: Post): Promise<Chat[]> {
    return await this.find({
      where: { post, parent: null },
      relations: ['author', 'children', 'children.author'],
    });
  }

  // async findRootChatById(chat_id: number, post: Post): Promise<Chat> {
  //   return await this.findOne({
  //     where: { chat_id, post, parent: null },
  //     relations: ['author', 'children', 'children.author'],
  //   });
  // }

  async createChat(
    createdChatDto: CreateChatDto,
    user: User,
    post: Post,
  ): Promise<Chat> {
    const { content, isAnonymous } = createdChatDto;
    const chat = this.create({
      content,
      isAnonymous,
      author: user,
      post,
      parent: null,
      children: [],
    });
    try {
      await this.save(chat);
    } catch (error) {
      console.error(error);
    }
    return chat;
  }

  async createReaction(
    createdReactionDto: CreateChatDto,
    user: User,
    post: Post,
    parentChat: Chat,
  ): Promise<Chat> {
    const { content, isAnonymous } = createdReactionDto;
    const reaction = this.create({
      content,
      isAnonymous,
      author: user,
      post,
      parent: parentChat,
    });
    try {
      parentChat.children.push(reaction);
      await this.save(reaction);
    } catch (error) {
      console.error(error);
    }
    return reaction;
  }
}

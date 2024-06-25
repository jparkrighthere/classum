import { DataSource, Repository } from 'typeorm';
import { Post as PostEntity } from './post.entity';
import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from 'src/user/user.entity';
import { Space } from 'src/space/space.entity';

@Injectable()
export class PostRepository extends Repository<PostEntity> {
  constructor(dataSource: DataSource) {
    super(PostEntity, dataSource.createEntityManager());
  }

  async findPosts(space_id: number): Promise<PostEntity[]> {
    return await this.find({
      where: { space: { space_id } },
      relations: ['author'],
    });
  }

  async findPostById(post_id: number, space: Space): Promise<PostEntity> {
    return await this.findOne({
      where: { post_id, space },
      relations: ['author', 'chats', 'chats.author'],
    });
  }

  async createPost(
    createPostDto: CreatePostDto,
    user: User,
    space: Space,
  ): Promise<PostEntity> {
    const { title, content, attachment, isAnonymous, type } = createPostDto;
    const post = this.create({
      title,
      content,
      attachment,
      isAnonymous,
      type,
      author: user,
      space,
    });
    try {
      await this.save(post);
    } catch (error) {
      console.error(error);
    }
    return post;
  }

  async findPopularPosts(space_id: number): Promise<PostEntity[]> {
    const posts = await this.find({
      where: { space: { space_id } },
      relations: ['chats'],
    });
    console.log(posts);
    const popularPosts = posts
      .map((post) => ({
        post,
        commentCount: post.chats.length,
        uniqueCommenters: new Set(post.chats.map((chat) => chat.author)).size,
      }))
      .sort((a, b) => {
        if (a.commentCount !== b.commentCount) {
          return b.commentCount - a.commentCount;
        }
        return b.uniqueCommenters - a.uniqueCommenters;
      })
      .slice(0, 5)
      .map((item) => item.post);

    return popularPosts;
  }
}

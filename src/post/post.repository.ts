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
    });
  }

  async findPostById(post_id: number, space: Space): Promise<PostEntity> {
    return await this.findOne({
      where: { post_id, space },
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
}

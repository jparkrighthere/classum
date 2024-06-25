import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostRepository } from './post.repository';
import { User } from 'src/user/user.entity';
import { SpaceService } from 'src/space/space.service';
import { Post as PostEntity } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostType } from './enum/post.enum';
import { Role } from 'src/spaceRole/enum/spaceRole.enum';
import { Space } from 'src/space/space.entity';
import { UserSpace } from 'src/userSpace/userSpace.entity';
import { UserSpaceRepository } from 'src/userSpace/userSpace.repository';

@Injectable()
export class PostService {
  constructor(
    private postRepository: PostRepository,
    private spaceService: SpaceService,
    private userSpaceRepository: UserSpaceRepository,
  ) {}

  async getAllPosts(space_id: number, user: User): Promise<PostEntity[]> {
    // check if space exists
    await this.validateSpace(space_id);
    // check if user has access to space
    await this.validateUserSpace(user.user_id, space_id);
    return await this.postRepository.findPosts(space_id);
  }

  //TODO: Implement getMyPosts
  async getMyPosts(user: User): Promise<PostEntity[]> {
    console.log(user);
    const myPosts = await this.postRepository.find({
      where: { author: user },
      relations: ['author', 'post'],
    });
    console.log(myPosts);
    return myPosts;
  }

  async getPostEntity(
    space_id: number,
    post_id: number,
    user: User,
  ): Promise<PostEntity> {
    const space = await this.validateSpace(space_id);
    // check if user has access to space
    await this.validateUserSpace(user.user_id, space_id);
    // check if post exists
    const post = await this.postRepository.findPostById(post_id, space);
    if (!post) {
      throw new NotFoundException('Post does not exist');
    }
    return post;
  }

  // Made for specific return type
  async getPost(
    space_id: number,
    post_id: number,
    user: User,
  ): Promise<{
    title: string;
    content: string;
    attachment: string;
    author?: {
      last_name: string;
      first_name: string;
      profile: string;
    };
  }> {
    // check if space exists
    const space = await this.validateSpace(space_id);
    // check if user has access to space
    const userSpace = await this.validateUserSpace(user.user_id, space_id);
    const userRole = userSpace.spaceRole;
    // check if post exists
    const post = await this.postRepository.findPostById(post_id, space);
    if (!post) {
      throw new NotFoundException('Post does not exist');
    }
    // check if the post is anonymous and the user is neither the author nor an admin
    if (
      post.isAnonymous &&
      userRole.role === Role.USER &&
      post.author.user_id !== user.user_id
    ) {
      return {
        title: post.title,
        content: post.content,
        attachment: post.attachment,
      };
    } else {
      return {
        title: post.title,
        content: post.content,
        attachment: post.attachment,
        // make to return partial author info
        author: {
          last_name: post.author.last_name,
          first_name: post.author.first_name,
          profile: post.author.profile,
        },
      };
    }
  }

  async addPost(createPostDto: CreatePostDto, user: User): Promise<PostEntity> {
    // check if space exists
    const space = await this.validateSpace(createPostDto.space_id);
    // check if user has access to space
    const userSpace = await this.validateUserSpace(
      user.user_id,
      space.space_id,
    );
    const { isAnonymous, type } = createPostDto;
    const userRole = userSpace.spaceRole;
    // check if user has permission to create announcement
    if (type === PostType.ANNOUNCEMENT && userRole.role === Role.USER) {
      throw new ForbiddenException(
        'User does not have permission to create announcement',
      );
    }
    // check if announcement is anonymous
    if (type === PostType.ANNOUNCEMENT && isAnonymous) {
      throw new ForbiddenException(
        'Announcements cannot be anonymous. Please uncheck the anonymous box',
      );
    }
    // check if user has permission to create anonymous post
    if (isAnonymous && userRole.role !== Role.USER) {
      throw new ForbiddenException('Only users can create anonymous posts');
    }
    const post = await this.postRepository.createPost(
      createPostDto,
      user,
      space,
    );
    return post;
  }

  async deletePost(
    space_id: number,
    post_id: number,
    user: User,
  ): Promise<void> {
    // check if space exists
    const space = await this.validateSpace(space_id);
    // check if user has access to space
    const userSpace = await this.validateUserSpace(
      user.user_id,
      space.space_id,
    );
    // check if post exists
    const post = await this.postRepository.findPostById(post_id, space);
    if (!post) {
      throw new NotFoundException('Post does not exist');
    }
    // check if user is either the author of the post or an admin
    const userRole = userSpace.spaceRole;
    if (
      post.author.user_id !== user.user_id &&
      userRole.role !== Role.ADMIN &&
      userRole.role !== Role.OWNER
    ) {
      throw new ForbiddenException(
        'User does not have permission to delete post',
      );
    }
    await this.postRepository.softRemove(post);
  }

  async getPopularPosts(space_id: number): Promise<PostEntity[]> {
    // check if space exists
    await this.validateSpace(space_id);
    return await this.postRepository.findPopularPosts(space_id);
  }

  // helper functions below
  private async validateSpace(space_id: number): Promise<Space> {
    const space = await this.spaceService.getSpace(space_id);
    if (!space) {
      throw new NotFoundException('Space not found');
    }
    return space;
  }

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

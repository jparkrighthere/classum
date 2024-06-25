import {
  Controller,
  Delete,
  UseGuards,
  Post,
  Get,
  Param,
  UsePipes,
  ValidationPipe,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PostService } from './post.service';
import { User } from 'src/user/user.entity';
import { GetUser } from 'src/user.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { Chat } from 'src/chat/chat.entity';

@Controller('post')
@UseGuards(AuthGuard('jwt'))
export class PostController {
  constructor(private postService: PostService) {}

  @Get('/:space_id')
  async getPostList(
    @GetUser() user: User,
    @Param('space_id') space_id: number,
  ): Promise<string[]> {
    const posts = await this.postService.getAllPosts(space_id, user);
    return posts.map((post) => post.title);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async addPost(
    @Body() createPostDto: CreatePostDto,
    @GetUser() user: User,
  ): Promise<{ post_id: number }> {
    const postId = await this.postService.addPost(createPostDto, user);
    return { post_id: postId.post_id };
  }

  @Delete('/:space_id/:post_id')
  async deletePost(
    @Param('space_id') space_id: number,
    @Param('post_id') post_id: number,
    @GetUser() user: User,
  ): Promise<void> {
    await this.postService.deletePost(space_id, post_id, user);
  }

  @Get('/:space_id/:post_id')
  async getPost(
    @GetUser() user: User,
    @Param('space_id') space_id: number,
    @Param('post_id') post_id: number,
  ): Promise<
    Promise<{
      title: string;
      content: string;
      attachment: string;
      chats: Chat[];
      author?: Partial<User>;
    }>
  > {
    const post = await this.postService.getPost(space_id, post_id, user);
    return post;
  }

  @Get('/popular/:space_id')
  async getPopularPosts(
    @Param('space_id') space_id: number,
  ): Promise<string[]> {
    const topFivePosts = await this.postService.getPopularPosts(space_id);
    return topFivePosts.map((post) => post.title);
  }
}

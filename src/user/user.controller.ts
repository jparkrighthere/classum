import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UsePipes,
  ValidationPipe,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { GetUser } from 'src/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ChatService } from 'src/chat/chat.service';
import { PostService } from 'src/post/post.service';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(
    private userService: UserService,
    private postService: PostService,
    private chatService: ChatService,
  ) {}

  @Get()
  async getProfile(@GetUser() user: User): Promise<User> {
    return user;
  }

  @Patch()
  @UsePipes(ValidationPipe)
  async updateProfile(
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    if (updateUserDto.email) {
      throw new BadRequestException('Email update is not allowed');
    }
    return await this.userService.updateProfile(user.user_id, updateUserDto);
  }

  @Get('/:user_id')
  async getUserProfile(
    @Param('user_id') user_id: number,
  ): Promise<Partial<User>> {
    const user = await this.userService.findUserById(user_id);
    const safeUser = {
      last_name: user.last_name,
      first_name: user.first_name,
      profile: user.profile,
    };
    return safeUser;
  }

  @Get('/searchPosts')
  async searchUserPosts(@GetUser() user: User): Promise<string[]> {
    const userPosts = await this.postService.getMyPosts(user);
    return userPosts.map((post) => post.title);
  }

  @Get('/searchChats')
  async searchUserChats(@GetUser() user: User): Promise<string[]> {
    const userChats = await this.chatService.getMyChats(user);
    return userChats.map((chat) => chat.content);
  }
}

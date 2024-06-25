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
import { Post } from 'src/post/post.entity';
import { Chat } from 'src/chat/chat.entity';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  async getProfile(@GetUser() user: User): Promise<Partial<User>> {
    // return user's email, first_name, last_name, and profile
    const returnUser = {
      email: user.email,
      last_name: user.last_name,
      first_name: user.first_name,
      profile: user.profile,
    };
    return returnUser;
  }

  @Patch('profile')
  @UsePipes(ValidationPipe)
  async updateProfile(
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Partial<User>> {
    if (updateUserDto.email) {
      throw new BadRequestException('Email update is not allowed');
    }
    const updateProfile = await this.userService.updateProfile(
      user.user_id,
      updateUserDto,
    );
    // return user's email, password, first_name, last_name, and profile
    const returnUser = {
      email: updateProfile.email,
      password: updateProfile.password,
      last_name: updateProfile.last_name,
      first_name: updateProfile.first_name,
      profile: updateProfile.profile,
    };
    return returnUser;
  }

  @Get('profile/:user_id')
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

  @Get('/posts')
  async getUserPosts(@GetUser() user: User): Promise<Post[]> {
    return user.posts;
  }

  @Get('/chats')
  async getUserChats(@GetUser() user: User): Promise<Chat[]> {
    return user.chats;
  }
}

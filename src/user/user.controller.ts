import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { GetUser as UserEntity } from 'src/user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // Update user
  @Patch('id/:user_id')
  @UsePipes(ValidationPipe)
  async updateUser(
    @UserEntity() user: { user_id: number } | undefined, // 문제 있음
    @Param('user_id', ParseIntPipe) user_id: number,
    @Body() updateUser: UpdateUserDto,
  ) {
    if (user.user_id !== user_id) {
      throw new UnauthorizedException();
    }
    Logger.log(updateUser);
    return this.userService.updateUser(user_id, updateUser);
  }

  // Get a user by id
  @Get('/id/:user_id')
  async getUserById(
    @Param('user_id', ParseIntPipe) user_id: number,
  ): Promise<User> {
    return this.userService.getUserById(user_id);
  }

  // Get a user by email
  @Get('/email/:email')
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    return this.userService.getUserByEmail(email);
  }
}

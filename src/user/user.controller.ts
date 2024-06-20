import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { User as UserEntity } from 'src/user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // Create user
  @Post('/create')
  @UsePipes(ValidationPipe)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  // Update user
  @Patch('id/:user_id')
  @UsePipes(ValidationPipe)
  async updateUser(
    @UserEntity() user: { user_id: number } | undefined,
    @Param('user_id', ParseIntPipe) user_id: number,
    @Body() updateUser: UpdateUserDto,
  ) {
    if (user.user_id !== user_id) {
      throw new UnauthorizedException();
    }
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

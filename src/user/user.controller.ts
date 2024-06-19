import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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
  @Post()
  @UsePipes(ValidationPipe)
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  // Update user
  @Patch('/:id')
  @UsePipes(ValidationPipe)
  async updateUser(
    @UserEntity() user: { user_id: number },
    @Param('user_id', ParseIntPipe) user_id: number,
    @Body() updateUser: UpdateUserDto,
  ) {
    if (user.user_id !== user_id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return this.userService.updateUser(user_id, updateUser);
  }

  // Get a user by id
  @Get('/:id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.userService.getUserById(Number(id));
  }

  // Get a user by email
  @Get('/:email')
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    return this.userService.getUserByEmail(email);
  }
}

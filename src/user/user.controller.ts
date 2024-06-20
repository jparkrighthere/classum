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

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  async getProfile(@GetUser() user: User): Promise<User> {
    return user;
  }

  @Patch('profile')
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

  @Get(':user_id')
  async getUserProfile(
    @Param('user_id') user_id: number,
  ): Promise<Partial<User>> {
    // if (user.user_id !== user_id) {
    //   throw new UnauthorizedException(
    //     'You are not authorized to view this profile',
    //   );
    // }
    return await this.userService.findUserById(user_id);
  }
}

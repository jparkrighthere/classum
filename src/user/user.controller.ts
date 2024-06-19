import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // Read all users
  @Get()
  async readAll(): Promise<User[]> {
    return this.userService.readAll();
  }

  // Read one user by id
  @Get(':id')
  async readOne(@Param('id') id: number): Promise<User> {
    return this.userService.readOne(Number(id));
  }

  // login
  @Post('/login')
  async login(@Body() user: User): Promise<User> {
    return this.userService.login(user.email, user.password);
  }

  // login with refresh token
  @Post('/login/refresh')
  async loginRefresh(@Body() body): Promise<User> {
    return this.userService.loginRefresh(body.refreshToken);
  }
}

import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Sign up endpoint
  @Post('/signup')
  @UsePipes(ValidationPipe)
  async signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.authService.signUp(createUserDto);
  }

  // Sign in endpoint
  @Post('/signin')
  @UsePipes(ValidationPipe)
  async signIn(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authService.signIn(authCredentialsDto);
  }
}

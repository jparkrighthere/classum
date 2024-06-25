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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Sign up endpoint
  @Post('/signup')
  @UsePipes(ValidationPipe)
  async signUp(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ user_id: number }> {
    const user = await this.authService.signUp(createUserDto);
    return { user_id: user.user_id };
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

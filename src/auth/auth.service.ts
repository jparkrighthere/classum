import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { UserRepository } from 'src/user/user.repository';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  // Sign up and create user
  async signUp(createUserDto: CreateUserDto): Promise<User> {
    console.log(createUserDto);
    let user = await this.userRepository.getUserByEmail(createUserDto.email);
    console.log(user);
    if (user !== null) {
      throw new ConflictException('User already exists');
    } else {
      user = await this.userRepository.createUser(createUserDto);
    }
    return user;
  }

  // Sign in and return JWT token
  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = authCredentialsDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { email };
      const accessToken = await this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

      return { accessToken, refreshToken };
    } else {
      throw new UnauthorizedException('login failed');
    }
  }
}

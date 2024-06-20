import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { UserRepository } from 'src/user/user.repository';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  // Sign up and create user
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    // console.log(authCredentialsDto);
    const user = await this.userRepository.getUserByEmail(
      authCredentialsDto.email,
    );
    // console.log(user);
    if (user !== null) {
      throw new ConflictException('User already exists');
    } else {
      await this.userRepository.createUser(authCredentialsDto);
    }
  }

  // Sign in and return JWT token
  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = authCredentialsDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { email };
      const accessToken = await this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('login failed');
    }
  }
}

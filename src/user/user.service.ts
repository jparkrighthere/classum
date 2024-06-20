import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  // Create user
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    let user = await this.userRepository.getUserByEmail(createUserDto.email);
    if (user !== null) {
      throw new ConflictException('User already exists');
    } else {
      user = await this.userRepository.createUser(createUserDto);
    }
    return user;
  }

  // Update user
  async updateUser(user_id: number, user: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userRepository.updateUser(user_id, user);
    return updatedUser;
  }

  // Read one user by id
  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.getUserById(id);
    return user;
  }

  // Read user by email
  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.getUserByEmail(email);
    return user;
  }
}

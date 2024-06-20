import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  // Update user
  async updateProfile(user_id: number, user: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userRepository.updateUser(user_id, user);
    return updatedUser;
  }

  async findUserById(user_id: number): Promise<Partial<User>> {
    const user = await this.userRepository.getUserById(user_id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // // Read all users
  // async getAllUsers(id: number): Promise<User[]> {
  //   const self = await this.userRepository.findOne({
  //     where: { user_id: id },
  //   });
  //   const users = await this.userRepository.find();
  //   users.forEach((user) => {
  //     if (user.email !== self.email) {
  //       delete user.email;
  //     }
  //   });
  //   return users;
  // }
}

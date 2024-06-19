import { User } from './user.entity';
import { DataSource } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

export const UserRepository = (dataSource: DataSource) => {
  return dataSource.getRepository(User).extend({
    async createUser(createUserDto: CreateUserDto): Promise<User> {
      const user = this.create(createUserDto);
      return this.save(user);
    },

    async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
      const user = await this.findOne({
        where: { user_id: id },
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      Object.keys(updateUserDto).forEach((key) => {
        user[key] = updateUserDto[key];
      });
      return this.save(user);
    },

    async getUserByEmail(email: string): Promise<User> {
      const user = await this.findOne({
        where: { email },
      });
      if (user) {
        return user;
      } else {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    },

    async getUserById(id: number): Promise<User> {
      const user = await this.findOne({
        where: { user_id: id },
      });
      if (user) {
        return user;
      } else {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    },
  });
};

export type UserRepositoryType = ReturnType<typeof UserRepository>;

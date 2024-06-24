import { User } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, last_name, first_name, profile } = createUserDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.create({
      email,
      password: hashedPassword,
      last_name,
      first_name,
      profile,
    });
    try {
      await this.save(user);
    } catch (error) {
      console.log(error);
    }
    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne({
      where: { user_id: id },
    });
    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;
    }
    if (updateUserDto.first_name) {
      user.first_name = updateUserDto.first_name;
    }
    if (updateUserDto.last_name) {
      user.last_name = updateUserDto.last_name;
    }
    if (updateUserDto.profile) {
      user.profile = updateUserDto.profile;
    }
    await this.save(user);
    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.findOne({
      where: { email },
    });
    return user;
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.findOne({
      where: { user_id: id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}

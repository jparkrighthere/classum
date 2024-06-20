import { User } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.create(createUserDto);
    return this.save(user);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne({
      where: { user_id: id },
    });
    if (!user) {
      throw new NotFoundException();
    }
    Object.keys(updateUserDto).forEach((key) => {
      user[key] = updateUserDto[key];
    });
    return this.save(user);
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
    return user;
  }
}

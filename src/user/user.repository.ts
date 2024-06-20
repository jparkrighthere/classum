import { User } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthCredentialsDto } from 'src/auth/dto/auth-credential.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { email, password } = authCredentialsDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.create({ email, password: hashedPassword });
    try {
      await this.save(user);
    } catch (error) {
      console.log(error);
    }
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

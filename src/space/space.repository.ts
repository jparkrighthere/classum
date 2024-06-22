import { DataSource, Repository } from 'typeorm';
import { Space } from './space.entity';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';

@Injectable()
export class SpaceRepository extends Repository<Space> {
  constructor(dataSource: DataSource) {
    super(Space, dataSource.createEntityManager());
  }

  async getSpaceById(id: number): Promise<Space> {
    return this.findOne({ where: { space_id: id } });
  }

  async findSpaces(user: User): Promise<Space[]> {
    return this.find({
      where: { userSpaces: { user }, deletedAt: null },
      relations: ['spaceRoles'],
    });
  }

  async getAllSpaces(): Promise<Space[]> {
    return this.find();
  }
}

import { DataSource, Equal, Repository } from 'typeorm';
import { UserSpace } from './userSpace.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserSpaceRepository extends Repository<UserSpace> {
  constructor(dataSource: DataSource) {
    super(UserSpace, dataSource.createEntityManager());
  }

  async getUserSpaceByIds(userId: number, spaceId: number): Promise<UserSpace> {
    return await this.findOne({
      where: {
        user: Equal(userId),
        space: Equal(spaceId),
      },
      relations: ['space', 'spaceRole', 'user'],
    });
  }
}

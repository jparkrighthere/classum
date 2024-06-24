import { DataSource, Equal, Repository } from 'typeorm';
import { UserSpace } from './userSpace.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserSpaceRepository extends Repository<UserSpace> {
  constructor(dataSource: DataSource) {
    super(UserSpace, dataSource.createEntityManager());
  }

  async getUserSpaceByIds(
    user_id: number,
    space_id: number,
  ): Promise<UserSpace> {
    return await this.findOne({
      where: {
        user: Equal(user_id),
        space: Equal(space_id),
      },
      relations: ['space', 'spaceRole', 'user'],
    });
  }

  async getUserSpaceBySpaceAndSpaceRole(
    space_id: number,
    role_id: number,
  ): Promise<UserSpace> {
    return await this.findOne({
      where: {
        space: Equal(space_id),
        spaceRole: Equal(role_id),
      },
      relations: ['space', 'spaceRole', 'user'],
    });
  }
}

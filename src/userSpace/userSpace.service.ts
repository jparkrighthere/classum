import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSpaceRepository } from './userSpace.repository';
import { User } from '../user/user.entity';
import { Space } from '../space/space.entity';
import { SpaceRole } from '../spaceRole/spaceRole.entity';
import { UserSpace } from './userSpace.entity';

@Injectable()
export class UserSpaceService {
  constructor(
    @InjectRepository(UserSpaceRepository)
    private readonly userSpaceRepository: UserSpaceRepository,
  ) {}

  async connectUserSpace(
    user: User,
    space: Space,
    spaceRole: SpaceRole,
  ): Promise<UserSpace> {
    const relations = this.userSpaceRepository.create({
      user,
      space,
      spaceRole,
    });

    return await this.userSpaceRepository.save(relations);
  }

  async findUserSpace(userId: number, spaceId: number): Promise<UserSpace> {
    return this.userSpaceRepository.getUserSpaceByIds(userId, spaceId);
  }

  async removeUserSpace(userSpace: UserSpace): Promise<void> {
    await this.userSpaceRepository.softRemove(userSpace);
  }
}

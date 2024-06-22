import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SpaceRepository } from './space.repository';
import { Space } from './space.entity';
import { CreateSpaceDto } from './dto/create-space.dto';
import { SpaceRoleService } from 'src/spaceRole/spaceRole.service';
import { User } from 'src/user/user.entity';
import { UserSpaceService } from 'src/userSpace/userSpace.service';
import { Role } from 'src/spaceRole/enum/spaceRole.enum';
import { UserSpace } from 'src/userSpace/userSpace.entity';
import { JoinSpaceDto } from './dto/join-space.dto';
import { SpaceRoleRepository } from 'src/spaceRole/spaceRole.repository';
import { UserSpaceRepository } from 'src/userSpace/userSpace.repository';

@Injectable()
export class SpaceService {
  constructor(
    private spaceRepository: SpaceRepository,
    private spaceRoleRepository: SpaceRoleRepository,
    private userSpaceRepository: UserSpaceRepository,
    private userSpaceService: UserSpaceService,
    private spaceRoleService: SpaceRoleService,
  ) {}

  async addSpace(createSpaceDto: CreateSpaceDto, user: User): Promise<Space> {
    const { name, logo, spaceRoles, ownerSpaceRole } = createSpaceDto;

    const userAccessCode = this.generatedAccessCode(8);
    const adminAccessCode = this.generatedAccessCode(8);
    console.log(createSpaceDto);

    // Add space roles in the database
    const savedSpaceRoles =
      await this.spaceRoleService.addSpaceRoles(spaceRoles);

    console.log(savedSpaceRoles);

    // Find the owner space role
    const userSpaceRole = savedSpaceRoles.find(
      (spaceRole) =>
        spaceRole.name === ownerSpaceRole.name && spaceRole.role === Role.OWNER,
    );

    console.log(userSpaceRole);

    // Create a new space
    const space = this.spaceRepository.create({
      name,
      logo,
      userAccessCode,
      adminAccessCode,
      spaceRoles: savedSpaceRoles,
    });

    console.log(space);

    // Save the space in the database
    const savedSpace = await this.spaceRepository.save(space);
    const connection = await this.userSpaceService.connectUserSpace(
      user,
      savedSpace,
      userSpaceRole,
    );
    console.log(connection);
    return savedSpace;
  }

  private generatedAccessCode(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }

  async getSpaces(user: User): Promise<Space[]> {
    return await this.spaceRepository.findSpaces(user);
  }

  async joinSpace(joinSpaceDto: JoinSpaceDto, user: User): Promise<UserSpace> {
    const { space_id, accessCode } = joinSpaceDto;
    // check if space exists
    const space = await this.spaceRepository.getSpaceById(space_id);
    if (!space) {
      throw new NotFoundException('Space not found');
    }

    // check if user is already in the space
    const userSpace = await this.userSpaceService.findUserSpace(
      user.user_id,
      space_id,
    );

    if (userSpace && userSpace.deletedAt == null) {
      throw new BadRequestException('User already in this space');
    }

    // check if access code is for user or admin
    if (accessCode === space.userAccessCode) {
      const newUserSpace = await this.userSpaceService.connectUserSpace(
        user,
        space,
        space.spaceRoles.find((spaceRole) => spaceRole.role === Role.USER),
      );
      console.log(newUserSpace);
      return newUserSpace;
    } else if (accessCode === space.adminAccessCode) {
      const newUserSpace = this.userSpaceService.connectUserSpace(
        user,
        space,
        space.spaceRoles.find((spaceRole) => spaceRole.role === Role.ADMIN),
      );
      return newUserSpace;
    } else {
      throw new BadRequestException('Access code is incorrect');
    }
  }

  async deleteSpace(space_id: number, user: User): Promise<Space> {
    // check if space exists
    const space = await this.spaceRepository.getSpaceById(space_id);
    if (!space) {
      throw new NotFoundException('Space not found');
    }
    if (space.deletedAt) {
      throw new NotFoundException('Space already deleted');
    }

    // check if user is in the space
    const userSpace = await this.userSpaceService.findUserSpace(
      user.user_id,
      space_id,
    );
    if (!userSpace) {
      throw new NotFoundException('User not in this space');
    }
    if (userSpace.deletedAt) {
      throw new NotFoundException('User already deleted from this space');
    }

    // check if user is the owner of the space
    const ownerSpaceRole = space.spaceRoles.find(
      (spaceRole) => spaceRole.role === Role.OWNER,
    );
    if (userSpace.spaceRole.role_id !== ownerSpaceRole.role_id) {
      throw new BadRequestException('User is not the owner of the space');
    }

    // Delete userSpaces entity first
    for (const userSpace of space.userSpaces) {
      await this.userSpaceRepository.softRemove(userSpace);
    }

    return await this.spaceRepository.softRemove(space);
  }
}

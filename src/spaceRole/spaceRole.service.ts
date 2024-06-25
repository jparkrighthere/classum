import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SpaceRoleRepository } from './spaceRole.repository';
import { CreateSpaceRoleDto } from './dto/create-spaceRole.dto';
import { SpaceRole } from './spaceRole.entity';
import { Role } from './enum/spaceRole.enum';
import { UserSpaceRepository } from 'src/userSpace/userSpace.repository';
import { User } from 'src/user/user.entity';
import { UserSpaceService } from 'src/userSpace/userSpace.service';
import { UserService } from 'src/user/user.service';
import { SpaceRepository } from 'src/space/space.repository';
import { Space } from 'src/space/space.entity';
import { UserSpace } from 'src/userSpace/userSpace.entity';

@Injectable()
export class SpaceRoleService {
  constructor(
    private spaceRoleRepository: SpaceRoleRepository,
    private spaceRepository: SpaceRepository,
    private userSpaceRepository: UserSpaceRepository,
    private userSpaceService: UserSpaceService,
    private userService: UserService,
  ) {}

  async addSpaceRole(
    createSpaceRoleDto: CreateSpaceRoleDto,
    user: User,
  ): Promise<SpaceRole> {
    // check if the space exists
    const space = await this.validateSpace(createSpaceRoleDto.space_id);
    // check if the current user is in the space
    const currentUserSpace = await this.validateUserSpace(
      user.user_id,
      createSpaceRoleDto.space_id,
    );
    // check if the current user is an admin or owner
    const currentUserSpaceRole = currentUserSpace.spaceRole;
    if (
      currentUserSpaceRole.role !== Role.OWNER &&
      currentUserSpaceRole.role !== Role.ADMIN
    ) {
      throw new BadRequestException('Current user is not an admin or owner');
    }
    const { name } = createSpaceRoleDto;
    // check if the role is already defined
    let spaceRole = space.spaceRoles.find(
      (spaceRole) => spaceRole.name === name,
    );
    if (spaceRole) {
      throw new ConflictException(
        'This role is already defined and cannot be duplicated.',
      );
    }
    spaceRole = await this.spaceRoleRepository.createSpaceRole(
      createSpaceRoleDto,
      space,
    );
    return spaceRole;
  }

  async addSpaceRoles(spaceRoles: CreateSpaceRoleDto[]): Promise<SpaceRole[]> {
    const newSpaceRoles: SpaceRole[] = [];
    for (const spaceRoleDto of spaceRoles) {
      const newSpaceRole = this.spaceRoleRepository.create({
        name: spaceRoleDto.name,
        role: spaceRoleDto.role,
      });
      newSpaceRoles.push(newSpaceRole);
    }
    const savedRoles = await this.spaceRoleRepository.save(newSpaceRoles);
    return savedRoles;
  }

  async deleteSpaceRole(
    createSpaceRoleDto: CreateSpaceRoleDto,
    user: User,
  ): Promise<void> {
    // check if space exists
    const space = await this.validateSpace(createSpaceRoleDto.space_id);
    // check if the current user is in the space
    const userSpace = await this.validateUserSpace(
      user.user_id,
      createSpaceRoleDto.space_id,
    );
    // check if the current user is an admin or owner
    const userSpaceRole = userSpace.spaceRole;
    if (
      userSpaceRole.role !== Role.OWNER &&
      userSpaceRole.role !== Role.ADMIN
    ) {
      throw new BadRequestException('Current user is not an admin or owner');
    }
    // check if spaceRole exists in this space
    const spaceRole = await this.validateSpaceRole(
      createSpaceRoleDto.name,
      createSpaceRoleDto.role,
      space,
    );
    // check if spaceRole is assigned to a user
    const deleteUserSpace = spaceRole.userSpaces;
    if (deleteUserSpace !== null) {
      throw new BadRequestException(
        'Cannot delete SpaceRole as it is assigned to a user',
      );
    }
    await this.spaceRoleRepository.deleteSpaceRole(spaceRole);
  }

  async updateSpaceRole(
    createSpaceRoleDto: CreateSpaceRoleDto,
    user_id: number,
    user: User,
  ): Promise<SpaceRole> {
    // check if space exists
    const space = await this.validateSpace(createSpaceRoleDto.space_id);
    // check if the owner is in the space
    const ownerUserSpace = await this.userSpaceRepository.getUserSpaceByIds(
      user.user_id,
      createSpaceRoleDto.space_id,
    );
    if (!ownerUserSpace) {
      throw new NotFoundException('Owner not in this space');
    }
    const ownerSpaceRole = ownerUserSpace.spaceRole;
    if (ownerSpaceRole.role !== Role.OWNER) {
      throw new BadRequestException('User is not the owner of this space');
    }
    // check if the user is in the space
    const userSpace = await this.validateUserSpace(user_id, space.space_id);
    const userSpaceRole = userSpace.spaceRole;
    if (!userSpaceRole) {
      throw new NotFoundException('User does not have a role in this space');
    }
    // check if the chosen spaceRole exists in this space
    const spaceRole = await this.validateSpaceRole(
      createSpaceRoleDto.name,
      createSpaceRoleDto.role,
      space,
    );
    // check if the chosen spaceRole is assigned to an another user
    const chosenUserSpace =
      await this.userSpaceRepository.getUserSpaceBySpaceAndSpaceRole(
        createSpaceRoleDto.space_id,
        spaceRole.role_id,
      );
    if (chosenUserSpace) {
      throw new BadRequestException(
        'Cannot delete SpaceRole as it is assigned to a user',
      );
    }
    // update
    await this.userSpaceRepository.softRemove(userSpace);
    const chosenUser = await this.userService.findUserById(user_id);
    await this.userSpaceService.connectUserSpace(chosenUser, space, spaceRole);

    return spaceRole;
  }

  async assignOwnerRole(
    user_id: number,
    space_id: number,
    user: User,
  ): Promise<void> {
    // check if space exists
    const space = await this.validateSpace(space_id);

    // check if the user is in the space
    const userSpace = await this.validateUserSpace(user_id, space_id);
    if (!userSpace) {
      throw new BadRequestException('User is not in the space');
    }
    const userSpaceRole = userSpace.spaceRole;

    // check if the owner is in the space
    const ownerUserSpace = await this.validateUserSpace(user.user_id, space_id);
    if (!ownerUserSpace) {
      throw new BadRequestException('Owner is not in the space');
    }
    const ownerSpaceRole = ownerUserSpace.spaceRole;
    if (ownerSpaceRole.role !== Role.OWNER) {
      throw new BadRequestException(
        'Current user is not the owner of this space',
      );
    }
    const chosenUser = await this.userService.findUserById(user_id);
    await this.userSpaceService.connectUserSpace(
      chosenUser,
      space,
      ownerSpaceRole,
    );
    const ownerUser = await this.userService.findUserById(user.user_id);
    await this.userSpaceService.connectUserSpace(
      ownerUser,
      space,
      userSpaceRole,
    );
    // Delete the old user space roles
    await this.userSpaceRepository.softRemove(userSpace);
    await this.userSpaceRepository.softRemove(ownerUserSpace);
  }

  async getSpaceRoles(space_id: number): Promise<SpaceRole[]> {
    // check if space exists
    const space = await this.spaceRepository.getSpaceById(space_id);
    if (!space) {
      throw new NotFoundException('Space not found');
    }
    const spaceRoles =
      await this.spaceRoleRepository.getAllSpaceRoles(space_id);
    return spaceRoles;
  }

  async getMySpaceRole(space_id: number, user: User): Promise<SpaceRole> {
    const space = await this.spaceRepository.getSpaceById(space_id);
    if (!space) {
      throw new NotFoundException('Space not found');
    }
    const userSpace = await this.userSpaceRepository.getUserSpaceByIds(
      user.user_id,
      space_id,
    );
    if (!userSpace) {
      throw new NotFoundException('User not in this space');
    }
    const userSpaceRole = userSpace.spaceRole;
    return userSpaceRole;
  }

  // helper functions below
  private async validateSpace(space_id: number): Promise<Space> {
    const space = await this.spaceRepository.getSpaceById(space_id);
    if (!space) {
      throw new NotFoundException('Space not found');
    }
    return space;
  }

  private async validateUserSpace(
    user_id: number,
    space_id: number,
  ): Promise<UserSpace> {
    const currentUserSpace = await this.userSpaceRepository.getUserSpaceByIds(
      user_id,
      space_id,
    );
    if (!currentUserSpace) {
      throw new NotFoundException('Current user not in this space');
    }
    return currentUserSpace;
  }

  private async validateSpaceRole(
    name: string,
    role: Role,
    space: Space,
  ): Promise<SpaceRole> {
    const spaceRole =
      await this.spaceRoleRepository.getSpaceRoleByNameRoleSpace(
        name,
        role,
        space,
      );
    if (!spaceRole) {
      throw new NotFoundException('SpaceRole not found');
    }
    return spaceRole;
  }
}

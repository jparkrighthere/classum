import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SpaceRepository } from 'src/space/space.repository';
import { SpaceRoleRepository } from './spaceRole.repository';
import { CreateSpaceRoleDto } from './dto/create-spaceRole.dto';
import { SpaceRole } from './spaceRole.entity';
import { DeleteSpaceRoleDto } from './dto/delete-spaceRole.dto';
import { UpdateSpaceRoleDto } from './dto/update-spaceRole.dto';
import { Role } from './enum/spaceRole.enum';
import { UserSpaceRepository } from 'src/userSpace/userSpace.repository';
import { User } from 'src/user/user.entity';

@Injectable()
export class SpaceRoleService {
  constructor(
    private spaceRoleRepository: SpaceRoleRepository,
    private spaceRepository: SpaceRepository,
    private userSpaceRepository: UserSpaceRepository,
  ) {}

  async addSpaceRole(
    createSpaceRoleDto: CreateSpaceRoleDto,
    space_id: number,
  ): Promise<SpaceRole> {
    const space = await this.spaceRepository.getSpaceById(space_id);
    if (!space) {
      throw new NotFoundException('Space not found');
    }

    const { role, name } = createSpaceRoleDto;
    let spaceRole = space.spaceRoles.find(
      (spaceRole) => spaceRole.role === role && spaceRole.name === name,
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
    deleteSpaceRoleDto: DeleteSpaceRoleDto,
    user: User,
  ): Promise<void> {
    // check if space exists
    const space = await this.spaceRepository.getSpaceById(
      deleteSpaceRoleDto.space_id,
    );
    if (!space) {
      throw new NotFoundException('Space not found');
    }
    // check if spaceRole exists in this space
    const spaceRole =
      await this.spaceRoleRepository.getSpaceRoleByNameRoleSpace(
        deleteSpaceRoleDto.spaceRole.name,
        deleteSpaceRoleDto.spaceRole.role,
        space,
      );

    if (!spaceRole) {
      throw new NotFoundException('SpaceRole not found');
    }

    // check if spaceRole is assigned to a user
    const userSpace = spaceRole.userSpaces;
    if (userSpace.length > 0) {
      throw new BadRequestException(
        'Cannot delete SpaceRole as it is assigned to a user',
      );
    }

    // check if the current user is in the space
    const currentUserSpace = await this.userSpaceRepository.getUserSpaceByIds(
      user.user_id,
      deleteSpaceRoleDto.space_id,
    );
    if (!currentUserSpace) {
      throw new NotFoundException('Current user not in this space');
    }
    const currentUserSpaceRole = currentUserSpace.spaceRole;
    if (
      currentUserSpaceRole.role !== Role.OWNER &&
      currentUserSpaceRole.role !== Role.ADMIN
    ) {
      throw new BadRequestException('Current user is not an admin or owner');
    }

    await this.spaceRoleRepository.deleteSpaceRole(spaceRole);
  }

  async updateSpaceRole(
    updateSpaceRoleDto: UpdateSpaceRoleDto,
    user_id: number,
    user: User,
  ): Promise<SpaceRole> {
    // check if space exists
    const space = await this.spaceRepository.getSpaceById(
      updateSpaceRoleDto.space_id,
    );
    if (!space) {
      throw new NotFoundException('Space not found');
    }

    // check if the user is in the space
    const userSpace = await this.userSpaceRepository.getUserSpaceByIds(
      user_id,
      updateSpaceRoleDto.space_id,
    );
    if (!userSpace) {
      throw new NotFoundException('User not in this space');
    }
    const userSpaceRole = userSpace.spaceRole;
    if (!userSpaceRole) {
      throw new NotFoundException('User does not have a role in this space');
    }
    const userRoleId = userSpaceRole.role_id;

    // check if the owner is in the space
    const ownerUserSpace = await this.userSpaceRepository.getUserSpaceByIds(
      user.user_id,
      updateSpaceRoleDto.space_id,
    );
    if (!ownerUserSpace) {
      throw new NotFoundException('Owner not in this space');
    }
    const ownerSpaceRole = ownerUserSpace.spaceRole;
    if (ownerSpaceRole.role !== Role.OWNER) {
      throw new BadRequestException('User is not the owner of this space');
    }

    // check if spaceRole exists in this space
    const spaceRole =
      await this.spaceRoleRepository.getSpaceRoleByNameRoleSpace(
        updateSpaceRoleDto.spaceRole.name,
        updateSpaceRoleDto.spaceRole.role,
        space,
      );
    if (!spaceRole) {
      throw new NotFoundException('Chosen SpaceRole not found');
    }
    const updatedSpaceRole = await this.spaceRoleRepository.updateSpaceRole(
      updateSpaceRoleDto,
      userRoleId,
    );

    return updatedSpaceRole;
  }

  async assignOwnerRole(user_id: number, space_id, user: User): Promise<void> {
    // check if space exists
    const space = await this.spaceRepository.getSpaceById(space_id);
    if (!space) {
      throw new NotFoundException('Space not found');
    }

    // check if the user is in the space
    const userSpace = await this.userSpaceRepository.getUserSpaceByIds(
      user_id,
      space_id,
    );
    if (!userSpace) {
      throw new NotFoundException('User not in this space');
    }
    const userSpaceRole = userSpace.spaceRole;

    // check if the owner is in the space
    const ownerUserSpace = await this.userSpaceRepository.getUserSpaceByIds(
      user.user_id,
      space_id,
    );
    if (!ownerUserSpace) {
      throw new NotFoundException('Owner not in this space');
    }
    const ownerSpaceRole = ownerUserSpace.spaceRole;
    if (ownerSpaceRole.role !== Role.OWNER) {
      throw new BadRequestException(
        'Current user is not the owner of this space',
      );
    }

    // assign owner role
    userSpaceRole.role = Role.OWNER;
    ownerSpaceRole.role = Role.USER;

    await this.spaceRoleRepository.save(userSpaceRole);
    await this.spaceRoleRepository.save(ownerSpaceRole);
  }
}

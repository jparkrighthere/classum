import { DataSource, Repository } from 'typeorm';
import { SpaceRole } from './spaceRole.entity';
import { CreateSpaceRoleDto } from './dto/create-spaceRole.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Space } from 'src/space/space.entity';
import { Role } from './enum/spaceRole.enum';
import { UpdateSpaceRoleDto } from './dto/update-spaceRole.dto';

@Injectable()
export class SpaceRoleRepository extends Repository<SpaceRole> {
  constructor(dataSource: DataSource) {
    super(SpaceRole, dataSource.createEntityManager());
  }

  async createSpaceRole(
    createSpaceRoleDto: CreateSpaceRoleDto,
    space: Space,
  ): Promise<SpaceRole> {
    const { name, role } = createSpaceRoleDto;
    const spaceRole = this.create({
      name,
      role,
      space,
    });
    try {
      await this.save(spaceRole);
    } catch (error) {
      console.log(error);
    }
    return spaceRole;
  }

  async deleteSpaceRole(spaceRole: SpaceRole): Promise<void> {
    const spaceRoleToDelete = await this.findOne({
      where: { role_id: spaceRole.role_id },
    });
    if (!spaceRoleToDelete) {
      throw new NotFoundException('SpaceRole not found');
    }
    await this.softDelete(spaceRoleToDelete.role_id);
  }

  async getSpaceRoleById(id: number): Promise<SpaceRole> {
    const spaceRole = await this.findOne({
      where: { role_id: id },
    });

    // if (!spaceRole) {
    //   throw new NotFoundException('SpaceRole not found');
    // }

    return spaceRole;
  }

  async getSpaceRoleByNameRoleSpace(
    name: string,
    role: Role,
    space: Space,
  ): Promise<SpaceRole> {
    return await this.findOne({
      where: {
        name,
        role,
        space,
      },
    });
  }

  async updateSpaceRole(
    updateSpaceRoleDto: UpdateSpaceRoleDto,
    role_id: number,
  ): Promise<SpaceRole> {
    const spaceRoleToUpdate = await this.findOne({
      where: { role_id },
    });
    spaceRoleToUpdate.name = updateSpaceRoleDto.spaceRole.name;
    spaceRoleToUpdate.role = updateSpaceRoleDto.spaceRole.role;

    await this.save(spaceRoleToUpdate);
    return spaceRoleToUpdate;
  }
}

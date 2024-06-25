import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Get,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SpaceRoleService } from './spaceRole.service';
import { CreateSpaceRoleDto } from './dto/create-spaceRole.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/user.decorator';
import { User } from 'src/user/user.entity';
import { SpaceRole } from './spaceRole.entity';
import { Role } from './enum/spaceRole.enum';

@Controller('spacerole')
@UseGuards(AuthGuard('jwt'))
export class SpaceRoleController {
  constructor(private spaceRoleService: SpaceRoleService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async addSpaceRole(
    @Body() createSpaceRoleDto: CreateSpaceRoleDto,
    @GetUser() user: User,
  ): Promise<{ role_id: number }> {
    const spaceRole = await this.spaceRoleService.addSpaceRole(
      createSpaceRoleDto,
      user,
    );
    return { role_id: spaceRole.role_id };
  }

  @Delete()
  @UsePipes(ValidationPipe)
  async deleteSpaceRole(
    @Body() createSpaceRoleDto: CreateSpaceRoleDto,
    @GetUser() user: User,
  ): Promise<void> {
    await this.spaceRoleService.deleteSpaceRole(createSpaceRoleDto, user);
  }

  @Patch('/:user_id')
  @UsePipes(ValidationPipe)
  async updateSpaceRole(
    @Body() createSpaceRoleDto: CreateSpaceRoleDto,
    @Param('user_id') user_id: number,
    @GetUser() user: User,
  ): Promise<Partial<SpaceRole>> {
    const updateSpaceRole = await this.spaceRoleService.updateSpaceRole(
      createSpaceRoleDto,
      user_id,
      user,
    );
    return {
      role_id: updateSpaceRole.role_id,
      name: updateSpaceRole.name,
      role: updateSpaceRole.role,
    };
  }

  @Get('roles/:space_id')
  async getSpaceRoleList(
    @Param('space_id') space_id: number,
  ): Promise<{ name: string; role: Role }[]> {
    const spaceRoles = await this.spaceRoleService.getSpaceRoles(space_id);
    return spaceRoles.map((spaceRole) => ({
      name: String(spaceRole.name),
      role: spaceRole.role,
    }));
  }

  @Get('role/:space_id')
  async getMySpaceRole(
    @Param('space_id') space_id: number,
    @GetUser() user: User,
  ): Promise<{ name: string; role: Role }> {
    const spaceRole = await this.spaceRoleService.getMySpaceRole(
      space_id,
      user,
    );
    return {
      name: String(spaceRole.name),
      role: spaceRole.role,
    };
  }

  @Post('/:space_id/owner/:user_id')
  async assignOwner(
    @Param('space_id') space_id: number,
    @Param('user_id') user_id: number,
    @GetUser() user: User,
  ): Promise<void> {
    await this.spaceRoleService.assignOwnerRole(user_id, space_id, user);
  }
}

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

@Controller('spacerole')
@UseGuards(AuthGuard('jwt'))
export class SpaceRoleController {
  constructor(private spaceRoleService: SpaceRoleService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async addSpaceRole(
    @Body() createSpaceRoleDto: CreateSpaceRoleDto,
    @GetUser() user: User,
  ) {
    return await this.spaceRoleService.addSpaceRole(createSpaceRoleDto, user);
  }

  @Delete()
  @UsePipes(ValidationPipe)
  async deleteSpaceRole(
    @Body() createSpaceRoleDto: CreateSpaceRoleDto,
    @GetUser() user: User,
  ) {
    return await this.spaceRoleService.deleteSpaceRole(
      createSpaceRoleDto,
      user,
    );
  }

  @Patch('/:user_id')
  @UsePipes(ValidationPipe)
  async updateSpaceRole(
    @Body() createSpaceRoleDto: CreateSpaceRoleDto,
    @Param('user_id') user_id: number,
    @GetUser() user: User,
  ) {
    return await this.spaceRoleService.updateSpaceRole(
      createSpaceRoleDto,
      user_id,
      user,
    );
  }

  @Get('roles/:space_id')
  async getSpaceRoleDto(
    @Param('space_id') space_id: number,
  ): Promise<SpaceRole[]> {
    return await this.spaceRoleService.getSpaceRoles(space_id);
  }

  @Get('role/:space_id')
  async getMySpaceRole(
    @Param('space_id') space_id: number,
    @GetUser() user: User,
  ): Promise<SpaceRole> {
    return await this.spaceRoleService.getMySpaceRole(space_id, user);
  }
}

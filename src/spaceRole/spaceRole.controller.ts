import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SpaceRoleService } from './spaceRole.service';
import { CreateSpaceRoleDto } from './dto/create-spaceRole.dto';
import { DeleteSpaceRoleDto } from './dto/delete-spaceRole.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateSpaceRoleDto } from './dto/update-spaceRole.dto';
import { GetUser } from 'src/user.decorator';
import { User } from 'src/user/user.entity';

@Controller('spacerole')
@UseGuards(AuthGuard('jwt'))
export class SpaceRoleController {
  constructor(private spaceRoleService: SpaceRoleService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async addSpaceRole(
    @Body() createSpaceRoleDto: CreateSpaceRoleDto,
    @Body('space_id') space_id: number,//이걸 createSpaceRoleDTO에 넣어야함?
  ) {
    return await this.spaceRoleService.addSpaceRole(
      createSpaceRoleDto,
      space_id,
    );
  }

  @Delete()
  @UsePipes(ValidationPipe)
  async deleteSpaceRole(
    @Body() deleteSpaceRoleDto: DeleteSpaceRoleDto,
    @GetUser() user: User,
  ) {
    return await this.spaceRoleService.deleteSpaceRole(
      deleteSpaceRoleDto,
      user,
    );
  }

  @Patch('/:user_id')
  @UsePipes(ValidationPipe)
  async updateSpaceRole(
    @Body() updateSpaceRoleDto: UpdateSpaceRoleDto,
    @Param('user_id') user_id: number,
    @GetUser() user: User,
  ) {
    return await this.spaceRoleService.updateSpaceRole(
      updateSpaceRoleDto,
      user_id,
      user,
    );
  }
}

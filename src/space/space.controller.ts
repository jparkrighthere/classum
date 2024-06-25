import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { GetUser } from 'src/user.decorator';
import { User } from 'src/user/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { JoinSpaceDto } from './dto/join-space.dto';
import { Role } from 'src/spaceRole/enum/spaceRole.enum';

@Controller('space')
@UseGuards(AuthGuard('jwt'))
export class SpaceController {
  constructor(private spaceService: SpaceService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async addSpace(
    @Body() createSpaceDto: CreateSpaceDto,
    @GetUser() user: User,
  ): Promise<{ space_id: number }> {
    const space = await this.spaceService.addSpace(createSpaceDto, user);
    return { space_id: space.space_id };
  }

  @Get()
  async getMySpaces(@GetUser() user: User): Promise<string[]> {
    const mySpace = await this.spaceService.getMySpaces(user);
    return mySpace.map((space) => space.name);
  }

  @Post('/join')
  @UsePipes(ValidationPipe)
  async joinSpace(
    @Body() joinSpaceDto: JoinSpaceDto,
    @GetUser() user: User,
  ): Promise<{ role_id: number; name: string; role: Role }> {
    const userSpace = await this.spaceService.joinSpace(joinSpaceDto, user);
    return {
      role_id: userSpace.spaceRole.role_id,
      name: userSpace.spaceRole.name,
      role: userSpace.spaceRole.role,
    };
  }

  @Delete('/:space_id')
  async deleteSpace(
    @Param('space_id') space_id: number,
    @GetUser() user: User,
  ): Promise<void> {
    await this.spaceService.deleteSpace(space_id, user);
  }
}

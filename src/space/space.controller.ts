import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { GetUser } from 'src/user.decorator';
import { User } from 'src/user/user.entity';
import { Space } from './space.entity';
import { AuthGuard } from '@nestjs/passport';
import { JoinSpaceDto } from './dto/join-space.dto';
import { UserSpace } from 'src/userSpace/userSpace.entity';

@Controller('space')
@UseGuards(AuthGuard('jwt'))
export class SpaceController {
  constructor(private spaceService: SpaceService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async addSpace(
    @Body() createSpaceDto: CreateSpaceDto,
    @GetUser() user: User,
  ): Promise<Space> {
    return await this.spaceService.addSpace(createSpaceDto, user);
  }

  @Get()
  async getSpaces(@GetUser() user: User): Promise<string[]> {
    const spaceInfo = await this.spaceService.getSpaces(user);
    return spaceInfo.map((space) => space.name);
  }

  @Post('/join')
  @UsePipes(ValidationPipe)
  async joinSpace(
    @Body() joinSpaceDto: JoinSpaceDto,
    @GetUser() user: User,
  ): Promise<UserSpace> {
    return await this.spaceService.joinSpace(joinSpaceDto, user);
  }

  @Delete()
  async deleteSpace(
    @Body('space_id') space_id: number,
    @GetUser() user: User,
  ): Promise<Space> {
    return await this.spaceService.deleteSpace(space_id, user);
  }
}

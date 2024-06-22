import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';
import { SpaceRoleModule } from 'src/spaceRole/spaceRole.module';
import { UserSpaceModule } from 'src/userSpace/userSpace.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceRepository } from './space.repository';
import { SpaceController } from './space.controller';
import { SpaceRoleRepository } from 'src/spaceRole/spaceRole.repository';
import { UserSpaceRepository } from 'src/userSpace/userSpace.repository';

@Module({
  imports: [
    // space entity?
    TypeOrmModule.forFeature([
      SpaceRepository,
      SpaceRoleRepository,
      UserSpaceRepository,
    ]),
    SpaceRoleModule,
    UserSpaceModule,
  ],
  controllers: [SpaceController],
  providers: [SpaceService, SpaceRepository, UserSpaceRepository],
  exports: [SpaceService],
})
export class SpaceModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceService } from './space.service';
import { SpaceRepository } from './space.repository';
import { SpaceController } from './space.controller';
import { SpaceRoleModule } from 'src/spaceRole/spaceRole.module';
import { UserSpaceModule } from 'src/userSpace/userSpace.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpaceRepository]),
    UserSpaceModule,
    SpaceRoleModule,
  ],
  controllers: [SpaceController],
  providers: [SpaceService, SpaceRepository],
  exports: [SpaceService],
})
export class SpaceModule {}

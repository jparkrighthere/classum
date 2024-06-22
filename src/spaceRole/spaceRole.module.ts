import { Module } from '@nestjs/common';
import { SpaceRoleService } from './spaceRole.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceRoleRepository } from './spaceRole.repository';
import { SpaceRepository } from 'src/space/space.repository';
import { UserSpaceModule } from 'src/userSpace/userSpace.module';
import { SpaceRoleController } from './spaceRole.controller';
import { UserSpaceRepository } from 'src/userSpace/userSpace.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // space and spaceRole Entitties?
      SpaceRoleRepository,
      SpaceRepository,
      UserSpaceRepository,
    ]),
    UserSpaceModule,
  ],
  providers: [SpaceRoleService, SpaceRoleRepository],
  controllers: [SpaceRoleController],
  exports: [SpaceRoleService],
})
export class SpaceRoleModule {}

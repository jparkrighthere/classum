import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceRoleService } from './spaceRole.service';
import { SpaceRoleRepository } from './spaceRole.repository';
import { UserSpaceRepository } from 'src/userSpace/userSpace.repository';
import { SpaceRoleController } from './spaceRole.controller';
import { UserSpaceModule } from 'src/userSpace/userSpace.module';
import { UserModule } from 'src/user/user.module';
import { SpaceRepository } from 'src/space/space.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SpaceRoleRepository,
      UserSpaceRepository,
      SpaceRepository,
    ]),
    UserSpaceModule,
    UserModule,
  ],
  controllers: [SpaceRoleController],
  providers: [
    SpaceRoleService,
    SpaceRoleRepository,
    SpaceRepository,
    UserSpaceRepository,
  ],
  exports: [SpaceRoleService],
})
export class SpaceRoleModule {}

import { Module } from '@nestjs/common';
import { UserSpaceService } from './userSpace.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSpaceRepository } from './userSpace.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserSpaceRepository])],
  providers: [UserSpaceService, UserSpaceRepository],
  exports: [UserSpaceService],
})
export class UserSpaceModule {}

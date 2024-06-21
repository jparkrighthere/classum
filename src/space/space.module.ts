import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';

@Module({
  providers: [SpaceService]
})
export class SpaceModule {}

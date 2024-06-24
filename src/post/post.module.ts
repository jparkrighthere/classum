import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { SpaceService } from 'src/space/space.service';
import { SpaceRepository } from 'src/space/space.repository';
import { UserSpaceRepository } from 'src/userSpace/userSpace.repository';
import { SpaceModule } from 'src/space/space.module';
import { UserSpaceModule } from 'src/userSpace/userSpace.module';
import { SpaceRoleModule } from 'src/spaceRole/spaceRole.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostRepository,
      SpaceRepository,
      UserSpaceRepository,
    ]),
    SpaceModule,
    UserSpaceModule,
    PostModule,
    SpaceRoleModule,
  ],
  providers: [
    PostService,
    PostRepository,
    SpaceService,
    SpaceRepository,
    UserSpaceRepository,
  ],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}

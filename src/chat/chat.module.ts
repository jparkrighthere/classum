import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModule } from 'src/post/post.module';
import { UserSpaceModule } from 'src/userSpace/userSpace.module';
import { ChatController } from './chat.controller';
import { ChatRepository } from './chat.repository';
import { UserSpaceRepository } from 'src/userSpace/userSpace.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRepository, UserSpaceRepository]),
    PostModule,
    UserSpaceModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatRepository, UserSpaceRepository],
  exports: [ChatService],
})
export class ChatModule {}

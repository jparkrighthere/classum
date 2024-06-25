import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './logger.middleware';
import { SpaceController } from './space/space.controller';
import { SpaceModule } from './space/space.module';
import { SpaceRoleController } from './spaceRole/spaceRole.controller';
import { SpaceRoleModule } from './spaceRole/spaceRole.module';
import { UserSpaceModule } from './userSpace/userSpace.module';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { Space } from 'src/space/space.entity';
import { SpaceRole } from 'src/spaceRole/spaceRole.entity';
import { User } from 'src/user/user.entity';
import { UserSpace } from 'src/userSpace/userSpace.entity';
import { PostController } from './post/post.controller';
import { PostModule } from './post/post.module';
import { ChatController } from './chat/chat.controller';
import { ChatModule } from './chat/chat.module';
import { Post } from './post/post.entity';
import { Chat } from './chat/chat.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV == 'development'
          ? '.env.development'
          : '.env.production',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Space, SpaceRole, UserSpace, Post, Chat],
      synchronize: process.env.DB_SYNC === 'true',
    }),
    UserModule,
    AuthModule,
    SpaceModule,
    SpaceRoleModule,
    UserSpaceModule,
    PostModule,
    ChatModule,
  ],
  controllers: [
    AppController,
    SpaceController,
    SpaceRoleController,
    UserController,
    AuthController,
    PostController,
    ChatController,
  ],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    if (process.env.NODE_ENV === 'development') {
      consumer.apply(LoggerMiddleware).forRoutes('*');
    }
  }
}

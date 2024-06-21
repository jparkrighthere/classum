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

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME,
      synchronize: process.env.DB_SYNC === 'true',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
    }),
    UserModule,
    AuthModule,
    SpaceModule,
  ],
  controllers: [AppController, SpaceController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    if (process.env.NODE_ENV === 'development') {
      consumer.apply(LoggerMiddleware).forRoutes('*');
    }
  }
}
// console.log('DB_HOST:', process.env.DB_HOST);
// console.log('DB_PORT:', process.env.DB_PORT);
// console.log('DB_USERNAME:', process.env.DB_USERNAME);
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
// console.log('DB_NAME:', process.env.DB_NAME);
// console.log('DB_SYNC:', process.env.DB_SYNC);

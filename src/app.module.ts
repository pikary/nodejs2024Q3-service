import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { TracksModule } from './modules/tracks/tracks.module';
import { ArtistsModule } from './modules/artists/artists.module';
import { AlbumsModule } from './modules/albums/albums.module';
import { FavoritesModule } from './modules/favorites/favorite.module';
import { AppDataSource } from './data-source';
import { RequestLoggingMiddleware } from './modules/loggers/LoggingServices';
import { BaseLogger } from './modules/loggers/BaseLogger';

console.log('DB Config:', {
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Allows accessing environment variables throughout the app
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    UsersModule,
    TracksModule,
    ArtistsModule,
    AlbumsModule,
    FavoritesModule,
  ],
  controllers: [AppController],
  providers: [AppService, BaseLogger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}

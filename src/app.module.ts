import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { TracksModule } from './modules/tracks/tracks.module';
import { ArtistsModule } from './modules/artists/artists.module';
import { AlbumsModule } from './modules/albums/albums.module';
import { FavoritesModule } from './modules/favorites/favorite.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    UsersModule, TracksModule, ArtistsModule, AlbumsModule, FavoritesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

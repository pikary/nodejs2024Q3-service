// src/favorites/favorites.module.ts
import { Module } from '@nestjs/common';
import { FavoritesController } from './favorite.controller';
import { FavoritesService } from './favorite.service';
import { ArtistsModule } from '../artists/artists.module';
import { AlbumsModule } from '../albums/albums.module';
import { TracksModule } from '../tracks/tracks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Album } from '../albums/albums.entities';
import { Track } from '../tracks/tracks.entities';
import { Artist } from '../artists/artists.entities';
import { Favorite } from '../favorites/favorite.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite, Artist, Album, Track]),
    ArtistsModule,
    AlbumsModule,
    TracksModule,
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}

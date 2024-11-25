// src/favorites/favorites.module.ts
import { Module } from '@nestjs/common';
import { FavoritesController } from './favorite.controller';
import { FavoritesService } from './favorite.service';
import { ArtistsModule } from '../artists/artists.module';
import { AlbumsModule } from '../albums/albums.module';
import { TracksModule } from '../tracks/tracks.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [ArtistsModule, AlbumsModule, TracksModule],
  controllers: [FavoritesController],
  providers: [FavoritesService, JwtService],
})
export class FavoritesModule {}

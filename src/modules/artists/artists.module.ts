// src/artists/artists.module.ts
import { Module } from '@nestjs/common';
import { ArtistsController } from './artists.controller';
import { ArtistsService } from './artists.service';
import { TracksModule } from '../tracks/tracks.module';
import { AlbumsModule } from '../albums/albums.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from '../tracks/tracks.entities';
import { Artist } from './artists.entities';
import { Album } from '../albums/albums.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Track, Artist, Album]),
    TracksModule,
    AlbumsModule,
  ],
  controllers: [ArtistsController],
  providers: [ArtistsService],
  exports: [ArtistsService],
})
export class ArtistsModule {}

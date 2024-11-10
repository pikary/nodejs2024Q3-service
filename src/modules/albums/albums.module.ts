// src/albums/albums.module.ts
import { Module } from '@nestjs/common';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { TracksService } from '../tracks/tracks.service';
import { TracksModule } from '../tracks/tracks.module';

@Module({
  imports:[TracksModule],
  controllers: [AlbumsController],
  providers: [AlbumsService],
  exports: [AlbumsService],
})
export class AlbumsModule {}

import { Module } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from './tracks.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Track])],
  exports: [TracksService],
  controllers: [TracksController],
  providers: [TracksService],
})
export class TracksModule {}

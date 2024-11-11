import { Module } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';

@Module({
  imports: [TracksService],
  exports: [TracksService],
  controllers: [TracksController],
  providers: [TracksService],
})
export class TracksModule {}

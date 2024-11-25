import { Module } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TracksService, JwtService],
  exports: [TracksService],
  controllers: [TracksController],
  providers: [TracksService, JwtService],
})
export class TracksModule {}

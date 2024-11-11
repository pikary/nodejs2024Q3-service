import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  ParseUUIDPipe,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { response, Response } from 'express';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Controller('track')
export class TracksController {
  constructor(private readonly trackService: TracksService) {}

  @Get()
  getAllTracks(@Res() res: Response) {
    const tracks = this.trackService.findAll();
    return res.status(HttpStatus.OK).json(tracks);
  }

  @Get(':id')
  getTrackById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Res() res: Response,
  ) {
    try {
      const track = this.trackService.findOne(id);
      return res.status(HttpStatus.OK).json(track);
    } catch (e) {
      return res.status(e.status || 500).json({
        message: e.message || 'something went wrong',
      });
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createTrack(@Body() createTrackDto: CreateTrackDto, @Res() res: Response) {
    try {
      const newTrack = this.trackService.create(createTrackDto);
      return res.status(HttpStatus.CREATED).json(newTrack);
    } catch (error) {
      return res.status(error.status || 500).json({
        message: error.message || 'something went wrong',
      });
    }
  }

  @Put(':id')
  updateTrack(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
    @Res() res: Response,
  ) {
    try {
      const updatedTrack = this.trackService.update(id, updateTrackDto);
      return res.status(HttpStatus.OK).json(updatedTrack);
    } catch (error) {
      return res.status(error.status || 500).json({
        message: error.message || 'something went wrong',
      });
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  deleteTrack(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Res() res: Response,
  ) {
    try {
      this.trackService.remove(id);
      return res.sendStatus(HttpStatus.NO_CONTENT);
    } catch (error) {
      return res.status(error.status || 500).json({
        message: error.message || 'something went wrong',
      });
    }
  }
}

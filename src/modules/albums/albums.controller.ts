// src/albums/albums.controller.ts
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
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/albums-create.dto';
import { UpdateAlbumDto } from './dto/albums-update.dto';
import { Response } from 'express';

@Controller('album')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  // GET /album - Get all albums
  @Get()
  getAllAlbums(@Res() res: Response) {
    const albums = this.albumsService.findAll();
    return res.status(HttpStatus.OK).json(albums);
  }

  // GET /album/:id - Get single album by ID
  @Get(':id')
  getAlbumById(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Res() res: Response,
  ) {
    try {
      const album = this.albumsService.findOne(id);
      return res.status(HttpStatus.OK).json(album);
    } catch (error) {
      return res.status(error.status || HttpStatus.NOT_FOUND).json({
        message: error.message || 'Album not found',
      });
    }
  }

  // POST /album - Create a new album
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createAlbum(@Body() createAlbumDto: CreateAlbumDto, @Res() res: Response) {
    try {
      const newAlbum = this.albumsService.create(createAlbumDto);
      return res.status(HttpStatus.CREATED).json(newAlbum);
    } catch (error) {
      return res.status(error.status || HttpStatus.BAD_REQUEST).json({
        message: error.message || 'Invalid request body',
      });
    }
  }

  // PUT /album/:id - Update album info
  @Put(':id')
  updateAlbum(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
    @Res() res: Response,
  ) {
    try {
      const updatedAlbum = this.albumsService.update(id, updateAlbumDto);
      return res.status(HttpStatus.OK).json(updatedAlbum);
    } catch (error) {
      return res.status(error.status || HttpStatus.NOT_FOUND).json({
        message: error.message || 'Album not found',
      });
    }
  }

  // DELETE /album/:id - Delete album
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteAlbum(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Res() res: Response,
  ) {
    try {
      this.albumsService.remove(id);
      return res.sendStatus(HttpStatus.NO_CONTENT);
    } catch (error) {
      return res.status(error.status || HttpStatus.NOT_FOUND).json({
        message: error.message || 'Album not found',
      });
    }
  }
}

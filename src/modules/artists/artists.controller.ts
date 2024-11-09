// src/artists/artists.controller.ts
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
  import { ArtistsService } from './artists.service';
  import { CreateArtistDto } from './dto/artists-create.dto';
  import { UpdateArtistDto } from './dto/artists-update.dto';
  import { Response } from 'express';
  
  @Controller('artist')
  export class ArtistsController {
    constructor(private readonly artistsService: ArtistsService) {}
  
    // GET /artist - Get all artists
    @Get()
    getAllArtists(@Res() res: Response) {
      const artists = this.artistsService.findAll();
      return res.status(HttpStatus.OK).json(artists);
    }
  
    // GET /artist/:id - Get single artist by ID
    @Get(':id')
    getArtistById(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
      @Res() res: Response,
    ) {
      try {
        const artist = this.artistsService.findOne(id);
        return res.status(HttpStatus.OK).json(artist);
      } catch (error) {
        return res.status(error.status || HttpStatus.NOT_FOUND).json({
          message: error.message || 'Artist not found',
        });
      }
    }
  
    // POST /artist - Create a new artist
    @Post()
    @HttpCode(HttpStatus.CREATED)
    createArtist(@Body() createArtistDto: CreateArtistDto, @Res() res: Response) {
      try {
        const newArtist = this.artistsService.create(createArtistDto);
        return res.status(HttpStatus.CREATED).json(newArtist);
      } catch (error) {
        return res.status(error.status || HttpStatus.BAD_REQUEST).json({
          message: error.message || 'Invalid request body',
        });
      }
    }
  
    // PUT /artist/:id - Update artist info
    @Put(':id')
    updateArtist(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
      @Body() updateArtistDto: UpdateArtistDto,
      @Res() res: Response,
    ) {
      try {
        const updatedArtist = this.artistsService.update(id, updateArtistDto);
        return res.status(HttpStatus.OK).json(updatedArtist);
      } catch (error) {
        return res.status(error.status || HttpStatus.NOT_FOUND).json({
          message: error.message || 'Artist not found',
        });
      }
    }
  
    // DELETE /artist/:id - Delete artist
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteArtist(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
      @Res() res: Response,
    ) {
      try {
        this.artistsService.remove(id);
        return res.sendStatus(HttpStatus.NO_CONTENT);
      } catch (error) {
        return res.status(error.status || HttpStatus.NOT_FOUND).json({
          message: error.message || 'Artist not found',
        });
      }
    }
  }
  
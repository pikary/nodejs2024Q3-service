// src/favorites/favorites.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
  ParseUUIDPipe,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { FavoritesService } from './favorite.service';
import { Response } from 'express';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getAllFavorites(@Res() res: Response) {
    const favorites = this.favoritesService.getAllFavorites();
    return res.status(HttpStatus.OK).json(favorites);
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  addTrackToFavorites(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Res() res: Response,
  ) {
    try {
      this.favoritesService.addTrackToFavorites(id);
      return res
        .status(HttpStatus.CREATED)
        .json({ message: 'Track added to favorites' });
    } catch (error) {
      return res.status(error.status || HttpStatus.UNPROCESSABLE_ENTITY).json({
        message: error.message || 'Track does not exist',
      });
    }
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTrackFromFavorites(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Res() res: Response,
  ) {
    try {
      this.favoritesService.removeTrackFromFavorites(id);
      return res.sendStatus(HttpStatus.NO_CONTENT);
    } catch (error) {
      return res.status(error.status || HttpStatus.NOT_FOUND).json({
        message: error.message || 'Track not in favorites',
      });
    }
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  addAlbumToFavorites(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Res() res: Response,
  ) {
    try {
      const album = this.favoritesService.addAlbumToFavorites(id);
      return res
        .status(HttpStatus.CREATED)
        .json({ message: 'Album added to favorites' });
    } catch (error) {
      return res.status(error.status || HttpStatus.UNPROCESSABLE_ENTITY).json({
        message: error.message || 'Album does not exist',
      });
    }
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAlbumFromFavorites(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Res() res: Response,
  ) {
    try {
      this.favoritesService.removeAlbumFromFavorites(id);
      return res.sendStatus(HttpStatus.NO_CONTENT);
    } catch (error) {
      return res.status(error.status || HttpStatus.NOT_FOUND).json({
        message: error.message || 'Album not in favorites',
      });
    }
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  addArtistToFavorites(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Res() res: Response,
  ) {
    try {
      this.favoritesService.addArtistToFavorites(id);
      return res
        .status(HttpStatus.CREATED)
        .json({ message: 'Artist added to favorites' });
    } catch (error) {
      return res.status(error.status || HttpStatus.UNPROCESSABLE_ENTITY).json({
        message: error.message || 'Artist does not exist',
      });
    }
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeArtistFromFavorites(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Res() res: Response,
  ) {
    try {
      this.favoritesService.removeArtistFromFavorites(id);
      return res.sendStatus(HttpStatus.NO_CONTENT);
    } catch (error) {
      return res.status(error.status || HttpStatus.NOT_FOUND).json({
        message: error.message || 'Artist not in favorites',
      });
    }
  }
}

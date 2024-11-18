import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './favorite.entities';
import { Artist } from '../artists/artists.entities';
import { Album } from '../albums/albums.entities';
import { Track } from '../tracks/tracks.entities';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
  ) {}

  // Get all favorites
  async getAllFavorites(): Promise<{
    artists: Artist[];
    albums: Album[];
    tracks: Track[];
  }> {
    const favorites = await this.favoriteRepository.find({
      relations: ['artist', 'album', 'track'],
    });

    const artists = favorites
      .filter((fav) => fav.artist)
      .map((fav) => fav.artist);
    const albums = favorites.filter((fav) => fav.album).map((fav) => fav.album);
    const tracks = favorites.filter((fav) => fav.track).map((fav) => fav.track);

    return { artists, albums, tracks };
  }

  // Add an artist to favorites
  async addArtistToFavorites(artistId: string): Promise<void> {
    const artist = await this.artistRepository.findOne({
      where: { id: artistId },
    });
    if (!artist) {
      throw new UnprocessableEntityException('Artist not found');
    }

    const existingFavorite = await this.favoriteRepository.findOne({
      where: { artist: { id: artistId } },
      relations: ['artist'],
    });
    if (existingFavorite) {
      throw new ConflictException('Artist already in favorites');
    }

    const favorite = this.favoriteRepository.create({ artist });
    await this.favoriteRepository.save(favorite);
  }

  // Remove an artist from favorites
  async removeArtistFromFavorites(artistId: string): Promise<void> {
    const result = await this.favoriteRepository.delete({
      artist: { id: artistId },
    });
    if (result.affected === 0) {
      throw new NotFoundException('Artist not in favorites');
    }
  }

  // Add an album to favorites
  async addAlbumToFavorites(albumId: string): Promise<void> {
    const album = await this.albumRepository.findOne({
      where: { id: albumId },
    });
    if (!album) {
      throw new UnprocessableEntityException('Album not found');
    }

    const existingFavorite = await this.favoriteRepository.findOne({
      where: { album: { id: albumId } },
      relations: ['album'],
    });
    if (existingFavorite) {
      throw new ConflictException('Album already in favorites');
    }

    const favorite = this.favoriteRepository.create({ album });
    await this.favoriteRepository.save(favorite);
  }

  // Remove an album from favorites
  async removeAlbumFromFavorites(albumId: string): Promise<void> {
    const result = await this.favoriteRepository.delete({
      album: { id: albumId },
    });
    if (result.affected === 0) {
      throw new NotFoundException('Album not in favorites');
    }
  }

  // Add a track to favorites
  async addTrackToFavorites(trackId: string): Promise<void> {
    const track = await this.trackRepository.findOne({
      where: { id: trackId },
    });
    if (!track) {
      throw new UnprocessableEntityException('Track not found');
    }

    const existingFavorite = await this.favoriteRepository.findOne({
      where: { track: { id: trackId } },
      relations: ['track'],
    });
    if (existingFavorite) {
      throw new ConflictException('Track already in favorites');
    }

    const favorite = this.favoriteRepository.create({ track });
    await this.favoriteRepository.save(favorite);
  }

  // Remove a track from favorites
  async removeTrackFromFavorites(trackId: string): Promise<void> {
    const result = await this.favoriteRepository.delete({
      track: { id: trackId },
    });
    if (result.affected === 0) {
      throw new NotFoundException('Track not in favorites');
    }
  }
}

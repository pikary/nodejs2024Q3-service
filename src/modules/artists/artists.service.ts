import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './artists.entity';
import { CreateArtistDto } from './dto/artists-create.dto';
import { UpdateArtistDto } from './dto/artists-update.dto';
import { TracksService } from '../tracks/tracks.service';
import { AlbumsService } from '../albums/albums.service';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private readonly artistRepository: Repository<Artist>,
    private readonly tracksService: TracksService,
    private readonly albumsService: AlbumsService,
  ) {}

  // Create a new artist
  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const newArtist = this.artistRepository.create(createArtistDto);
    return this.artistRepository.save(newArtist);
  }

  // Get all artists
  async findAll(): Promise<Artist[]> {
    return this.artistRepository.find({
      relations: ['albums', 'tracks'], // Load related albums and tracks
    });
  }

  // Get a single artist by ID
  async findOne(id: string): Promise<Artist> {
    const artist = await this.artistRepository.findOne({
      where: { id },
      relations: ['albums', 'tracks'], // Load related albums and tracks
    });
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }
    return artist;
  }

  // Update an artist
  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.findOne(id);
    Object.assign(artist, updateArtistDto);
    return this.artistRepository.save(artist);
  }

  // Delete an artist
  async remove(id: string): Promise<void> {
    const result = await this.artistRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Artist not found');
    }

    // Remove associations with tracks and albums
    await this.tracksService.artistRemoveHandler(id);
    await this.albumsService.artistRemoveHandler(id);
  }
}

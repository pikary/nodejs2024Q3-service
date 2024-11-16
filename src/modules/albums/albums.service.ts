import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from './albums.entities';
import { CreateAlbumDto } from './dto/albums-create.dto';
import { UpdateAlbumDto } from './dto/albums-update.dto';
import { TracksService } from '../tracks/tracks.service';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
    private readonly tracksService: TracksService,
  ) {}

  // Create a new album
  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const newAlbum = this.albumRepository.create(createAlbumDto);
    return this.albumRepository.save(newAlbum);
  }

  // Get all albums
  async findAll(): Promise<Album[]> {
    return this.albumRepository.find({
      relations: ['artist', 'tracks'], // Load related artist and tracks
    });
  }

  // Get a single album by ID
  async findOne(id: string): Promise<Album> {
    const album = await this.albumRepository.findOne({
      where: { id },
      relations: ['artist', 'tracks'], // Load related artist and tracks
    });
    if (!album) {
      throw new NotFoundException('Album not found');
    }
    return album;
  }

  // Update an album
  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album = await this.findOne(id);
    Object.assign(album, updateAlbumDto);
    return this.albumRepository.save(album);
  }

  // Delete an album
  async remove(id: string): Promise<void> {
    const result = await this.albumRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Album not found');
    }

    // Remove association with tracks
    await this.tracksService.albumRemoveHandler(id);
  }

  // Remove associations with artist when an artist is deleted
  async artistRemoveHandler(artistId: string): Promise<void> {
    const albums = await this.albumRepository.find({ where: { artistId } });
    for (const album of albums) {
      album.artistId = null;
      await this.albumRepository.save(album);
    }
  }
}

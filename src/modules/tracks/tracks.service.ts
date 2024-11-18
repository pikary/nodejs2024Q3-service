import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from './tracks.entities';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
  ) {}

  // Create a new track
  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    const newTrack = this.trackRepository.create(createTrackDto);
    return this.trackRepository.save(newTrack);
  }

  // Get all tracks
  async findAll(): Promise<Track[]> {
    return this.trackRepository.find({
      relations: ['artist', 'album'], // Load relations with artist and album
    });
  }

  // Get a single track by ID
  async findOne(id: string): Promise<Track> {
    const track = await this.trackRepository.findOne({
      where: { id },
      relations: ['artist', 'album'], // Load relations with artist and album
    });
    if (!track) {
      throw new NotFoundException('Track not found');
    }
    return track;
  }

  // Update a track
  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    const track = await this.findOne(id);
    Object.assign(track, updateTrackDto);
    return this.trackRepository.save(track);
  }

  // Delete a track
  async remove(id: string): Promise<void> {
    const result = await this.trackRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Track not found');
    }
  }

  // Remove associations when an artist is deleted
  async artistRemoveHandler(artistId: string): Promise<void> {
    const tracks = await this.trackRepository.find({ where: { artistId } });
    for (const track of tracks) {
      track.artistId = null;
      await this.trackRepository.save(track);
    }
  }

  // Remove associations when an album is deleted
  async albumRemoveHandler(albumId: string): Promise<void> {
    const tracks = await this.trackRepository.find({ where: { albumId } });
    for (const track of tracks) {
      track.albumId = null;
      await this.trackRepository.save(track);
    }
  }
}

// src/artists/artists.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Artist } from './artists.entities';
import { CreateArtistDto } from './dto/artists-create.dto';
import { UpdateArtistDto } from './dto/artists-update.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArtistsService {
    private artists: Artist[] = []; // In-memory storage for artists

    create(createArtistDto: CreateArtistDto): Artist {
        const newArtist: Artist = {
            id: uuidv4(),
            ...createArtistDto,
        };

        this.artists.push(newArtist);
        return newArtist;
    }

    findAll(): Artist[] {
        return this.artists;
    }

    findOne(id: string): Artist {
        const artist = this.artists.find(artist => artist.id === id);
        if (!artist) throw new NotFoundException('Artist not found');
        return artist;
    }

    update(id: string, updateArtistDto: UpdateArtistDto): Artist {
        const artist = this.findOne(id);
        Object.assign(artist, updateArtistDto);
        return artist;
    }

    remove(id: string): void {
        const index = this.artists.findIndex(artist => artist.id === id);
        if (index === -1) throw new NotFoundException('Artist not found');
        this.artists.splice(index, 1);
    }
}

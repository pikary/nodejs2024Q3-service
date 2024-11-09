// src/albums/albums.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Album } from './albums.entities';
import { CreateAlbumDto } from './dto/albums-create.dto';
import { UpdateAlbumDto } from './dto/albums-update.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AlbumsService {
    private albums: Album[] = []; // In-memory storage for albums

    create(createAlbumDto: CreateAlbumDto): Album {
        const newAlbum: Album = {
            id: uuidv4(),
            ...createAlbumDto,
        };

        this.albums.push(newAlbum);
        return newAlbum;
    }

    findAll(): Album[] {
        return this.albums;
    }

    findOne(id: string): Album {
        const album = this.albums.find(album => album.id === id);
        if (!album) throw new NotFoundException('Album not found');
        return album;
    }

    update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
        const album = this.findOne(id);
        Object.assign(album, updateAlbumDto);
        return album;
    }

    remove(id: string): void {
        const index = this.albums.findIndex(album => album.id === id);
        if (index === -1) throw new NotFoundException('Album not found');
        this.albums.splice(index, 1);
    }
}

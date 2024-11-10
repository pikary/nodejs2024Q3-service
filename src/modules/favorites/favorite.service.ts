// src/favorites/favorites.service.ts
import { Injectable, NotFoundException, ConflictException, UnprocessableEntityException } from '@nestjs/common';
import { Favorites, FavoritesResponse } from './favorite.entities';
import { ArtistsService } from '../artists/artists.service';
import { AlbumsService } from '../albums/albums.service';
import { TracksService } from '../tracks/tracks.service';

@Injectable()
export class FavoritesService {
    private favorites: Favorites = {
        artists: [],
        albums: [],
        tracks: [],
    };

    constructor(
        private readonly artistsService: ArtistsService,
        private readonly albumsService: AlbumsService,
        private readonly tracksService: TracksService,
    ) { }

    //   getAllFavorites(): FavoritesResponse {
    //     return {
    //       artists: this.favorites.artists.map(id => this.artistsService.findOne(id)),
    //       albums: this.favorites.albums.map(id => this.albumsService.findOne(id)),
    //       tracks: this.favorites.tracks.map(id => this.tracksService.findOne(id)),
    //     };
    //   }

    getAllFavorites(): FavoritesResponse {
        const artists = this.favorites.artists
            .map((id) => {
                try {
                    return this.artistsService.findOne(id);
                } catch {
                    return null;
                }
            })
            .filter((artist) => artist !== null);

        const albums = this.favorites.albums
            .map((id) => {
                try {
                    return this.albumsService.findOne(id);
                } catch {
                    return null;
                }
            })
            .filter((album) => album !== null);

        const tracks = this.favorites.tracks
            .map((id) => {
                try {
                    return this.tracksService.findOne(id);
                } catch {
                    return null;
                }
            })
            .filter((track) => track !== null);

        return {
            artists,
            albums,
            tracks,
        };
    }
    addTrackToFavorites(id: string): void {
        try {
            if (this.favorites.tracks.includes(id)) {
                throw new ConflictException('Track already in favorites');
            }
            const track = this.tracksService.findOne(id);
            this.favorites.tracks.push(track.id);
        }
        catch (e) {
            if (e instanceof NotFoundException) {
                throw new UnprocessableEntityException('Resource not found')
            }
            throw e
        }
    }

    removeTrackFromFavorites(id: string): void {
        const index = this.favorites.tracks.indexOf(id);
        if (index === -1) throw new NotFoundException('Track not in favorites');
        this.favorites.tracks.splice(index, 1);
    }

    addAlbumToFavorites(id: string): void {
        try {
            if (this.favorites.albums.includes(id)) {
                throw new ConflictException('Album already in favorites');
            }
            const album = this.albumsService.findOne(id);
            this.favorites.albums.push(album.id);
        } catch (e) {
            if (e instanceof NotFoundException) {
                throw new UnprocessableEntityException('Resource not found')
            } else throw e
        }

    }

    removeAlbumFromFavorites(id: string): void {
        const index = this.favorites.albums.indexOf(id);
        if (index === -1) throw new NotFoundException('Album not in favorites');
        this.favorites.albums.splice(index, 1);
    }

    addArtistToFavorites(id: string): void {
        try {
            if (this.favorites.artists.includes(id)) {
                throw new ConflictException('Artist already in favorites');
            }
            const artist = this.artistsService.findOne(id);
            this.favorites.artists.push(artist.id);
        } catch (e) {
            if (e instanceof NotFoundException) {
                throw new UnprocessableEntityException('Resource not found')
            } else throw e
        }


    }

    removeArtistFromFavorites(id: string): void {
        const index = this.favorites.artists.indexOf(id);
        if (index === -1) throw new NotFoundException('Artist not in favorites');
        this.favorites.artists.splice(index, 1);
    }
}

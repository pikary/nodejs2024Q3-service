import { Artist } from '../artists/artists.entities';
import { Album } from '../albums/albums.entities';
import { Track } from '../tracks/tracks.entities';

export interface Favorites {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[]; // favorite tracks ids
}

export interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Artist } from '../artists/artists.entities';
import { Album } from '../albums/albums.entities';

@Entity('tracks')
export class Track {
  @PrimaryGeneratedColumn('uuid') // Automatically generate UUID
  id: string;

  @Column({ length: 255 }) // Track name with max length 255
  name: string;

  @Column({ type: 'uuid', nullable: true }) // Foreign key referencing Artist
  artistId: string | null;

  @Column({ type: 'uuid', nullable: true }) // Foreign key referencing Album
  albumId: string | null;

  @Column({ type: 'int' }) // Duration of the track in seconds
  duration: number;

  // Many-to-one relationship with artist
  @ManyToOne(() => Artist, (artist) => artist.tracks, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'artistId' })
  artist: Artist | null;

  // Many-to-one relationship with album
  @ManyToOne(() => Album, (album) => album.tracks, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'albumId' })
  album: Album | null;
}

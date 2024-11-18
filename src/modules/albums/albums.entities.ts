import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Artist } from '../artists/artists.entities';
import { Track } from '../tracks/tracks.entities';

@Entity('albums')
export class Album {
  @PrimaryGeneratedColumn('uuid') // Automatically generate UUID
  id: string;

  @Column({ length: 255 }) // Album name with max length 255
  name: string;

  @Column({ type: 'int' }) // Year of the album
  year: number;

  @Column({ type: 'uuid', nullable: true }) // Foreign key referencing Artist
  artistId: string | null;

  // Many-to-one relationship with artist
  @ManyToOne(() => Artist, (artist) => artist.albums, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'artistId' })
  artist: Artist | null;

  // One-to-many relationship with tracks
  @OneToMany(() => Track, (track) => track.album, { nullable: true })
  tracks: Track[];
}

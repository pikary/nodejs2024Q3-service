import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Artist } from '../artists/artists.entities';
import { Album } from '../albums/albums.entities';
import { Track } from '../tracks/tracks.entities';

@Entity('favorites')
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Artist, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'artistId' })
  artist: Artist | null;

  @ManyToOne(() => Album, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'albumId' })
  album: Album | null;

  @ManyToOne(() => Track, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trackId' })
  track: Track | null;
}

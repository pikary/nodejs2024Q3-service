import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Album } from '../albums/albums.entities';
import { Track } from '../tracks/tracks.entities';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn('uuid') // Automatically generate UUID
  id: string;

  @Column({ length: 255 }) // Artist name with max length 255
  name: string;

  @Column() // Boolean column for Grammy status
  grammy: boolean;

  // One-to-many relationship with albums
  @OneToMany(() => Album, (album) => album.artist, { nullable: true })
  albums: Album[];

  // One-to-many relationship with tracks
  @OneToMany(() => Track, (track) => track.artist, { nullable: true })
  tracks: Track[];
}

// src/albums/dto/create-album.dto.ts
import { IsString, IsInt, IsUUID, IsOptional } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  name: string;

  @IsInt()
  year: number;

  @IsUUID()
  @IsOptional()
  artistId: string | null;
}


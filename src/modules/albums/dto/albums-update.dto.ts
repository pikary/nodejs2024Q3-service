// src/albums/dto/update-album.dto.ts
import { IsString, IsInt, IsUUID, IsOptional } from 'class-validator';

export class UpdateAlbumDto {
  @IsString()
  name: string;

  @IsInt()
  year: number;

  @IsUUID()
  @IsOptional()
  artistId: string | null;
}

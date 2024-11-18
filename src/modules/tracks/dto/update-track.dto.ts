// src/tracks/dto/update-track.dto.ts
import { IsString, IsUUID, IsInt, IsOptional, Min } from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  name: string;

  @IsUUID()
  @IsOptional()
  artistId: string | null;

  @IsUUID()
  @IsOptional()
  albumId: string | null;

  @IsInt()
  @Min(1)
  duration: number;
}

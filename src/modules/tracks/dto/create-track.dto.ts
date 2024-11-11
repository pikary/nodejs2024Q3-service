// src/tracks/dto/create-track.dto.ts
import { IsString, IsUUID, IsInt, IsOptional, Min } from 'class-validator';

export class CreateTrackDto {
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
  duration: number; // duration in seconds
}

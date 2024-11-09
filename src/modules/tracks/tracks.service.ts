import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { Track } from './tracks.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TracksService {
    private tracks: Track[] = []; // In-memory storage for tracks

    create(createTrackDto: CreateTrackDto): Track {
        const newTrack: Track = {
            id: uuidv4(),
            ...createTrackDto,
        };

        this.tracks.push(newTrack);
        return newTrack;
    }

    findAll(): Track[] {
        return this.tracks;
    }

    findOne(id: string): Track {
        const track = this.tracks.find(track => track.id === id);
        if (!track) throw new NotFoundException('Track not found');
        return track;
    }

    update(id: string, updateTrackDto: UpdateTrackDto): Track {
        const track = this.findOne(id);
        Object.assign(track, updateTrackDto);
        return track;
    }

    remove(id: string): void {
        const index = this.tracks.findIndex(track => track.id === id);
        if (index === -1) throw new NotFoundException('Track not found');
        this.tracks.splice(index, 1);
    }
}

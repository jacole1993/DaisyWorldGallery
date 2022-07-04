import { IPhoto } from 'app/entities/photo/photo.model';
import { IVideo } from 'app/entities/video/video.model';

export interface IAlbum {
  id?: number;
  name?: string | null;
  description?: string | null;
  photos?: IPhoto[] | null;
  videos?: IVideo[] | null;
}

export class Album implements IAlbum {
  constructor(
    public id?: number,
    public name?: string | null,
    public description?: string | null,
    public photos?: IPhoto[] | null,
    public videos?: IVideo[] | null
  ) {}
}

export function getAlbumIdentifier(album: IAlbum): number | undefined {
  return album.id;
}

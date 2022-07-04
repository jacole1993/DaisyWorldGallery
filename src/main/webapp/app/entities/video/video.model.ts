import dayjs from 'dayjs/esm';
import { IAlbum } from 'app/entities/album/album.model';

export interface IVideo {
  id?: number;
  videoName?: string;
  videoContentType?: string;
  video?: string;
  dateTaken?: dayjs.Dayjs | null;
  isMomInPicture?: boolean | null;
  isDadInPicture?: boolean | null;
  isFamilyInPicture?: boolean | null;
  albums?: IAlbum[] | null;
}

export class Video implements IVideo {
  constructor(
    public id?: number,
    public videoName?: string,
    public videoContentType?: string,
    public video?: string,
    public dateTaken?: dayjs.Dayjs | null,
    public isMomInPicture?: boolean | null,
    public isDadInPicture?: boolean | null,
    public isFamilyInPicture?: boolean | null,
    public albums?: IAlbum[] | null
  ) {
    this.isMomInPicture = this.isMomInPicture ?? false;
    this.isDadInPicture = this.isDadInPicture ?? false;
    this.isFamilyInPicture = this.isFamilyInPicture ?? false;
  }
}

export function getVideoIdentifier(video: IVideo): number | undefined {
  return video.id;
}

import dayjs from 'dayjs/esm';
import { IAlbum } from 'app/entities/album/album.model';

export interface IPhoto {
  id?: number;
  imageName?: string;
  imageContentType?: string;
  image?: string;
  dateTaken?: dayjs.Dayjs | null;
  isMomInPicture?: boolean | null;
  isDadInPicture?: boolean | null;
  isFamilyInPicture?: boolean | null;
  albums?: IAlbum[] | null;
}

export class Photo implements IPhoto {
  constructor(
    public id?: number,
    public imageName?: string,
    public imageContentType?: string,
    public image?: string,
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

export function getPhotoIdentifier(photo: IPhoto): number | undefined {
  return photo.id;
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPhoto, getPhotoIdentifier } from '../photo.model';

export type EntityResponseType = HttpResponse<IPhoto>;
export type EntityArrayResponseType = HttpResponse<IPhoto[]>;

@Injectable({ providedIn: 'root' })
export class PhotoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/photos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(photo: IPhoto): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(photo);
    return this.http
      .post<IPhoto>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(photo: IPhoto): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(photo);
    return this.http
      .put<IPhoto>(`${this.resourceUrl}/${getPhotoIdentifier(photo) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(photo: IPhoto): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(photo);
    return this.http
      .patch<IPhoto>(`${this.resourceUrl}/${getPhotoIdentifier(photo) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPhoto>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPhoto[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPhotoToCollectionIfMissing(photoCollection: IPhoto[], ...photosToCheck: (IPhoto | null | undefined)[]): IPhoto[] {
    const photos: IPhoto[] = photosToCheck.filter(isPresent);
    if (photos.length > 0) {
      const photoCollectionIdentifiers = photoCollection.map(photoItem => getPhotoIdentifier(photoItem)!);
      const photosToAdd = photos.filter(photoItem => {
        const photoIdentifier = getPhotoIdentifier(photoItem);
        if (photoIdentifier == null || photoCollectionIdentifiers.includes(photoIdentifier)) {
          return false;
        }
        photoCollectionIdentifiers.push(photoIdentifier);
        return true;
      });
      return [...photosToAdd, ...photoCollection];
    }
    return photoCollection;
  }

  protected convertDateFromClient(photo: IPhoto): IPhoto {
    return Object.assign({}, photo, {
      dateTaken: photo.dateTaken?.isValid() ? photo.dateTaken.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateTaken = res.body.dateTaken ? dayjs(res.body.dateTaken) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((photo: IPhoto) => {
        photo.dateTaken = photo.dateTaken ? dayjs(photo.dateTaken) : undefined;
      });
    }
    return res;
  }
}

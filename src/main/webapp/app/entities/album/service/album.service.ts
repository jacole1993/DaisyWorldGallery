import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAlbum, getAlbumIdentifier } from '../album.model';

export type EntityResponseType = HttpResponse<IAlbum>;
export type EntityArrayResponseType = HttpResponse<IAlbum[]>;

@Injectable({ providedIn: 'root' })
export class AlbumService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/albums');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(album: IAlbum): Observable<EntityResponseType> {
    return this.http.post<IAlbum>(this.resourceUrl, album, { observe: 'response' });
  }

  update(album: IAlbum): Observable<EntityResponseType> {
    return this.http.put<IAlbum>(`${this.resourceUrl}/${getAlbumIdentifier(album) as number}`, album, { observe: 'response' });
  }

  partialUpdate(album: IAlbum): Observable<EntityResponseType> {
    return this.http.patch<IAlbum>(`${this.resourceUrl}/${getAlbumIdentifier(album) as number}`, album, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAlbum>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAlbum[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAlbumToCollectionIfMissing(albumCollection: IAlbum[], ...albumsToCheck: (IAlbum | null | undefined)[]): IAlbum[] {
    const albums: IAlbum[] = albumsToCheck.filter(isPresent);
    if (albums.length > 0) {
      const albumCollectionIdentifiers = albumCollection.map(albumItem => getAlbumIdentifier(albumItem)!);
      const albumsToAdd = albums.filter(albumItem => {
        const albumIdentifier = getAlbumIdentifier(albumItem);
        if (albumIdentifier == null || albumCollectionIdentifiers.includes(albumIdentifier)) {
          return false;
        }
        albumCollectionIdentifiers.push(albumIdentifier);
        return true;
      });
      return [...albumsToAdd, ...albumCollection];
    }
    return albumCollection;
  }
}

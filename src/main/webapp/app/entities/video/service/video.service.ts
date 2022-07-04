import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVideo, getVideoIdentifier } from '../video.model';

export type EntityResponseType = HttpResponse<IVideo>;
export type EntityArrayResponseType = HttpResponse<IVideo[]>;

@Injectable({ providedIn: 'root' })
export class VideoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/videos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(video: IVideo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(video);
    return this.http
      .post<IVideo>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(video: IVideo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(video);
    return this.http
      .put<IVideo>(`${this.resourceUrl}/${getVideoIdentifier(video) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(video: IVideo): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(video);
    return this.http
      .patch<IVideo>(`${this.resourceUrl}/${getVideoIdentifier(video) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IVideo>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IVideo[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addVideoToCollectionIfMissing(videoCollection: IVideo[], ...videosToCheck: (IVideo | null | undefined)[]): IVideo[] {
    const videos: IVideo[] = videosToCheck.filter(isPresent);
    if (videos.length > 0) {
      const videoCollectionIdentifiers = videoCollection.map(videoItem => getVideoIdentifier(videoItem)!);
      const videosToAdd = videos.filter(videoItem => {
        const videoIdentifier = getVideoIdentifier(videoItem);
        if (videoIdentifier == null || videoCollectionIdentifiers.includes(videoIdentifier)) {
          return false;
        }
        videoCollectionIdentifiers.push(videoIdentifier);
        return true;
      });
      return [...videosToAdd, ...videoCollection];
    }
    return videoCollection;
  }

  protected convertDateFromClient(video: IVideo): IVideo {
    return Object.assign({}, video, {
      dateTaken: video.dateTaken?.isValid() ? video.dateTaken.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((video: IVideo) => {
        video.dateTaken = video.dateTaken ? dayjs(video.dateTaken) : undefined;
      });
    }
    return res;
  }
}

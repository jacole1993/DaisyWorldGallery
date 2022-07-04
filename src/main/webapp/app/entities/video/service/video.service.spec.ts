import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IVideo, Video } from '../video.model';

import { VideoService } from './video.service';

describe('Video Service', () => {
  let service: VideoService;
  let httpMock: HttpTestingController;
  let elemDefault: IVideo;
  let expectedResult: IVideo | IVideo[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VideoService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      videoName: 'AAAAAAA',
      videoContentType: 'image/png',
      video: 'AAAAAAA',
      dateTaken: currentDate,
      isMomInPicture: false,
      isDadInPicture: false,
      isFamilyInPicture: false,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dateTaken: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Video', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dateTaken: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateTaken: currentDate,
        },
        returnedFromService
      );

      service.create(new Video()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Video', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          videoName: 'BBBBBB',
          video: 'BBBBBB',
          dateTaken: currentDate.format(DATE_FORMAT),
          isMomInPicture: true,
          isDadInPicture: true,
          isFamilyInPicture: true,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateTaken: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Video', () => {
      const patchObject = Object.assign(
        {
          video: 'BBBBBB',
          isFamilyInPicture: true,
        },
        new Video()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dateTaken: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Video', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          videoName: 'BBBBBB',
          video: 'BBBBBB',
          dateTaken: currentDate.format(DATE_FORMAT),
          isMomInPicture: true,
          isDadInPicture: true,
          isFamilyInPicture: true,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dateTaken: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Video', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addVideoToCollectionIfMissing', () => {
      it('should add a Video to an empty array', () => {
        const video: IVideo = { id: 123 };
        expectedResult = service.addVideoToCollectionIfMissing([], video);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(video);
      });

      it('should not add a Video to an array that contains it', () => {
        const video: IVideo = { id: 123 };
        const videoCollection: IVideo[] = [
          {
            ...video,
          },
          { id: 456 },
        ];
        expectedResult = service.addVideoToCollectionIfMissing(videoCollection, video);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Video to an array that doesn't contain it", () => {
        const video: IVideo = { id: 123 };
        const videoCollection: IVideo[] = [{ id: 456 }];
        expectedResult = service.addVideoToCollectionIfMissing(videoCollection, video);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(video);
      });

      it('should add only unique Video to an array', () => {
        const videoArray: IVideo[] = [{ id: 123 }, { id: 456 }, { id: 90633 }];
        const videoCollection: IVideo[] = [{ id: 123 }];
        expectedResult = service.addVideoToCollectionIfMissing(videoCollection, ...videoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const video: IVideo = { id: 123 };
        const video2: IVideo = { id: 456 };
        expectedResult = service.addVideoToCollectionIfMissing([], video, video2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(video);
        expect(expectedResult).toContain(video2);
      });

      it('should accept null and undefined values', () => {
        const video: IVideo = { id: 123 };
        expectedResult = service.addVideoToCollectionIfMissing([], null, video, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(video);
      });

      it('should return initial array if no Video is added', () => {
        const videoCollection: IVideo[] = [{ id: 123 }];
        expectedResult = service.addVideoToCollectionIfMissing(videoCollection, undefined, null);
        expect(expectedResult).toEqual(videoCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

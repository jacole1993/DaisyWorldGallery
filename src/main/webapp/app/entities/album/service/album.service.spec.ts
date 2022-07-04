import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAlbum, Album } from '../album.model';

import { AlbumService } from './album.service';

describe('Album Service', () => {
  let service: AlbumService;
  let httpMock: HttpTestingController;
  let elemDefault: IAlbum;
  let expectedResult: IAlbum | IAlbum[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AlbumService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      description: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Album', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Album()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Album', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Album', () => {
      const patchObject = Object.assign(
        {
          description: 'BBBBBB',
        },
        new Album()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Album', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Album', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAlbumToCollectionIfMissing', () => {
      it('should add a Album to an empty array', () => {
        const album: IAlbum = { id: 123 };
        expectedResult = service.addAlbumToCollectionIfMissing([], album);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(album);
      });

      it('should not add a Album to an array that contains it', () => {
        const album: IAlbum = { id: 123 };
        const albumCollection: IAlbum[] = [
          {
            ...album,
          },
          { id: 456 },
        ];
        expectedResult = service.addAlbumToCollectionIfMissing(albumCollection, album);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Album to an array that doesn't contain it", () => {
        const album: IAlbum = { id: 123 };
        const albumCollection: IAlbum[] = [{ id: 456 }];
        expectedResult = service.addAlbumToCollectionIfMissing(albumCollection, album);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(album);
      });

      it('should add only unique Album to an array', () => {
        const albumArray: IAlbum[] = [{ id: 123 }, { id: 456 }, { id: 79605 }];
        const albumCollection: IAlbum[] = [{ id: 123 }];
        expectedResult = service.addAlbumToCollectionIfMissing(albumCollection, ...albumArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const album: IAlbum = { id: 123 };
        const album2: IAlbum = { id: 456 };
        expectedResult = service.addAlbumToCollectionIfMissing([], album, album2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(album);
        expect(expectedResult).toContain(album2);
      });

      it('should accept null and undefined values', () => {
        const album: IAlbum = { id: 123 };
        expectedResult = service.addAlbumToCollectionIfMissing([], null, album, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(album);
      });

      it('should return initial array if no Album is added', () => {
        const albumCollection: IAlbum[] = [{ id: 123 }];
        expectedResult = service.addAlbumToCollectionIfMissing(albumCollection, undefined, null);
        expect(expectedResult).toEqual(albumCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

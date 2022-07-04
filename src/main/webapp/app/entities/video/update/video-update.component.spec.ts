import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VideoService } from '../service/video.service';
import { IVideo, Video } from '../video.model';
import { IAlbum } from 'app/entities/album/album.model';
import { AlbumService } from 'app/entities/album/service/album.service';

import { VideoUpdateComponent } from './video-update.component';

describe('Video Management Update Component', () => {
  let comp: VideoUpdateComponent;
  let fixture: ComponentFixture<VideoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let videoService: VideoService;
  let albumService: AlbumService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VideoUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(VideoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VideoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    videoService = TestBed.inject(VideoService);
    albumService = TestBed.inject(AlbumService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Album query and add missing value', () => {
      const video: IVideo = { id: 456 };
      const albums: IAlbum[] = [{ id: 67999 }];
      video.albums = albums;

      const albumCollection: IAlbum[] = [{ id: 57325 }];
      jest.spyOn(albumService, 'query').mockReturnValue(of(new HttpResponse({ body: albumCollection })));
      const additionalAlbums = [...albums];
      const expectedCollection: IAlbum[] = [...additionalAlbums, ...albumCollection];
      jest.spyOn(albumService, 'addAlbumToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ video });
      comp.ngOnInit();

      expect(albumService.query).toHaveBeenCalled();
      expect(albumService.addAlbumToCollectionIfMissing).toHaveBeenCalledWith(albumCollection, ...additionalAlbums);
      expect(comp.albumsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const video: IVideo = { id: 456 };
      const albums: IAlbum = { id: 11148 };
      video.albums = [albums];

      activatedRoute.data = of({ video });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(video));
      expect(comp.albumsSharedCollection).toContain(albums);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Video>>();
      const video = { id: 123 };
      jest.spyOn(videoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ video });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: video }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(videoService.update).toHaveBeenCalledWith(video);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Video>>();
      const video = new Video();
      jest.spyOn(videoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ video });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: video }));
      saveSubject.complete();

      // THEN
      expect(videoService.create).toHaveBeenCalledWith(video);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Video>>();
      const video = { id: 123 };
      jest.spyOn(videoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ video });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(videoService.update).toHaveBeenCalledWith(video);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackAlbumById', () => {
      it('Should return tracked Album primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackAlbumById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });

  describe('Getting selected relationships', () => {
    describe('getSelectedAlbum', () => {
      it('Should return option if no Album is selected', () => {
        const option = { id: 123 };
        const result = comp.getSelectedAlbum(option);
        expect(result === option).toEqual(true);
      });

      it('Should return selected Album for according option', () => {
        const option = { id: 123 };
        const selected = { id: 123 };
        const selected2 = { id: 456 };
        const result = comp.getSelectedAlbum(option, [selected2, selected]);
        expect(result === selected).toEqual(true);
        expect(result === selected2).toEqual(false);
        expect(result === option).toEqual(false);
      });

      it('Should return option if this Album is not selected', () => {
        const option = { id: 123 };
        const selected = { id: 456 };
        const result = comp.getSelectedAlbum(option, [selected]);
        expect(result === option).toEqual(true);
        expect(result === selected).toEqual(false);
      });
    });
  });
});

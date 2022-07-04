import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AlbumService } from '../service/album.service';

import { AlbumComponent } from './album.component';

describe('Album Management Component', () => {
  let comp: AlbumComponent;
  let fixture: ComponentFixture<AlbumComponent>;
  let service: AlbumService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AlbumComponent],
    })
      .overrideTemplate(AlbumComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AlbumComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AlbumService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.albums?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});

import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IVideo, Video } from '../video.model';
import { VideoService } from '../service/video.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IAlbum } from 'app/entities/album/album.model';
import { AlbumService } from 'app/entities/album/service/album.service';

@Component({
  selector: 'jhi-video-update',
  templateUrl: './video-update.component.html',
})
export class VideoUpdateComponent implements OnInit {
  isSaving = false;

  albumsSharedCollection: IAlbum[] = [];

  editForm = this.fb.group({
    id: [],
    videoName: [null, [Validators.required]],
    video: [null, [Validators.required]],
    videoContentType: [],
    dateTaken: [],
    isMomInPicture: [],
    isDadInPicture: [],
    isFamilyInPicture: [],
    albums: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected videoService: VideoService,
    protected albumService: AlbumService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ video }) => {
      this.updateForm(video);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('daisyWorldApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const video = this.createFromForm();
    if (video.id !== undefined) {
      this.subscribeToSaveResponse(this.videoService.update(video));
    } else {
      this.subscribeToSaveResponse(this.videoService.create(video));
    }
  }

  trackAlbumById(_index: number, item: IAlbum): number {
    return item.id!;
  }

  getSelectedAlbum(option: IAlbum, selectedVals?: IAlbum[]): IAlbum {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVideo>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(video: IVideo): void {
    this.editForm.patchValue({
      id: video.id,
      videoName: video.videoName,
      video: video.video,
      videoContentType: video.videoContentType,
      dateTaken: video.dateTaken,
      isMomInPicture: video.isMomInPicture,
      isDadInPicture: video.isDadInPicture,
      isFamilyInPicture: video.isFamilyInPicture,
      albums: video.albums,
    });

    this.albumsSharedCollection = this.albumService.addAlbumToCollectionIfMissing(this.albumsSharedCollection, ...(video.albums ?? []));
  }

  protected loadRelationshipsOptions(): void {
    this.albumService
      .query()
      .pipe(map((res: HttpResponse<IAlbum[]>) => res.body ?? []))
      .pipe(
        map((albums: IAlbum[]) => this.albumService.addAlbumToCollectionIfMissing(albums, ...(this.editForm.get('albums')!.value ?? [])))
      )
      .subscribe((albums: IAlbum[]) => (this.albumsSharedCollection = albums));
  }

  protected createFromForm(): IVideo {
    return {
      ...new Video(),
      id: this.editForm.get(['id'])!.value,
      videoName: this.editForm.get(['videoName'])!.value,
      videoContentType: this.editForm.get(['videoContentType'])!.value,
      video: this.editForm.get(['video'])!.value,
      dateTaken: this.editForm.get(['dateTaken'])!.value,
      isMomInPicture: this.editForm.get(['isMomInPicture'])!.value,
      isDadInPicture: this.editForm.get(['isDadInPicture'])!.value,
      isFamilyInPicture: this.editForm.get(['isFamilyInPicture'])!.value,
      albums: this.editForm.get(['albums'])!.value,
    };
  }
}

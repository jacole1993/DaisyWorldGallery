import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPhoto, Photo } from '../photo.model';
import { PhotoService } from '../service/photo.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IAlbum } from 'app/entities/album/album.model';
import { AlbumService } from 'app/entities/album/service/album.service';

@Component({
  selector: 'jhi-photo-update',
  templateUrl: './photo-update.component.html',
})
export class PhotoUpdateComponent implements OnInit {
  isSaving = false;

  albumsSharedCollection: IAlbum[] = [];

  editForm = this.fb.group({
    id: [],
    imageName: [null, [Validators.required]],
    image: [null, [Validators.required]],
    imageContentType: [],
    dateTaken: [],
    isMomInPicture: [],
    isDadInPicture: [],
    isFamilyInPicture: [],
    albums: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected photoService: PhotoService,
    protected albumService: AlbumService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ photo }) => {
      this.updateForm(photo);

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

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const photo = this.createFromForm();
    if (photo.id !== undefined) {
      this.subscribeToSaveResponse(this.photoService.update(photo));
    } else {
      this.subscribeToSaveResponse(this.photoService.create(photo));
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPhoto>>): void {
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

  protected updateForm(photo: IPhoto): void {
    this.editForm.patchValue({
      id: photo.id,
      imageName: photo.imageName,
      image: photo.image,
      imageContentType: photo.imageContentType,
      dateTaken: photo.dateTaken,
      isMomInPicture: photo.isMomInPicture,
      isDadInPicture: photo.isDadInPicture,
      isFamilyInPicture: photo.isFamilyInPicture,
      albums: photo.albums,
    });

    this.albumsSharedCollection = this.albumService.addAlbumToCollectionIfMissing(this.albumsSharedCollection, ...(photo.albums ?? []));
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

  protected createFromForm(): IPhoto {
    return {
      ...new Photo(),
      id: this.editForm.get(['id'])!.value,
      imageName: this.editForm.get(['imageName'])!.value,
      imageContentType: this.editForm.get(['imageContentType'])!.value,
      image: this.editForm.get(['image'])!.value,
      dateTaken: this.editForm.get(['dateTaken'])!.value,
      isMomInPicture: this.editForm.get(['isMomInPicture'])!.value,
      isDadInPicture: this.editForm.get(['isDadInPicture'])!.value,
      isFamilyInPicture: this.editForm.get(['isFamilyInPicture'])!.value,
      albums: this.editForm.get(['albums'])!.value,
    };
  }
}

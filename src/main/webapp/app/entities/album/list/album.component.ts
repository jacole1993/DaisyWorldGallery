import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAlbum } from '../album.model';
import { AlbumService } from '../service/album.service';
import { AlbumDeleteDialogComponent } from '../delete/album-delete-dialog.component';

@Component({
  selector: 'jhi-album',
  templateUrl: './album.component.html',
})
export class AlbumComponent implements OnInit {
  albums?: IAlbum[];
  isLoading = false;

  constructor(protected albumService: AlbumService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.albumService.query().subscribe({
      next: (res: HttpResponse<IAlbum[]>) => {
        this.isLoading = false;
        this.albums = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAlbum): number {
    return item.id!;
  }

  delete(album: IAlbum): void {
    const modalRef = this.modalService.open(AlbumDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.album = album;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAlbum } from '../album.model';
import { AlbumService } from '../service/album.service';

@Component({
  templateUrl: './album-delete-dialog.component.html',
})
export class AlbumDeleteDialogComponent {
  album?: IAlbum;

  constructor(protected albumService: AlbumService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.albumService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}

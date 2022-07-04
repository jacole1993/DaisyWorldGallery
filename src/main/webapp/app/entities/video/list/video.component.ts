import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IVideo } from '../video.model';
import { VideoService } from '../service/video.service';
import { VideoDeleteDialogComponent } from '../delete/video-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-video',
  templateUrl: './video.component.html',
})
export class VideoComponent implements OnInit {
  videos?: IVideo[];
  isLoading = false;

  constructor(protected videoService: VideoService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.videoService.query().subscribe({
      next: (res: HttpResponse<IVideo[]>) => {
        this.isLoading = false;
        this.videos = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IVideo): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(video: IVideo): void {
    const modalRef = this.modalService.open(VideoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.video = video;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

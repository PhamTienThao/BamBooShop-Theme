import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { Gallery } from 'src/app/core/model/gallery';
import { Menu } from 'src/app/core/model/menu';
import { GalleryService } from 'src/app/core/service/gallery.service';
import { GalleryDetailComponent } from './gallery-detail/gallery-detail.component';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent implements OnInit {
  @ViewChild('frmDetail', { static: true }) frmDetail!: GalleryDetailComponent;

  datas: Gallery[] = [];
  dataColumns: any[] = [];
  filterDatas: Gallery[] = [];
  constructor(
    private galleryService: GalleryService,
    private spinner: NgxSpinnerService,
    private messageService: NzMessageService
  ) {}

  ngOnInit() {
    this.getData();
    this.tableInit();
  }

  getData() {
    this.spinner.show();
    this.galleryService
      .get({})
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe({
        next: (resp: any) => {
          this.datas = JSON.parse(resp['data']);
        },
        error: (err) => {
          this.messageService.error(err);
        },
      });
  }

  delete(menu: Menu | any) {
    this.spinner.show();
    this.galleryService
      .deleteById(menu.Id)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe({
        next: (resp: any) => {
          this.messageService.success('Xóa thành công');
          this.getData();
        },
        error: (err) => {
          this.messageService.error(err);
        },
      });
  }

  addNew() {
    this.frmDetail.visible = true;
    this.frmDetail.setForm({
      Id: 0,
      Type: 1,
      Image: 'no_img.jpg',
    });
  }
  tableInit() {
    this.dataColumns = [
      {
        name: 'Hình ảnh',
        prop: 'Image',
        type: 'image',
      },
      {
        name: 'Loại',
        prop: 'Type',
        type: 'text',
        listOfFilter: [
          { text: 'Chính', value: 1 },
          { text: 'Phụ', value: 2 },
        ],
        filterFn: (list: string[], item: any) =>
          list.some((name) => item.Type == name),
      },
    ];
  }
  onSubmit(gallery: Gallery | any) {
    this.spinner.show();
    this.galleryService
      .post(gallery)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe({
        next: (resp: any) => {
          this.messageService.success('Thêm mới thành công');
          this.frmDetail.visible = false;
          this.getData();
        },
        error: (err) => {
          this.messageService.error(err);
        },
      });
  }
}

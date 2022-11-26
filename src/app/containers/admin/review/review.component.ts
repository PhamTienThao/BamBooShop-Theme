import { ProductService } from './../../../core/service/product.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { Review } from 'src/app/core/model/review';
import { ReviewService } from 'src/app/core/service/review.service';
import { ReviewDetailComponent } from './review-detail/review-detail.component';
import { TableTemplateComponent } from 'src/app/components/table-template/table-template.component';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css'],
})
export class ReviewComponent implements OnInit {
  @ViewChild('frmDetail', { static: true }) frmDetail!: ReviewDetailComponent;
  @ViewChild('reviewTable', { static: true })
  reviewTable!: TableTemplateComponent;

  datas: Review[] = [];
  filterDatas: Review[] = [];
  displayData: Review[] = [];
  dataColumns: any[] = [];

  filter = {
    keySearch: '',
    status: null,
  };

  constructor(
    private reviewService: ReviewService,
    private spinner: NgxSpinnerService,
    private messageService: NzMessageService
  ) {}

  ngOnInit() {
    this.getData();
    this.tableInit();
  }
  reload() {
    this.filter = {
      keySearch: '',
      status: null,
    };
    this.getData();
  }
  getData() {
    this.spinner.show();
    this.reviewService
      .get({
        keySearch: this.filter.keySearch,
        status: this.filter.status ?? -1,
      })
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe({
        next: (resp: any) => {
          this.datas = JSON.parse(resp['data']);
          this.displayData = this.datas;
        },
        error: (err) => {
          this.messageService.error(err);
        },
      });
  }
  tableInit() {
    this.dataColumns = [
      {
        name: 'Hình ảnh',
        prop: 'Product',
        _subprop: 'Image',
        type: 'image',
      },
      {
        name: 'Cloud Image',
        prop: 'Product',
        _subprop: 'ImageCloudLink',
        type: 'image',
        //sortOrder: null,
      },
      {
        name: 'Tên sản phẩm',
        prop: 'Product',
        _subprop: 'Name',
        type: 'text',
      },
      {
        name: 'Rate',
        prop: 'Star',
        type: 'text',
        sortFn: (a: any, b: any) => a.Star - b.Star,
      },
      {
        name: 'Ngày đánh giá',
        prop: 'Created',
        type: 'number',
      },
      {
        name: 'Người đánh giá',
        prop: 'CreatedBy',
        type: 'text',
      },
      {
        name: 'Nội dung',
        prop: 'Content',
        type: 'number',
      },
      {
        name: 'Trạng thái',
        prop: 'Status',
        type: 'text',
        listOfFilter: [
          { text: 'Chờ duyệt', value: 10 },
          { text: 'Đã duyệt', value: 20 },
          { text: 'Cập nhật lại - Chờ duyệt', value: 30 },
        ],
        filterFn: (list: string[], item: any) =>
          list.some((name) => item.Status == name),
      },
    ];
  }
  showDetail(review: Review) {
    this.frmDetail.visible = true;
    this.frmDetail.setForm(review);
  }

  onSubmit(review: Review) {
    this.spinner.show();
    this.reviewService
      .updateStatus(review.Id ?? 0, review.Status)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe({
        next: (resp: any) => {
          this.messageService.success('Cập nhật thành công');
          this.getData();
          this.frmDetail.visible = false;
        },
        error: (err) => {
          this.messageService.error(err);
        },
      });
  }
  filterChange() {
    var keySearch = this.filter.keySearch.toLowerCase();
    if (this.filter.status == null) {
      this.displayData = this.datas.filter(
        (x) =>
          x.Product?.Name.toLowerCase().includes(keySearch) ||
          x.Product?.Alias.toLowerCase().includes(keySearch) ||
          x.CreatedBy?.toLowerCase().includes(keySearch)
      );
    } else {
      this.displayData = this.datas.filter(
        (d) => d.Status == this.filter.status
      );
      this.displayData = this.displayData.filter(
        (d) =>
          d.Product?.Name.toLowerCase().includes(keySearch) ||
          d.Product?.Alias.toLowerCase().includes(keySearch) ||
          d.CreatedBy?.toLowerCase().includes(keySearch)
      );
    }
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { TableTemplateComponent } from 'src/app/components/table-template/table-template.component';
import { Article } from 'src/app/core/model/article';
import { ArticleService } from 'src/app/core/service/article.service';
import { ArticleDetailComponent } from './article-detail/article-detail.component';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
})
export class ArticleComponent implements OnInit {
  @ViewChild('frmDetail', { static: true }) frmDetail!: ArticleDetailComponent;
  @ViewChild('articalTable', { static: true })
  articalTable!: TableTemplateComponent;

  datas: Article[] = [];
  dataColumns: any[] = [];
  filterDatas: Article[] = [];

  filter = {
    keySearch: '',
  };

  constructor(
    private articleService: ArticleService,
    private spinner: NgxSpinnerService,
    private messageService: NzMessageService
  ) {}

  ngOnInit() {
    this.getData();
    this.tableInit();
  }

  getData() {
    this.spinner.show();
    this.articleService
      .get(this.filter)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe({
        next: (resp: any) => {
          this.datas = JSON.parse(resp['data']);
          console.log(this.datas);
        },
        error: (err) => {
          this.messageService.error(err);
        },
      });
  }

  delete(article: Article) {
    this.spinner.show();
    this.articleService
      .deleteById(article.Id)
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
    this.frmDetail.isAddNew = true;
    this.frmDetail.visible = true;
    this.frmDetail.setForm({
      Id: 0,
      Index: 1,
      Active: true,
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
        name: 'Cloud Image',
        prop: 'ImageCloudLink',
        type: 'image',
        //sortOrder: null,
      },
      {
        name: 'Tiêu đề',
        prop: 'Title',
        type: 'text',
      },
      {
        name: 'Danh mục',
        prop: 'Menu',
        _subprop: 'Name',
        type: 'text',
        listOfFilter: [
          { text: 'Về chúng tôi', value: 'Về chúng tôi' },
          { text: 'Chính sách bảo hành', value: 'Chính sách bảo hành' },
          { text: 'Chính sách bảo mật', value: 'Chính sách bảo mật' },
          { text: 'Hướng dẫn thanh toán', value: 'Hướng dẫn thanh toán' },
          { text: 'Hướng dẫn mua hàng', value: 'Hướng dẫn mua hàng' },
          { text: 'Tin tức & Sự kiện', value: 'Tin tức & Sự kiện' },
        ],
        filterFn: (list: string[], item: any) =>
          list.some((name) => item.Menu?.Name == name),
      },
      {
        name: 'Thứ tự hiển thị',
        prop: 'Index',
        type: 'text',
      },
      {
        name: 'Active',
        prop: 'Active',
        type: 'active',
      },
      {
        name: 'Ngày tạo',
        prop: 'Created',
        type: 'text',
      },
    ];
  }
  showDetail(article: Article) {
    this.spinner.show();
    this.articleService
      .getById(article.Id)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe({
        next: (resp: any) => {
          this.frmDetail.isAddNew = false;
          this.frmDetail.visible = true;
          this.frmDetail.setForm(JSON.parse(resp['data']));
        },
        error: (err) => {
          this.messageService.error(err);
        },
      });
  }
  refreshTable(value: boolean) {
    if (value) {
      this.articalTable.setOfCheckedId = new Set<number>();
    }
  }
  deleteListArtical(articleId: Article[]) {
    var listOfArticle: number[] = [];
    articleId.forEach((item) => {
      listOfArticle.push(item.Id);
    });
    if (listOfArticle.length <= 1) {
      this.articleService.deleteByListId(listOfArticle).subscribe({
        next: (resp: any) => {
          this.messageService.success('Xóa thành công');
          this.getData();
          this.refreshTable(true);
        },
        error: (error) => {
          this.messageService.error(error);
        },
      });
    } else {
      this.messageService.success('Đã xảy ra lỗi');
    }
  }
  onSubmit(article: Article) {
    if (this.frmDetail.isAddNew) {
      this.spinner.show();
      this.articleService
        .post(article)
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
    } else {
      this.spinner.show();
      this.articleService
        .put(article.Id, article)
        .pipe(
          finalize(() => {
            this.spinner.hide();
          })
        )
        .subscribe({
          next: (resp: any) => {
            this.messageService.success('Cập nhật thành công');
            this.frmDetail.visible = false;
            this.getData();
          },
          error: (err) => {
            this.messageService.error(err);
          },
        });
    }
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { Menu } from 'src/app/core/model/menu';
import { Product } from 'src/app/core/model/product';
import { MenuService } from 'src/app/core/service/menu.service';
import { ProductService } from 'src/app/core/service/product.service';
import { ProductDetailComponent } from './product-detail/product-detail.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  @ViewChild('frmDetail', { static: true }) frmDetail!: ProductDetailComponent;

  datas: Product[] = [];
  menus: Menu[] = [];
  // searchInput: any;
  // displayData: any = [];

  filter = {
    keySearch: '',
    menuId: null,
  };

  constructor(
    private menuService: MenuService,
    private productService: ProductService,
    private spinner: NgxSpinnerService,
    private messageService: NzMessageService // private tableSvc: TableService
  ) {
    // this.displayData = this.datas;
  }

  ngOnInit() {
    this.getData();
    this.getMenu();
  }

  getMenu() {
    this.menuService.getByType(['san-pham']).subscribe((resp: any) => {
      this.menus = JSON.parse(resp['data']);
    });
  }

  getData() {
    this.spinner.show();
    this.productService
      .get({
        keySearch: this.filter.keySearch,
        menuId: this.filter.menuId ?? '',
      })
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

  // search(): void {
  //   const data = this.datas;
  //   this.displayData = this.tableSvc.search(this.searchInput, data);
  // }

  delete(product: Product) {
    this.spinner.show();
    this.productService
      .deleteById(product.Id)
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
      Status: 10,
      Selling: true,
      Price: 0,
      DiscountPrice: 0,
    });
  }

  showDetail(product: Product) {
    this.spinner.show();
    this.productService
      .getById(product.Id)
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

  onSubmit(product: Product) {
    if (this.frmDetail.isAddNew) {
      this.spinner.show();
      this.productService
        .post(product)
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
      this.productService
        .put(product.Id, product)
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

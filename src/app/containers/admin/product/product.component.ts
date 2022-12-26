import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject } from 'rxjs';
import { distinctUntilChanged, finalize, map, takeUntil } from 'rxjs/operators';
import { TableTemplateComponent } from 'src/app/components/table-template/table-template.component';
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
export class ProductComponent implements OnInit, OnDestroy {
  @ViewChild('frmDetail', { static: true }) frmDetail!: ProductDetailComponent;
  @ViewChild('productTable', { static: true }) productTable!: TableTemplateComponent;

  datas: Product[] = [];
  filterDatas: Product[] = [];
  dataColumns: any[] = [];
  private onDestroy$: Subject<boolean> = new Subject<boolean>();

  menus: Menu[] = [];
  // searchInput: any;
  // highLightProductStatus = [{ value: true, display: 'Nổi bật' },
  // { value: false, display: 'Không nổi bật' }];

  filter = {
    keySearch: '',
    menuId: null,
    highLight: null
  };
  addEditComponent = ProductDetailComponent;
  constructor(
    private menuService: MenuService,
    private productService: ProductService,
    private spinner: NgxSpinnerService,
    private messageService: NzMessageService, // private tableSvc: TableService
    private readonly route: ActivatedRoute
  ) {

  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }
  ngOnInit() {
    // this.route.params.pipe(
    //   takeUntil(this.onDestroy$),
    //   distinctUntilChanged()
    // ).subscribe(params => {
    //   this.menus = this.route.snapshot.data['menus'];
    // })
    // console.log(this.menus)
    this.getData();
    this.getMenu();
    this.tableInit();
  }

  getMenu() {
    this.menuService.getByType(['san-pham']).subscribe({
      next: (resp: any) => {
        this.menus = JSON.parse(resp['data']);
      },
      error: (err: any) => {
        this.messageService.error(err.error.message);
      }
    });
  }
  tableInit() {
    this.dataColumns = [
      {
        name: 'Hình ảnh',
        prop: 'Image',
        type: 'image',
        //sortOrder: null,
      },
      {
        name: 'Cloud Image',
        prop: 'ImageCloudLink',
        type: 'image',
        //sortOrder: null,
      },
      {
        name: 'Tên hàng',
        prop: 'Name',
        type: 'text',
        //sortOrder: null,
        sortFn: (a: any, b: any) => a.name.localeCompare(b.name),
        // listOfFilter: [
        //   { text: 'laptop', value: 'a' },
        //   { text: 'Jim', value: 'HMTien' }
        // ],
        filterFn: (list: string[], item: any) => list.some(name => item.Name.indexOf(name) !== -1)
      },
      {
        name: 'Danh mục',
        prop: 'Menu',
        _subprop: 'Name',
        type: 'text',
        //listOfFilter: menuFilterList,
        //sortOrder: null,
        sortFn: (a: any, b: any) => a.Menu?.Name.localeCompare(b.Menu?.Name),
        filterFn: (list: string[], item: any) => list.some(name => item.Menu?.Name.indexOf(name) !== -1)
      },
      {
        name: 'Giá niêm yết',
        prop: 'Price',
        type: 'number',
        //sortOrder: null,
        sortFn: (a: any, b: any) => a.Price - b.Price,
      },
      {
        name: 'Giá bán',
        prop: 'DiscountPrice',
        type: 'number',
        //sortOrder: null,
        sortFn: (a: any, b: any) => a.DiscountPrice - b.DiscountPrice,
      },
      {
        name: 'Nổi bật',
        prop: 'Selling',
        type: 'bool',
        listOfFilter: [
          { text: 'True', value: true },
          { text: 'False', value: false }
        ],
        filterFn: (list: string[], item: any) => list.some(name => item.Selling == name)
      },
      {
        name: 'Trạng thái',
        prop: 'Status',
        type: 'number',
        //sortOrder: null,
      },
      {
        name: 'Thứ tự',
        prop: 'Index',
        type: 'number',
        //sortOrder: null,
        sortFn: (a: any, b: any) => a.Index - b.Index,
      },
      {
        name: 'Số lượng',
        prop: 'Quantity',
        type: 'number',
        //sortOrder: null,
        sortFn: (a: any, b: any) => a.Quantity - b.Quantity,
      }
    ];
    this.menuService.loadAllProductMenu().subscribe(resp => {
      if (resp) {
        var menuFilterList: any[] = [];
        resp.forEach(item => {
          menuFilterList.push({ text: item.name, value: item.id })
        })
        this.dataColumns = [
          {
            name: 'Hình ảnh',
            prop: 'Image',
            type: 'image',
            //sortOrder: null,
          },
          // {
          //   name: 'Hình ảnh',
          //   prop: 'ImageCloudLink',
          //   type: 'image',
          //   //sortOrder: null,
          // },
          {
            name: 'Tên hàng',
            prop: 'Name',
            type: 'text',
            //sortOrder: null,
            width: '40px',
            sortFn: (a: any, b: any) => a.Name.localeCompare(b.Name),
            // listOfFilter: [
            //   { text: 'laptop', value: 'a' },
            //   { text: 'Jim', value: 'HMTien' }
            // ],
            filterFn: (list: string[], item: any) => list.some(name => item.Name.indexOf(name) !== -1)
          },
          {
            name: 'Danh mục',
            prop: 'Menu',
            _subprop: 'Name',
            type: 'text',
            with: '200px',
            listOfFilter: menuFilterList,
            //sortOrder: null,
            sortFn: (a: any, b: any) => a.Menu?.Name.localeCompare(b.Menu?.Name),
            filterFn: (list: string[], item: any) => list.some(name => item.MenuId == name)
          },
          {
            name: 'Giá niêm yết',
            prop: 'Price',
            type: 'number',
            //sortOrder: null,
            sortFn: (a: any, b: any) => a.Price - b.Price,
          },
          {
            name: 'Giá bán',
            prop: 'DiscountPrice',
            type: 'number',
            //sortOrder: null,
            sortFn: (a: any, b: any) => a.DiscountPrice - b.DiscountPrice,
          },
          {
            name: 'Nổi bật',
            prop: 'Selling',
            type: 'bool',
            listOfFilter: [
              { text: 'True', value: true },
              { text: 'False', value: false }
            ],
            filterFn: (list: string[], item: any) => list.some(name => item.Selling == name)
          },
          {
            name: 'Trạng thái',
            prop: 'Status',
            type: 'number',
            //sortOrder: null,
          },
          {
            name: 'Thứ tự',
            prop: 'Index',
            type: 'number',
            //sortOrder: null,
            sortFn: (a: any, b: any) => a.Index - b.Index,
          },
          {
            name: 'Số lượng',
            prop: 'Quantity',
            type: 'number',
            //sortOrder: null,
            sortFn: (a: any, b: any) => a.Quantity - b.Quantity,
          }
        ];
      } else {
        this.dataColumns = [
          {
            name: 'Hình ảnh',
            prop: 'Image',
            type: 'image',
            //sortOrder: null,
          },
          {
            name: 'Cloud Image',
            prop: 'ImageCloudLink',
            type: 'image',
            //sortOrder: null,
          },
          {
            name: 'Tên hàng',
            prop: 'Name',
            type: 'text',
            //sortOrder: null,
            sortFn: (a: any, b: any) => a.name.localeCompare(b.name),
            // listOfFilter: [
            //   { text: 'laptop', value: 'a' },
            //   { text: 'Jim', value: 'HMTien' }
            // ],
            filterFn: (list: string[], item: any) => list.some(name => item.Name.indexOf(name) !== -1)
          },
          {
            name: 'Danh mục',
            prop: 'Menu',
            _subprop: 'Name',
            type: 'text',
            //listOfFilter: menuFilterList,
            //sortOrder: null,
            sortFn: (a: any, b: any) => a.Menu?.Name.localeCompare(b.Menu?.Name),
            filterFn: (list: string[], item: any) => list.some(name => item.Menu?.Name.indexOf(name) !== -1)
          },
          {
            name: 'Giá niêm yết',
            prop: 'Price',
            type: 'number',
            //sortOrder: null,
            sortFn: (a: any, b: any) => a.Price - b.Price,
          },
          {
            name: 'Giá bán',
            prop: 'DiscountPrice',
            type: 'number',
            //sortOrder: null,
            sortFn: (a: any, b: any) => a.DiscountPrice - b.DiscountPrice,
          },
          {
            name: 'Nổi bật',
            prop: 'Selling',
            type: 'bool',
            listOfFilter: [
              { text: 'True', value: true },
              { text: 'False', value: false }
            ],
            filterFn: (list: string[], item: any) => list.some(name => item.Selling == name)
          },
          {
            name: 'Trạng thái',
            prop: 'Status',
            type: 'number',
            //sortOrder: null,
          },
          {
            name: 'Thứ tự',
            prop: 'Index',
            type: 'number',
            //sortOrder: null,
            sortFn: (a: any, b: any) => a.Index - b.Index,
          },
          {
            name: 'Số lượng',
            prop: 'Quantity',
            type: 'number',
            //sortOrder: null,
            sortFn: (a: any, b: any) => a.Quantity - b.Quantity,
          }
        ];
      }
    });
  }
  reload() {
    this.filter = {
      keySearch: '',
      menuId: null,
      highLight: null
    };
    this.getData();
  }
  refreshTable(value: boolean) {
    if (value) {
      this.productTable.setOfCheckedId = new Set<number>();
    }
  }
  getData() {
    this.spinner.show();
    this.productService
      .get({
        keySearch: '',
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
          this.filterDatas = this.datas;
          this.searchProduct();
        },
        error: (error) => {
          this.messageService.error(error.error.message);
        }
      }
      );
  }

  // search(): void {
  //   const data = this.datas;
  //   this.displayData = this.tableSvc.search(this.searchInput, data);
  // }
  searchProduct() {
    var keySearch = this.filter.keySearch.toLowerCase();
    // if (this.filter.highLight !== null) {
    //   this.filterDatas = this.datas.filter(x => x.Selling == this.filter.highLight)
    //   this.filterDatas = this.filterDatas.filter(x => x.Name.toLowerCase().includes(keySearch)
    //     || x.Alias.toLowerCase().includes(keySearch)
    //     || x.Price.toString().toLowerCase().includes(keySearch))
    // }
    // else {
    //   this.filterDatas = this.datas.filter(x => x.Name.toLowerCase().includes(keySearch)
    //     || x.Alias.toLowerCase().includes(keySearch)
    //     || x.Price.toString().toLowerCase().includes(keySearch))
    // }
    this.filterDatas = this.datas.filter(x => x.Name.toLowerCase().includes(keySearch)
      || x.Alias.toLowerCase().includes(keySearch)
      || x.Price.toString().toLowerCase().includes(keySearch))
  }
  changeMenuItem() {
    this.getData();
    this.searchProduct();
  }
  onDelete(product: Product) {
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
          this.productTable.setOfCheckedId.delete(product.Id);
        },
        error: (err) => {
          this.messageService.error(err);
        },
      });
  }
  deleteListProduct(productId: Product[]) {
    var listOfProducts: number[] = [];
    productId.forEach(item => {
      listOfProducts.push(item.Id)
    })
    if (listOfProducts.length <= 1) {
      this.productService
        .deleteByListId(listOfProducts)
        .subscribe({
          next: (resp: any) => {
            this.messageService.success('Xóa thành công');
            this.getData();
            this.refreshTable(true);
          },
          error: (err) => {
            this.messageService.error(err);
          },
        });
    } else {
      this.messageService.success('Đã xảy ra lỗi');
    }

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

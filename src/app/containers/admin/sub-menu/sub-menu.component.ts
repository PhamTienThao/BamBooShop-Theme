import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { TableTemplateComponent } from 'src/app/components/table-template/table-template.component';
import { Menu } from 'src/app/core/model/menu';
import { MenuService } from 'src/app/core/service/menu.service';
import { SubMenuDetailComponent } from './sub-menu-detail/sub-menu-detail.component';

@Component({
  selector: 'app-sub-menu',
  templateUrl: './sub-menu.component.html',
  styleUrls: ['./sub-menu.component.css'],
})
export class SubMenuComponent implements OnInit {
  @ViewChild('frmDetail', { static: true }) frmDetail!: SubMenuDetailComponent;
  @ViewChild('submenuTable', { static: true })
  menuTable!: TableTemplateComponent;

  datas: Menu[] = [];
  dataColumns: any[] = [];
  filterDatas: Menu[] = [];
  filter = {
    keySearch: '',
  };

  constructor(
    private menuService: MenuService,
    private spinner: NgxSpinnerService,
    private messageService: NzMessageService
  ) {}

  ngOnInit() {
    this.getData();
    this.tableInit();
  }

  getData() {
    this.spinner.show();
    this.menuService
      .getSubMenu(this.filter)
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

  delete(menu: Menu) {
    this.spinner.show();
    this.menuService
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
  refreshTable(value: boolean) {
    if (value) {
      this.menuTable.setOfCheckedId = new Set<number>();
    }
  }
  deleteListMenu(menuId: Menu[]) {
    var listOfMenu: any[] = [];
    menuId.forEach((item) => {
      listOfMenu.push(item.Id);
    });
    if (listOfMenu.length <= 1) {
      this.menuService.deleteByListId(listOfMenu).subscribe({
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
      Active: true,
      Index: 1,
      ShowHomePage: true,
    });
  }

  showDetail(menu: Menu) {
    this.frmDetail.isAddNew = false;
    this.frmDetail.visible = true;
    this.frmDetail.setForm(menu);
  }
  tableInit() {
    this.dataColumns = [
      {
        name: 'Tên menu',
        prop: 'Name',
        type: 'number',
        sortFn: (a: any, b: any) => a.Name.localeCompare(b.Name),
      },
      {
        name: 'Danh mục cha',
        prop: 'PMenu',
        _subprop: 'Name',
        type: 'text',
        sortFn: (a: any, b: any) => a.PMenu?.Name.localeCompare(b.PMenu?.Name),
      },
      {
        name: 'Thứ tự hiển thị',
        prop: 'Index',
        type: 'text',
        sortFn: (a: any, b: any) => a.Index - b.Index,
      },
      {
        name: 'Trạng thái hiển thị',
        prop: 'Active',
        type: 'number',
      },
      {
        name: 'Hiển thị trang chủ',
        prop: 'ShowHomePage',
        type: 'text',
        listOfFilter: [
          { text: 'Có hiển thị', value: true },
          { text: 'Không hiển thị', value: false },
        ],
        filterFn: (list: string[], item: any) =>
          list.some((name) => item.ShowHomePage == name),
      },
    ];
  }
  onSubmit(menu: Menu) {
    if (this.frmDetail.isAddNew) {
      menu.Group = 'sub';
      this.spinner.show();
      this.menuService
        .post(menu)
        .pipe(
          finalize(() => {
            this.spinner.hide();
          })
        )
        .subscribe({
          next: (resp: any) => {
            this.messageService.success('Thêm mới thành công');
            this.getData();
            this.frmDetail.visible = false;
          },
          error: (err) => {
            this.messageService.error(err);
          },
        });
    } else {
      this.spinner.show();
      this.menuService
        .put(menu.Id, menu)
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
  }
}

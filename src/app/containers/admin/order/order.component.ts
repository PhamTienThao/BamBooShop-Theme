import { Customer } from './../../../core/model/customer';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { Order, OrderStatus } from 'src/app/core/model/order';
import { OrderService } from 'src/app/core/service/order.service';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { TableTemplateComponent } from 'src/app/components/table-template/table-template.component';
import { CustomerService } from 'src/app/core/service/customer.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  @ViewChild('frmDetail', { static: true }) frmDetail!: OrderDetailComponent;
  @ViewChild('orderTable', { static: true })
  orderTable!: TableTemplateComponent;

  datas: Order[] = [];
  orderSelected!: Order;
  dataColumns: any[] = [];
  filterDatas: Order[] = [];

  filter = {
    keySearch: '',
    status: null,
    rangeDate: [],
  };

  constructor(
    private orderService: OrderService,
    private customerService: CustomerService,
    private spinner: NgxSpinnerService,
    private messageService: NzMessageService
  ) {}

  ngOnInit() {
    this.getData();
    this.tableInit();
    console.log(this.dataColumns);
  }

  getData() {
    let fDate: string = '';
    let tDate: string = '';

    if (this.filter.rangeDate != null && this.filter.rangeDate.length == 2) {
      fDate = moment(new Date(this.filter.rangeDate[0])).format(
        'YYYY-MM-DDTHH:mm:ss'
      );
      tDate = moment(new Date(this.filter.rangeDate[1])).format(
        'YYYY-MM-DDTHH:mm:ss'
      );
    }

    this.spinner.show();
    this.orderService
      .get({
        keySearch: this.filter.keySearch,
        status: this.filter.status ?? -1,
        fDate,
        tDate,
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
  tableInit() {
    this.dataColumns = [
      {
        name: 'Mã đơn hàng',
        prop: 'Id',
        type: 'number',
      },
      {
        name: 'Ngày đặt hàng',
        prop: 'Created',
        type: 'text',
      },
      {
        name: 'Tên khách hàng',
        prop: 'Customer',
        _subprop: 'FullName',
        type: 'text',
        sortFn: (a: any, b: any) =>
          a.Customer?.FullName.localeCompare(b.Customer?.FullName),
      },
      {
        name: 'Số điện thoại',
        prop: 'PhoneNumber',
        type: 'number',
      },
      {
        name: 'Địa chỉ',
        prop: 'Address',
        type: 'text',
      },
      {
        name: 'Tổng tiền',
        prop: 'TotalAmount',
        type: 'number',
        sortFn: (a: any, b: any) => a.TotalAmount - b.TotalAmount,
      },
      {
        name: 'Trạng thái',
        prop: 'Status',
        type: 'text',
        listOfFilter: [
          { text: 'Chờ xác nhận', value: 10 },
          { text: 'Đã xác nhận', value: 20 },
          { text: 'Đang vận chuyển', value: 30 },
          { text: 'Đã giao', value: 40 },
          { text: 'Đã hủy', value: 50 },
        ],
        filterFn: (list: string[], item: any) =>
          list.some((name) => item.Status == name),
      },
    ];
  }
  showOrderDetail(order: Order) {
    this.orderSelected = order;
    this.spinner.show();
    this.orderService
      .getById(order.Id)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe({
        next: (resp: any) => {
          this.frmDetail.visible = true;
          this.frmDetail.setForm(JSON.parse(resp['data']));
        },
        error: (err) => {
          this.messageService.error(err);
        },
      });
  }
  onDelete(order: Order) {
    this.spinner.show();
    this.orderService
      .deleteById(order.Id)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe({
        next: (resp: any) => {
          this.messageService.success('Xóa thành công');
          this.getData();
          this.orderTable.setOfCheckedId.delete(order.Id);
        },
        error: (err) => {
          this.messageService.error(err);
        },
      });
  }
  refreshTable(value: boolean) {
    if (value) {
      this.orderTable.setOfCheckedId = new Set<number>();
    }
  }
  deleteListProduct(orderId: Order[]) {
    var listOfProducts: number[] = [];
    orderId.forEach((item) => {
      listOfProducts.push(item.Id);
    });
    if (listOfProducts.length <= 1) {
      this.orderService.deleteByListId(listOfProducts).subscribe({
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

  onChangeStatus(status: number) {
    this.spinner.show();
    this.orderService
      .changeStatus(this.orderSelected.Id, status)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe({
        next: (resp: any) => {
          this.messageService.success('Cập nhật thành công');
          this.showOrderDetail(this.orderSelected);
          this.getData();
        },
        error: (err) => {
          this.messageService.error(err);
        },
      });
  }
}

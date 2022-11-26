import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { Order } from 'src/app/core/model/order';
import { ReportService } from 'src/app/core/service/report.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit {
  datas: Order[] = [];
  dataColumns: any[] = [];
  filterDatas: Order[] = [];
  filter = {
    keySearch: '',
    status: null,
    rangeDate: [],
  };

  constructor(
    private reportService: ReportService,
    private spinner: NgxSpinnerService,
    private messageService: NzMessageService
  ) {}

  ngOnInit() {
    this.getData();
    this.tableInit();
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
    this.reportService
      .getGeneralReport({
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
}

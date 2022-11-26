import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { TableTemplateComponent } from 'src/app/components/table-template/table-template.component';
import { Customer } from 'src/app/core/model/customer';
import { CustomerService } from 'src/app/core/service/customer.service';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements OnInit {
  @ViewChild('frmDetail', { static: true }) frmDetail!: CustomerDetailComponent;
  @ViewChild('customerTable', { static: true })
  customerTable!: TableTemplateComponent;

  datas: Customer[] = [];
  filterDatas: Customer[] = [];
  dataColumns: any[] = [];

  filter = {
    keySearch: '',
  };

  constructor(
    private customerService: CustomerService,
    private spinner: NgxSpinnerService,
    private messageService: NzMessageService
  ) {}

  ngOnInit() {
    this.getData();
    this.tableInit();
  }

  getData() {
    this.spinner.show();
    this.customerService
      .get(this.filter)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe({
        next: (resp: any) => {
          this.datas = JSON.parse(resp['data']);
        },
        error: (err: any) => {
          this.messageService.error(err);
        },
      });
  }
  tableInit() {
    this.dataColumns = [
      {
        name: 'Tên khách hàng',
        prop: 'FullName',
        type: 'text',
        sortFn: (a: any, b: any) => a.FullName.localeCompare(b.FullName),
      },
      {
        name: 'Số điện thoại',
        prop: 'PhoneNumber',
        type: 'number',
      },
      {
        name: 'Email',
        prop: 'Email',
        type: 'text',
      },
      {
        name: 'Ngày sinh',
        prop: 'Dob',
        type: 'text',
      },
      {
        name: 'Giới tính',
        prop: 'Gender',
        type: 'text',
        listOfFilter: [
          { text: 'Nam', value: 'Nam' },
          { text: 'Nữ', value: 'Nữ' },
        ],
        filterFn: (list: string[], item: any) =>
          list.some((name) => item.Gender == name),
      },
      {
        name: 'Địa chỉ',
        prop: 'Address',
        type: 'text',
      },
    ];
  }
  showDetail(customer: Customer) {
    this.spinner.show();
    this.customerService
      .getById(customer.Code)
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
        error: (err: any) => {
          this.messageService.error(err);
        },
      });
  }
}

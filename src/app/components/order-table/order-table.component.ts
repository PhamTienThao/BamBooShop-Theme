import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { Order, OrderStatus } from 'src/app/core/model/order';
import { OrderDetail } from 'src/app/core/model/order-detail';
import { Review } from 'src/app/core/model/review';
import { CustomerService } from 'src/app/core/service/customer.service';
import { OrderService } from 'src/app/core/service/order.service';
import { ReviewService } from 'src/app/core/service/review.service';
import { OrderTemplateComponent } from '../order-template/order-template.component';

@Component({
  selector: 'app-order-table',
  templateUrl: './order-table.component.html',
  styleUrls: ['./order-table.component.css']
})
export class OrderTableComponent implements OnInit {
  orders: Order[] = [];
  orderDetailSelected!: OrderDetail;
  isVisibleModal: boolean = false;
  tooltips = ['Rất không hài lòng', 'Không hài lòng', 'Bình thường', 'Hài lòng', 'Rất hài lòng'];
  reviewModel!: Review;
  orderStatus = [
    { value: 0, name: 'All' },
    { value: 10, name: 'Waiting for confirm' },
    { value: 20, name: 'Confirmed' },
    { value: 30, name: 'Delivering' },
    { value: 40, name: 'Delivered' },
    { value: 50, name: 'Canceled' },
    { value: 60, name: 'Paid Order' },
    { value: 70, name: 'Not Paid Order' },
  ];
  orderFilter: Order[] = [];
  orderFilterIndexValue: number = 0;
  constructor(
    private reviewService: ReviewService,
    private orderService: OrderService,
    private messageService: NzMessageService,
    private spinner: NgxSpinnerService,
    private customerService: CustomerService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.getOrders();
  }

  chooseAttribute(event: any) {
    this.orderFilterIndexValue = Number(event.target.value);
    if (this.orderFilterIndexValue == 0 || this.orderFilterIndexValue == null || this.orderFilterIndexValue == undefined) {
      this.getOrders();
    } else {
      switch (this.orderFilterIndexValue) {
        case 60:
          this.orderFilter = this.orders.filter(x => x.IsPaid == true);
          break;
        case 70:
          this.orderFilter = this.orders.filter(x => x.IsPaid == false);
          break;
        default:
          this.orderFilter = this.orders.filter(x => x.Status == this.orderFilterIndexValue);
      }
    }
  }
  filterOrderStatusName(status: number) {
    return this.orderStatus.find(x => x.value == status)?.name;
  }
  getOrders() {
    this.customerService.getOrders()
      .subscribe({
        next: (resp: any) => {
          this.orders = JSON.parse(resp["data"]);
          this.orderFilter = this.orders;
        }, error: (err: any) => {
        }
      })
  }
  view(order: Order) {
    //config data
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.maxHeight = "80vh";
    dialogConfig.width = "75vw";
    dialogConfig.data = order;

    //pass data
    let openedDialog = this.dialog.open(OrderTemplateComponent, dialogConfig);

    //after close dialog and catch data from dialog
    openedDialog.afterClosed().subscribe(result => {
      if (result) {
        this.customerService.getOrders()
          .subscribe({
            next: (resp: any) => {
              this.orders = JSON.parse(resp["data"]);
              this.orderFilter = this.orders.filter(x => x.Status == this.orderFilterIndexValue);
            }, error: (err: any) => {

            }
          })
      } else {

      }
    })
  }

}

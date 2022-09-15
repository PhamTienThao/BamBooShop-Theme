import { Component, Input, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { Order, OrderStatus } from 'src/app/core/model/order';
import { OrderDetail } from 'src/app/core/model/order-detail';
import { Review } from 'src/app/core/model/review';
import { CustomerService } from 'src/app/core/service/customer.service';
import { OrderService } from 'src/app/core/service/order.service';
import { ReviewService } from 'src/app/core/service/review.service';

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
  ];
  orderFilter: Order[] = [];

  constructor(
    private reviewService: ReviewService,
    private orderService: OrderService,
    private messageService: NzMessageService,
    private spinner: NgxSpinnerService,
    private customerService: CustomerService
  ) {
  }

  ngOnInit() {
    this.getOrders();
  }

  chooseAttribute(event: any) {
    let index = Number(event.target.value);
    this.filterOrderByStatus(index);
  }

  filterOrderByStatus(status: number) {
    if (status == 0) {
      this.getOrders();
    } else {
      this.orderFilter = this.orders.filter(x => x.Status == status);
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
          this
        }, error: (err: any) => {
        }
      })
  }

}

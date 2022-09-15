import { Component, Input, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';
import { Order } from 'src/app/core/model/order';
import { OrderDetail } from 'src/app/core/model/order-detail';
import { Review } from 'src/app/core/model/review';
import { OrderService } from 'src/app/core/service/order.service';
import { ReviewService } from 'src/app/core/service/review.service';

@Component({
  selector: 'app-order-table',
  templateUrl: './order-table.component.html',
  styleUrls: ['./order-table.component.css']
})
export class OrderTableComponent implements OnInit {
  @Input() order!: Order;

  orderDetailSelected!: OrderDetail;
  isVisibleModal: boolean = false;
  tooltips = ['Rất không hài lòng', 'Không hài lòng', 'Bình thường', 'Hài lòng', 'Rất hài lòng'];
  reviewModel!: Review;

  constructor(
    private reviewService: ReviewService,
    private orderService: OrderService,
    private messageService: NzMessageService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
  }

  get getTotalAmount(): number {
    let total: number = 0;
    this.order.OrderDetails.forEach(x => {
      total += x.Qty * x.ProductDiscountPrice;
    })

    return total;
  }

  review(orderDetail: OrderDetail) {
    this.orderDetailSelected = orderDetail;
    this.reviewService.getByOrder(this.orderDetailSelected.Id ?? 0)
      .subscribe((resp: any) => {
        let data: Review = JSON.parse(resp["data"]);
        if (data == null) {
          this.reviewModel = {
            Content: "",
            Star: 0,
            Status: -1
          };
        }
        else {
          this.reviewModel = data;
        }
        this.isVisibleModal = true;
      }, (error: any) => {
        this.messageService.error(error.error.message);
      })

  }

  confirmReview() {
    this.reviewService.review(this.orderDetailSelected.Id ?? 0, this.reviewModel.Star, this.reviewModel.Content)
      .subscribe((resp: any) => {
        this.messageService.success("Thành công");
        this.isVisibleModal = false;
        this.orderDetailSelected.IsReview = true;
      }, (error: any) => {
        this.messageService.error(error.error.message);
      })
  }
  cancelOrder(status: number) {
    this.spinner.show();
    this.orderService.changeStatus(this.order.Id, status)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe((resp: any) => {
        this.messageService.success("Cập nhật thành công");
        //this.showOrderDetail(this.orderSelected);
        //this.getData();
      }, error => {
        this.messageService.error(error.error.message);
      });
      location.reload();
  }

}

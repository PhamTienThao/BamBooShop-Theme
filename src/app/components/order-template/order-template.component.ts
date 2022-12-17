import { Component, Inject, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Order } from 'src/app/core/model/order';
import { OrderDetail } from 'src/app/core/model/order-detail';
import { Review } from 'src/app/core/model/review';
import { OrderService } from 'src/app/core/service/order.service';
import { ReviewService } from 'src/app/core/service/review.service';
import { finalize } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-order-template',
  templateUrl: './order-template.component.html',
  styleUrls: ['./order-template.component.css'],
})
export class OrderTemplateComponent implements OnInit {
  @Input() order!: Order;

  orderDetailSelected!: OrderDetail;
  isVisibleModal: boolean = false;
  reviewModel!: Review;
  reloadData: boolean = false;
  isDelivered: boolean = false;
  constructor(
    private reviewService: ReviewService,
    private orderService: OrderService,
    private toastrService: ToastrService,
    public dialogRef: MatDialogRef<OrderTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Order
  ) {
    if (this.data.Status == 40) this.isDelivered = true;
  }

  ngOnInit(): void {}

  get getTotalAmount(): number {
    let total: number = 0;
    this.order.OrderDetails.forEach((x) => {
      total += x.Qty * x.ProductDiscountPrice;
    });

    return total;
  }

  confirmReview() {
    this.reviewService
      .review(
        this.orderDetailSelected.Id ?? 0,
        this.reviewModel.Star,
        this.reviewModel.Content
      )
      .subscribe({
        next: (resp: any) => {
          this.toastrService.success('Review Saved', '', {
            positionClass: 'toast-bottom-right',
          });
          this.isVisibleModal = false;
          this.orderDetailSelected.IsReview = true;
        },
        error: (err: any) => {
          this.toastrService.error(err.error.message, '', {
            positionClass: 'toast-bottom-right',
          });
        },
      });
  }
  review(orderDetail: OrderDetail) {
    this.orderDetailSelected = orderDetail;
    this.reviewService.getByOrder(this.orderDetailSelected.Id ?? 0).subscribe({
      next: (resp: any) => {
        let data: Review = JSON.parse(resp['data']);
        if (data == null) {
          this.reviewModel = {
            Content: '',
            Star: 0,
            Status: -1,
          };
        } else {
          this.reviewModel = data;
          if (
            this.reviewModel.Content == null ||
            this.reviewModel.Content == undefined
          )
            this.reviewModel.Content = '';
        }
        this.isVisibleModal = true;
      },
      error: (err: any) => {
        this.toastrService.error(err.error.message, '', {
          positionClass: 'toast-bottom-right',
        });
      },
    });
  }
  rateChange(data: any) {
    this.reviewModel.Star = Number(data);
  }
  closeReview() {
    this.isVisibleModal = false;
  }
  cancelOrder() {
    this.orderService.changeStatus(this.data.Id, 50).subscribe({
      next: (resp: any) => {
        this.toastrService.success('Cancel Success', '', {
          positionClass: 'toast-bottom-right',
        });
        this.reloadData = true;
        this.dialogRef.close(this.reloadData);
      },
      error: (err: any) => {
        this.toastrService.error(err.error.message, '', {
          positionClass: 'toast-bottom-right',
        });
      },
    });
  }
  close() {
    this.dialogRef.close(this.reloadData);
  }
  paidStatus(isPaid: boolean) {
    if (isPaid) return 'Đã thanh toán';
    else return '';
  }
}

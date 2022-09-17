import { Component, Inject, Input, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
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
  styleUrls: ['./order-template.component.css']
})
export class OrderTemplateComponent implements OnInit {
  @Input() order!: Order;

  orderDetailSelected!: OrderDetail;
  isVisibleModal: boolean = false;
  tooltips = ['Rất không hài lòng', 'Không hài lòng', 'Bình thường', 'Hài lòng', 'Rất hài lòng'];
  reviewModel!: Review;
  reloadData: boolean = false;
  constructor(
    private reviewService: ReviewService,
    private orderService: OrderService,
    private messageService: NzMessageService,
    public dialogRef: MatDialogRef<OrderTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Order,
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
  cancelOrder() {
    this.orderService.changeStatus(this.data.Id, 50)
      .subscribe({
        next: (resp: any) => {
          this.messageService.success("Cập nhật thành công");
          //this.showOrderDetail(this.orderSelected);
          //this.getData();
          this.reloadData = true;
          this.dialogRef.close(this.reloadData);
        }, error: (err: any) => {
          this.messageService.error(err.error.message);
        }
      });
    }
  close() {
    this.dialogRef.close(this.reloadData);
  }
}

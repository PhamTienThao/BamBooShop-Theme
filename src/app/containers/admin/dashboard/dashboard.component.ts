import { BestSellProductDetail, Product } from './../../../core/model/product';
import { ProductService } from 'src/app/core/service/product.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from 'src/app/core/service/report.service';
import { EChartsOption } from 'echarts';
import { Customer } from 'src/app/core/model/customer';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomerService } from 'src/app/core/service/customer.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProductDetailComponent } from '../product/product-detail/product-detail.component';
import { OrderStatus } from 'src/app/core/model/order';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('frmDetail', { static: true }) frmDetail!: ProductDetailComponent;

  date: Date = new Date();
  datas: Customer[] = [];
  productsList: BestSellProductDetail[] = [];
  dataHighlight!: ReportHighlight;

  orderStatus!: OrderStatus;

  pieChartOption!: EChartsOption;
  lineChartOption!: EChartsOption; 
  barChartOption!: EChartsOption;

  constructor(
    private reportService: ReportService,
    private customerService: CustomerService,
    private productService: ProductService,
    private spinner: NgxSpinnerService,
    private messageService: NzMessageService
  ) { }
  ngOnInit() {
    this.getData();
    this.getTopOrderCustomer();
    this.getTopSellProduct();
  }

  getData() {
    this.reportService.getHighlight(this.date).subscribe({
      next: (resp: any) => {
        this.dataHighlight = JSON.parse(resp['data']);
        console.log(this.dataHighlight);
        //pieChartOption
        var pieData: any;
        var isNoDatPieChart: boolean = true;
        for (var i = 0; i < this.dataHighlight.OrderQtyByStatus.length; i++) {
          if (this.dataHighlight.OrderQtyByStatus[i] > 0) {
            pieData = [
              { value: this.dataHighlight.OrderQtyByStatus[0], name: OrderStatus.toString(10) },
              { value: this.dataHighlight.OrderQtyByStatus[1], name: OrderStatus.toString(20) },
              { value: this.dataHighlight.OrderQtyByStatus[2], name: OrderStatus.toString(30) },
              { value: this.dataHighlight.OrderQtyByStatus[3], name: OrderStatus.toString(40) },
              { value: this.dataHighlight.OrderQtyByStatus[4], name: OrderStatus.toString(50) }
            ];
            isNoDatPieChart = false;
            break;
          }
        }
        this.pieChartOption = {
          // title: {
          //   text: isNoDatPieChart ? "No data" : "",
          //   //subtext: 'Fake Data',
          //   left: 'center'
          // },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          legend: {
            bottom: 10,
            left: 'center',
            data: ['Chờ xác nhận', 'Đã xác nhận', 'Đang vận chuyển', 'Đã giao', 'Đã hủy']
          },
          series: [
            {
              type: 'pie',
              radius: '65%',
              center: ['50%', '50%'],
              selectedMode: 'single',
              label: {
                show: false
              },
              data: pieData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }]
        };

        //barChartOption
        var barData = this.dataHighlight.Revenues.map((x, index) => { return ['T' + (index + 1), x]; });
        this.barChartOption = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            data: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: barData,
              type: 'bar'
            }
          ]
        };

        //lineChartOption
        var lineChartTotalOrder: any[] = this.dataHighlight.OrderQty.map((x, index) => {return x});
        var lineChartXAxis: any[] = this.dataHighlight.OrderQty.map((x, index) => {return 'T' + (index + 1)});
        this.lineChartOption = {
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: lineChartXAxis
          },
          yAxis: {
            type: 'value'
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          legend: {
            bottom: 0,
            data: ['Tổng Đơn hàng', OrderStatus.toString(10), OrderStatus.toString(20), 
            OrderStatus.toString(30), OrderStatus.toString(40), OrderStatus.toString(50)]
          },
          series: [
            {
              name: 'Tổng Đơn hàng',
              data: lineChartTotalOrder,
              type: 'line',
            },
            {
              name: OrderStatus.toString(10),
              data: this.dataHighlight.OrderQtyByStatusInYear[0],
              type: 'line',
             
            },
            {
              name: OrderStatus.toString(20),
              data: this.dataHighlight.OrderQtyByStatusInYear[1],
              type: 'line',             
            },
            {
              name: OrderStatus.toString(30),
              data: this.dataHighlight.OrderQtyByStatusInYear[2],
              type: 'line',              
            },
            {
              name: OrderStatus.toString(40),
              data: this.dataHighlight.OrderQtyByStatusInYear[3],
              type: 'line',              
            },
            {
              name: OrderStatus.toString(50),
              data: this.dataHighlight.OrderQtyByStatusInYear[4],
              type: 'line',             
            }
          ]
        };

      },
      error: (error) => {this.messageService.error(error);},
    });
  }

  getTopOrderCustomer() {
    this.spinner.show();
    this.customerService
      .getTopOrderCustomer()
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

  onSelect(event: any) {
  }
  getTopSellProduct() {
    this.spinner.show();
    this.productService.getTopProductBestSeller().subscribe({
      next: (res: any) => {
        this.productsList = JSON.parse(res['data']);
        this.spinner.hide();
      },
      error: (err: any) => {
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

  showDetail(productId: number) {
    this.spinner.show();
    this.productService
      .getById(productId)
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
}

export interface ReportHighlight {
  TotalNewOrder: number;
  DailySales: number;
  TotalOrder: number;
  SalesRevenue: number;
  OrderQty: number[];
  OrderQtyByStatus: number[];
  OrderQtyByStatusInYear:any[];
  Revenues: number[];
}

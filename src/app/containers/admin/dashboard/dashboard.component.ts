import { BestSellProductDetail, Product } from './../../../core/model/product';
import { ProductService } from 'src/app/core/service/product.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportService } from 'src/app/core/service/report.service';
import { ChartOptions } from 'chart.js';
import { Customer } from 'src/app/core/model/customer';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { CustomerService } from 'src/app/core/service/customer.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProductDetailComponent } from '../product/product-detail/product-detail.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('frmDetail', { static: true }) frmDetail!: ProductDetailComponent;

  date: Date = new Date();
  datas: Customer[] = [];
  dataHighlight!: ReportHighlight;

  chartStatus: any = {
    type: 'pie',
    data: [],
    options: {
      cutoutPercentage: 80,
      maintainAspectRatio: false,
    },
    color: {
      backgroundColor: ['#6bcc21', '#3ca5ff', '#0097a7', '#ffa924', '#e20606'],
      pointBackgroundColor: [
        '#6bcc21',
        '#3ca5ff',
        '#0097a7',
        '#ffa924',
        '#e20606',
      ],
    },
    labels: [
      'Tạo mới',
      'Đã xác nhận',
      'Đang vận chuyển',
      'Đã hoàn thành',
      'Đã hủy',
    ],
  };

  chartOrder: any = {
    type: 'Line',
    data: [],
    options: {
      colors: ['#3ca5ff'],
    },
  };

  chartRevenue: any = {
    type: 'Bar',
    data: [],
    options: {
      colors: ['#3ca5ff'],
    },
  };

  // Data Test Area

  salesChartOptions: any = {
    scaleShowVerticalLines: false,
    maintainAspectRatio: false,
    responsive: true,
    borderRadius: 3,
    scales: {
      xAxes: [
        {
          display: true,
          scaleLabel: {
            display: false,
            labelString: 'Month',
          },
          gridLines: [
            {
              display: false,
            },
          ],
          ticks: {
            display: true,
            beginAtZero: true,
            fontSize: 13,
            padding: 10,
          },
        },
      ],
      yAxes: [
        {
          display: true,
          scaleLabel: {
            display: false,
            labelString: 'Value',
          },
          gridLines: {
            drawBorder: false,
            offsetGridLines: false,
            drawTicks: false,
            borderDash: [3, 4],
            zeroLineWidth: 1,
            zeroLineBorderDash: [3, 4],
          },
          ticks: {
            max: 80,
            stepSize: 20,
            display: true,
            beginAtZero: true,
            fontSize: 13,
            padding: 10,
          },
        },
      ],
    },
  };
  salesChartLabels: string[] = [
    'T1',
    'T2',
    'T3',
    'T4',
    'T5',
    'T6',
    'T7',
    'T8',
    'T9',
    'T10',
    'T11',
    'T12',
  ];
  salesChartType = 'bar';
  salesChartColors: Array<any> = [
    {
      backgroundColor: '#3ca5ff',
      borderWidth: 0,
    },
    {
      backgroundColor: '#3ca5ac',
      borderWidth: 0,
    },
  ];
  salesChartData: any[] = [
    {
      data: [300, 544, 214, 587, 201, 145, 214, 365, 102, 547, 236, 144],
      label: 'Sản phẩm đã bán',
      categoryPercentage: 0.8,
      barPercentage: 0.7,
    },
    {
      data: [25, 35, 40, 50, 60, 50],
      label: 'Số lượng đơn hàng',
      categoryPercentage: 0.8,
      barPercentage: 0.7,
    },
  ];

  revenueChartFormat: string = 'revenueMonth';

  revenueChartData: Array<any> = [
    {
      data: [30, 60, 40, 50, 40, 55, 85, 65, 75, 50, 70],
      label: 'Series A',
      tension: 0.3,
    },
  ];
  currentrevenueChartLabelsIdx = 1;
  revenueChartLabels: Array<any> = [
    '16th',
    '17th',
    '18th',
    '19th',
    '20th',
    '21th',
    '22th',
    '23th',
    '24th',
    '25th',
    '26th',
  ];
  revenueChartOptions: any = {
    maintainAspectRatio: false,
    responsive: true,
    hover: {
      mode: 'nearest',
      intersect: true,
    },
    tooltips: {
      mode: 'index',
    },
    scales: {
      xAxes: [
        {
          gridLines: [
            {
              display: false,
            },
          ],
          ticks: {
            display: true,
            fontColor: '',
            fontSize: 13,
            padding: 10,
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            drawBorder: false,
            drawTicks: false,
            borderDash: [3, 4],
            zeroLineWidth: 1,
            zeroLineBorderDash: [3, 4],
          },
          ticks: {
            display: true,
            max: 100,
            stepSize: 20,
            fontColor: '#0000009e',
            fontSize: 13,
            padding: 10,
          },
        },
      ],
    },
  };
  revenueChartColors: Array<any> = [
    {
      backgroundColor: 'rgb(0 255 243 / 18%)',
      borderColor: '#05c9a7',
      pointBackgroundColor: '#05c9a7',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#05c9a72e',
      pointHoverBorderColor: '#05c9a72e',
    },
  ];
  revenueChartType = 'line';
  productsList: BestSellProductDetail[] = [];
  // Data Test Area

  constructor(
    private reportService: ReportService,
    private customerService: CustomerService,
    private productService: ProductService,
    private spinner: NgxSpinnerService,
    private messageService: NzMessageService
  ) {}
  ngOnInit() {
    this.getData();
    this.getTopOrderCustomer();
    this.getTopSellProduct();
  }

  getData() {
    this.reportService.getHighlight(this.date).subscribe({
      next: (resp: any) => {
        this.dataHighlight = JSON.parse(resp['data']);
        this.chartStatus.data = [
          [this.dataHighlight.OrderQtyByStatus[0]],
          [this.dataHighlight.OrderQtyByStatus[1]],
          [this.dataHighlight.OrderQtyByStatus[2]],
          [this.dataHighlight.OrderQtyByStatus[3]],
          [this.dataHighlight.OrderQtyByStatus[4]],
        ];

        this.chartOrder.data = this.dataHighlight.OrderQty.map((x, index) => {
          return ['T' + (index + 1), x];
        });

        this.chartRevenue.data = this.dataHighlight.Revenues.map((x, index) => {
          return ['T' + (index + 1), x];
        });
      },
      error: (error) => {},
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
    console.log(event);
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
  Revenues: number[];
}

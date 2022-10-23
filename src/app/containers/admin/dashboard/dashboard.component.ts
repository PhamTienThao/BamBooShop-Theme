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
  pieChartOption: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
    },
    legend: {
      left: 'center',
      top: 'bottom',
    },

    series: [
      {
        type: 'pie',
        radius: [30, 160],
        center: ['50%', '50%'],
        roseType: 'radius',
        itemStyle: {
          borderRadius: 5,
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: false,
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 40, name: 'rose 1' },
          { value: 33, name: 'rose 2' },
          { value: 28, name: 'rose 3' },
          { value: 22, name: 'rose 4' },
          { value: 20, name: 'rose 5' },
          { value: 15, name: 'rose 6' },
          { value: 12, name: 'rose 7' },
          { value: 10, name: 'rose 8' },
        ],
      },
    ],
  };

  lineChartOption: EChartsOption = {
    legend: {
      left: 'center',
      top: 'bottom',
    },
    tooltip: {
      trigger: 'axis',
      showContent: true,
    },
    dataset: {
      source: [
        ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
        ['Milk Tea', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
        ['Matcha Latte', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
        ['Cheese Cocoa', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
      ],
    },
    xAxis: { type: 'category' },
    yAxis: { gridIndex: 0 },
    series: [
      {
        type: 'line',
        smooth: true,
        seriesLayoutBy: 'row',
        emphasis: { focus: 'series' },
      },
      {
        type: 'line',
        smooth: true,
        seriesLayoutBy: 'row',
        emphasis: { focus: 'series' },
      },
      {
        type: 'line',
        smooth: true,
        seriesLayoutBy: 'row',
        emphasis: { focus: 'series' },
      },
    ],
  };

  barChartOption: EChartsOption = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      data: ['Evaporation', 'Precipitation'],
      top: 'bottom',
      left: 'center',
    },
    xAxis: [
      {
        type: 'category',
        // name: 'Thứ ngày',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisPointer: {
          type: 'shadow',
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        // name: 'Precipitation',
        min: 0,
        max: 250,
        interval: 50,
        axisLabel: {
          formatter: '{value} ml',
        },
      },
    ],
    itemStyle: {
      borderRadius: 5,
      borderColor: '#fff',
      borderWidth: 2,
    },
    series: [
      {
        name: 'Evaporation',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            return value + ' ml';
          },
        },
        data: [120, 200, 150, 80, 70, 110, 130],
      },
      {
        name: 'Precipitation',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            return value + ' ml';
          },
        },
        data: [110, 150, 250, 70, 70, 110, 100],
      },
    ],
  };
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
        // this.chartStatus.data = [
        //   [this.dataHighlight.OrderQtyByStatus[0]],
        //   [this.dataHighlight.OrderQtyByStatus[1]],
        //   [this.dataHighlight.OrderQtyByStatus[2]],
        //   [this.dataHighlight.OrderQtyByStatus[3]],
        //   [this.dataHighlight.OrderQtyByStatus[4]],
        // ];

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

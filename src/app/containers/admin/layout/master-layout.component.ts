import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MenuNotification } from 'src/app/core/model/notification';
import { ReportService } from 'src/app/core/service/report.service';

@Component({
  selector: 'app-master-layout',
  templateUrl: './master-layout.component.html',
  styleUrls: ['./master-layout.component.css'],
})
export class MasterLayoutComponent implements OnInit {
  isCollapsed: boolean = false;
  constructor(
    private ngZone: NgZone,
    private router: Router,
    private reportService: ReportService,
    private messageService: NzMessageService
  ) {}
  title: string = 'Dashboard';
  menuDisplay: any[] = [];
  notificationData: number | undefined;
  notification: any;

  ngOnInit() {
    this.reportService.getMenuNotification().subscribe({
      next: (resp: any) => {
        this.notification = JSON.parse(resp['data']);
        console.log(this.notification);
        this.menuDisplay = [
          {
            navigate: '/admin',
            title: 'Tổng quan',
            icon: 'dashboard',
            sub: false,
          },
          {
            navigate: '',
            title: 'Đơn hàng',
            icon: 'shopping-cart',
            sub: true,
            notificationData: this.notification?.WipOrders,
            sub_menu: [
              {
                sub_nav: '/admin/don-hang/don-hang-can-xu-ly',
                sub_title: 'Đơn hàng cần xử lý',
                notificationData: this.notification?.WipOrders,
              },
              {
                sub_nav: '/admin/don-hang',
                sub_title: 'Danh sách đơn hàng',
                // notificationData: this.notification?.Orders,
              },
            ],
          },
          {
            navigate: '/admin/san-pham',
            title: 'Sản phẩm',
            icon: 'appstore',
            sub: true,
            sub_menu: [
              {
                sub_nav: '/admin/san-pham',
                sub_title: 'Danh sách sản phẩm',
              },
              {
                sub_nav: '/admin/thuoc-tinh-san-pham',
                sub_title: 'Thuộc tính sản phẩm',
              },
            ],
          },
          {
            navigate: '/admin/danh-gia',
            title: 'Đánh giá sản phẩm',
            icon: 'form',
            sub: false,
            notificationData: this.notification.WipReviews,
          },
          {
            navigate: '/admin/khach-hang',
            title: 'Khách hàng',
            icon: 'user',
            sub: false,
          },
          {
            navigate: '/admin/bai-viet',
            title: 'Quản lý bài viết',
            icon: 'file-text',
            sub: false,
          },
          {
            navigate: '/admin/email-dang-ky-nhan-tin',
            title: 'Email đăng ký nhận tin',
            icon: 'mail',
            sub: false,
          },
          {
            navigate: '',
            title: 'Báo cáo thống kê',
            icon: 'bar-chart',
            sub: true,
            sub_menu: [
              {
                sub_nav: '/admin/thong-ke-don-hang',
                sub_title: 'Thống kê đơn hàng',
              },
              {
                sub_nav: '/admin/bao-cao-theo-san-pham',
                sub_title: 'Báo cáo theo sản phẩm',
              },
              {
                sub_nav: '/admin/bao-cao-doanh-thu',
                sub_title: 'Báo cáo doanh thu',
              },
            ],
          },
          {
            navigate: '',
            title: 'Website',
            icon: 'global',
            sub: true,
            sub_menu: [
              {
                sub_nav: '/admin/website',
                sub_title: 'Thông tin Website',
              },
              {
                sub_nav: '/admin/menu-chinh',
                sub_title: 'Menu chính',
              },
              {
                sub_nav: '/admin/menu-phu',
                sub_title: 'Menu phụ (footer)',
              },
              {
                sub_nav: '/admin/banner',
                sub_title: 'Banner',
              },
            ],
          },
          {
            navigate: '',
            title: 'Cấu hình',
            icon: 'setting',
            sub: true,
            sub_menu: [
              {
                sub_nav: '/admin/email-template',
                sub_title: 'Mẫu email',
              },
              {
                sub_nav: '/admin/email-config',
                sub_title: 'Tài khoản gửi mail',
              },
              {
                sub_nav: '/admin/tai-khoan-quan-tri',
                sub_title: 'Tài khoản quản trị',
              },
            ],
          },
        ];
      },
      error: (err) => {
        this.messageService.error('Không thành công!');
        [
          {
            navigate: '/admin',
            title: 'Tổng quan',
            icon: 'dashboard',
            sub: false,
          },
          {
            navigate: '',
            title: 'Đơn hàng',
            icon: 'shopping-cart',
            sub: true,
            sub_menu: [
              {
                sub_nav: '/admin/don-hang/don-hang-can-xu-ly',
                sub_title: 'Đơn hàng cần xử lý',
              },
              {
                sub_nav: '/admin/don-hang',
                sub_title: 'Danh sách đơn hàng',
              },
            ],
          },
          {
            navigate: '/admin/san-pham',
            title: 'Sản phẩm',
            icon: 'appstore',
            sub: true,
            sub_menu: [
              {
                sub_nav: '/admin/san-pham',
                sub_title: 'Danh sách sản phẩm',
              },
              {
                sub_nav: '/admin/thuoc-tinh-san-pham',
                sub_title: 'Thuộc tính sản phẩm',
              },
            ],
          },
          {
            navigate: '/admin/danh-gia',
            title: 'Đánh giá sản phẩm',
            icon: 'form',
            sub: false,
          },
          {
            navigate: '/admin/khach-hang',
            title: 'Khách hàng',
            icon: 'user',
            sub: false,
          },
          {
            navigate: '/admin/bai-viet',
            title: 'Quản lý bài viết',
            icon: 'file-text',
            sub: false,
          },
          {
            navigate: '/admin/email-dang-ky-nhan-tin',
            title: 'Email đăng ký nhận tin',
            icon: 'mail',
            sub: false,
          },
          {
            navigate: '',
            title: 'Báo cáo thống kê',
            icon: 'bar-chart',
            sub: true,
            sub_menu: [
              {
                sub_nav: '/admin/thong-ke-don-hang',
                sub_title: 'Thống kê đơn hàng',
              },
              {
                sub_nav: '/admin/bao-cao-theo-san-pham',
                sub_title: 'Báo cáo theo sản phẩm',
              },
              {
                sub_nav: '/admin/bao-cao-doanh-thu',
                sub_title: 'Báo cáo doanh thu',
              },
            ],
          },
          {
            navigate: '',
            title: 'Website',
            icon: 'global',
            sub: true,
            sub_menu: [
              {
                sub_nav: '/admin/website',
                sub_title: 'Thông tin Website',
              },
              {
                sub_nav: '/admin/menu-chinh',
                sub_title: 'Menu chính',
              },
              {
                sub_nav: '/admin/menu-phu',
                sub_title: 'Menu phụ (footer)',
              },
              {
                sub_nav: '/admin/banner',
                sub_title: 'Banner',
              },
            ],
          },
          {
            navigate: '',
            title: 'Cấu hình',
            icon: 'setting',
            sub: true,
            sub_menu: [
              {
                sub_nav: '/admin/email-template',
                sub_title: 'Mẫu email',
              },
              {
                sub_nav: '/admin/email-config',
                sub_title: 'Tài khoản gửi mail',
              },
              {
                sub_nav: '/admin/tai-khoan-quan-tri',
                sub_title: 'Tài khoản quản trị',
              },
            ],
          },
        ];
      },
    });
  }

  logout() {
    this.navigate('/admin/dang-xuat');
  }

  navigate(path: string, title: string = '', sub_title: string = ''): void {
    this.ngZone.run(() => this.router.navigateByUrl(path)).then();
    if (title != '') this.title = title;
    if (sub_title != '') this.title = this.title + ' > ' + sub_title;
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { ArticleComponent } from './article/article.component';
import { AttributeComponent } from './attribute/attribute.component';
import { CustomerComponent } from './customer/customer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmailConfigurationComponent } from './email-configuration/email-configuration.component';
import { EmailRegistrationComponent } from './email-registration/email-registration.component';
import { EmailTemplateComponent } from './email-template/email-template.component';
import { GalleryComponent } from './gallery/gallery.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { MenuComponent } from './menu/menu.component';
import { OrderWipComponent } from './order/order-wip/order-wip.component';
import { OrderComponent } from './order/order.component';
import { ProductComponent } from './product/product.component';
import { ReportProductComponent } from './report/report-product/report-product.component';
import { ReportRevenueComponent } from './report/report-revenue/report-revenue.component';
import { ReportComponent } from './report/report.component';
import { ReviewComponent } from './review/review.component';
import { SubMenuComponent } from './sub-menu/sub-menu.component';
import { UserComponent } from './user/user.component';
import { WebsiteComponent } from './website/website.component';
import { OrderStatusPipe } from 'src/app/core/pipe/order-status.pipe';
import { PipeHostImagePipe } from 'src/app/core/pipe/pipe-host-image.pipe';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { ArticleDetailComponent } from './article/article-detail/article-detail.component';
import { AttributeDetailComponent } from './attribute/attribute-detail/attribute-detail.component';
import { CustomerDetailComponent } from './customer/customer-detail/customer-detail.component';
import { EmailTemplateDetailComponent } from './email-template/email-template-detail/email-template-detail.component';
import { GalleryDetailComponent } from './gallery/gallery-detail/gallery-detail.component';
import { MenuDetailComponent } from './menu/menu-detail/menu-detail.component';
import { OrderDetailComponent } from './order/order-detail/order-detail.component';
import { ReviewDetailComponent } from './review/review-detail/review-detail.component';
import { SubMenuDetailComponent } from './sub-menu/sub-menu-detail/sub-menu-detail.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';

const routes: Routes = [
  {
    path: 'dang-nhap',
    component: LoginComponent,
  },
  {
    path: 'dang-xuat',
    component: LogoutComponent,
  },
  {
    path: '',
    // component: MasterLayoutComponent,
    // canActivate: [AuthGuardAdminService],
    children: [
      {
        path: 'don-hang',
        children: [
          {
            path: 'don-hang-can-xu-ly',
            component: OrderWipComponent,
          },
          {
            path: '',
            component: OrderComponent,
          },
        ],
      },
      {
        path: 'menu-chinh',
        component: MenuComponent,
      },
      {
        path: 'menu-phu',
        component: SubMenuComponent,
      },
      {
        path: 'website',
        component: WebsiteComponent,
      },
      {
        path: 'khach-hang',
        component: CustomerComponent,
      },
      {
        path: 'email-template',
        component: EmailTemplateComponent,
      },
      {
        path: 'email-config',
        component: EmailConfigurationComponent,
      },
      {
        path: 'tai-khoan-quan-tri',
        component: UserComponent,
      },
      {
        path: 'san-pham',
        component: ProductComponent,
      },
      {
        path: 'thuoc-tinh-san-pham',
        component: AttributeComponent,
      },
      {
        path: 'banner',
        component: GalleryComponent,
      },
      {
        path: 'bai-viet',
        component: ArticleComponent,
      },
      {
        path: 'thong-ke-don-hang',
        component: ReportComponent,
      },
      {
        path: 'bao-cao-theo-san-pham',
        component: ReportProductComponent,
      },
      {
        path: 'bao-cao-doanh-thu',
        component: ReportRevenueComponent,
      },
      {
        path: 'email-dang-ky-nhan-tin',
        component: EmailRegistrationComponent,
      },
      {
        path: 'danh-gia',
        component: ReviewComponent,
      },
      {
        path: '',
        component: DashboardComponent,
      },
    ],
  },
];
@NgModule({
  declarations: [
    // ButtonUploadComponent,
    PipeHostImagePipe,
    OrderStatusPipe,
    DashboardComponent,
    ProductComponent,
    ProductDetailComponent,
    EmailTemplateComponent,
    EmailConfigurationComponent,
    UserComponent,
    UserDetailComponent,
    ReportComponent,
    ArticleComponent,
    ArticleDetailComponent,
    GalleryComponent,
    GalleryDetailComponent,
    OrderComponent,
    OrderDetailComponent,
    WebsiteComponent,
    LoginComponent,
    LogoutComponent,
    // MasterLayoutComponent,
    OrderWipComponent,
    MenuComponent,
    MenuDetailComponent,
    SubMenuComponent,
    SubMenuDetailComponent,
    AttributeComponent,
    AttributeDetailComponent,
    EmailTemplateDetailComponent,
    CustomerComponent,
    CustomerDetailComponent,
    ReportProductComponent,
    ReportRevenueComponent,
    EmailRegistrationComponent,
    ReviewComponent,
    ReviewDetailComponent,
  ],
  imports: [CommonModule],
})
export class AdminModule {}

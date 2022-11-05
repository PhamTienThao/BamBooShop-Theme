import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { RouterModule, Routes } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
// import { CurrencyMaskConfig, CurrencyMaskInputMode, NgxCurrencyModule } from "ngx-currency";
import { AuthGuardAdminService } from './auth/auth-guard-admin.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtAdminInterceptor } from './auth/jwt-admin.interceptor';
import { ErrorAdminInterceptor } from './auth/error-admin.interceptor';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductComponent } from './product/product.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { OrderComponent } from './order/order.component';
import { ArticleComponent } from './article/article.component';
import { EmailConfigurationComponent } from './email-configuration/email-configuration.component';
import { UserComponent } from './user/user.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { ReportComponent } from './report/report.component';
import { GalleryComponent } from './gallery/gallery.component';
import { GalleryDetailComponent } from './gallery/gallery-detail/gallery-detail.component';
import { OrderDetailComponent } from './order/order-detail/order-detail.component';
import { WebsiteComponent } from './website/website.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { MasterLayoutComponent } from './layout/master-layout.component';
import { OrderWipComponent } from './order/order-wip/order-wip.component';
import { MenuComponent } from './menu/menu.component';
import { MenuDetailComponent } from './menu/menu-detail/menu-detail.component';
import { SubMenuComponent } from './sub-menu/sub-menu.component';
import { SubMenuDetailComponent } from './sub-menu/sub-menu-detail/sub-menu-detail.component';
import { PipeHostImagePipe } from 'src/app/core/pipe/pipe-host-image.pipe';
import { AttributeComponent } from './attribute/attribute.component';
import { ButtonUploadComponent } from 'src/app/components/button-upload/button-upload.component';
import { DENgZorroAntdModule } from 'src/app/ng-zorro-antd.module';
// import { GoogleChartsModule } from 'angular-google-charts';
import { CustomerComponent } from './customer/customer.component';
import { OrderStatusPipe } from 'src/app/core/pipe/order-status.pipe';
import { ReportProductComponent } from './report/report-product/report-product.component';
import { ReportRevenueComponent } from './report/report-revenue/report-revenue.component';
import { ReviewComponent } from './review/review.component';
import { ReviewDetailComponent } from './review/review-detail/review-detail.component';
import { EmailTemplateComponent } from './email-template/email-template.component';
import { AttributeDetailComponent } from './attribute/attribute-detail/attribute-detail.component';
import { EmailTemplateDetailComponent } from './email-template/email-template-detail/email-template-detail.component';
import { CustomerDetailComponent } from './customer/customer-detail/customer-detail.component';
import { EmailRegistrationComponent } from './email-registration/email-registration.component';
import { ArticleDetailComponent } from './article/article-detail/article-detail.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgChartjsModule } from 'ng-chartjs';
import { NgxEchartsModule } from 'ngx-echarts';
import { TableTemplateComponent } from 'src/app/components/table-template/table-template.component';
import { SharedModule } from 'src/app/components/share-module';
registerLocaleData(en);

// export const customCurrencyMaskConfig: CurrencyMaskConfig = {
//   align: "right",
//   allowNegative: true,
//   allowZero: true,
//   decimal: ".",
//   precision: 0,
//   prefix: "",
//   suffix: "",
//   thousands: ",",
//   nullable: true,
//   inputMode: CurrencyMaskInputMode.NATURAL,
// };

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
    component: MasterLayoutComponent,
    canActivate: [AuthGuardAdminService],
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
        path: 'table',
        component: TableTemplateComponent,
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
    ButtonUploadComponent,
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
    MasterLayoutComponent,
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
  imports: [
    SharedModule,
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    DENgZorroAntdModule,
    AngularEditorModule,
    NgChartjsModule,
    NgxEchartsModule.forRoot({
      /**
       * This will import all modules from echarts.
       * If you only need custom modules,
       * please refer to [Custom Build] section.
       */
      echarts: () => import('echarts'), // or import('./path-to-my-custom-echarts')
    }),
  ],
  providers: [
    AuthGuardAdminService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtAdminInterceptor, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorAdminInterceptor,
      multi: true,
    },
    { provide: NZ_I18N, useValue: en_US },
  ],
})
export class AdminModule {}

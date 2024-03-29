import { EmptyCardComponent } from './containers/client/empty-card/empty-card.component';
import { ArticleCategoryComponent } from './containers/client/article-category/article-category.component';
import { LoginComponent } from './containers/client/login/login.component';
import { ProfileComponent } from './containers/client/profile/profile.component';
import { CartComponent } from './containers/client/cart/cart.component';
import { CategoryComponent } from './containers/client/category/category.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductTemplateComponent } from './components/product-template/product-template.component';
import { HomeComponent } from './containers/client/home/home.component';
import { LayoutComponent } from './containers/client/layout/layout.component';
import { PageNotFoundComponent } from './containers/client/page-not-found/page-not-found.component';
import { ProductDetailComponent } from './containers/client/product-detail/product-detail.component';
import { ArticleComponent } from './containers/client/article/article.component';
import { AuthGuardService } from './containers/client/auth/auth-guard.service';
import { SignUpComponent } from './containers/client/sign-up/sign-up.component';
import { LogoutComponent } from './containers/client/logout/logout.component';
import { ForgotPasswordComponent } from './containers/client/forgot-password/forgot-password.component';
import { OrderSuccessfulComponent } from './containers/client/order-successful/order-successful.component';
import { SearchComponent } from './containers/client/search/search.component';
import { ArticleExtComponent } from './containers/client/article-ext/article-ext.component';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./containers/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'tai-khoan',
        canActivate: [AuthGuardService],
        component: ProfileComponent,
      },
      {
        path: 'dang-nhap',
        component: LoginComponent,
      },
      {
        path: 'dang-ky',
        component: SignUpComponent,
      },
      {
        path: 'dang-xuat',
        component: LogoutComponent,
      },
      // {
      //   path: "quen-mat-khau",
      //   canActivate: [AuthGuardService],
      //   component: ForgotPasswordComponent
      // },
      {
        path: 'gio-hang',
        canActivate: [AuthGuardService],
        component: CartComponent,
      },
      {
        path: 'dat-hang-thanh-cong',
        canActivate: [AuthGuardService],
        component: OrderSuccessfulComponent,
      },
      {
        path: 'not-found',
        component: PageNotFoundComponent,
      },
      {
        path: 'danh-sach-bai-viet',
        component: ArticleCategoryComponent,
      },
      {
        path: 'quen-mat-khau',
        component: ForgotPasswordComponent,
      },
      {
        path: 'bai-viet',
        component: ArticleComponent,
      },
      {
        path: 'gio-hang-trong',
        component: EmptyCardComponent,
      },
      {
        path: 'danh-muc-bai-viet',
        component: ArticleCategoryComponent,
      },
      {
        path: 'tim-kiem/:alias',
        component: SearchComponent,
      },
      {
        path: 'danh-muc-bai-viet/:alias',
        component: ArticleCategoryComponent,
      },
      {
        path: 'bai-viet/:alias',
        component: ArticleComponent,
      },
      {
        path: 'thong-tin/:alias',
        component: ArticleExtComponent,
      },
      {
        path: 'san-pham/:alias', //:alias
        component: ProductDetailComponent,
      },
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: ':alias',
        component: CategoryComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

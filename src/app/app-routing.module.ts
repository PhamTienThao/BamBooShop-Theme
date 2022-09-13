import { ThankYouPageComponent } from './containers/client/thank-you-page/thank-you-page.component';
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

const routes: Routes = [
  //   {
  // //   path: "admin",
  // //   loadChildren: () => import('./containers/admin/admin.module').then(m => m.AdminModule),
  // // },
  {
    path: "",
    component: LayoutComponent,
    children: [
      //     {
      //       path: "profile",
      //       canActivate: [AuthGuardService],
      //       component: ProfileComponent
      //     },
      {
        path: "dang-nhap",
        component: LoginComponent
      },
      //     {
      //       path: "dang-ky-tai-khoan",
      //       component: SignUpComponent
      //     },
      //     {
      //       path: "dang-xuat",
      //       component: LogoutComponent
      //     },
      //     {
      //       path: "quen-mat-khau",
      //       component: ForgotPasswordComponent
      //     },
      //     {
      //       path: "gio-hang",
      //       canActivate: [AuthGuardService],
      //       component: CartComponent
      //     },
      //     {
      //       path: "dat-hang-thanh-cong",
      //       canActivate: [AuthGuardService],
      //       component: OrderSuccessfulComponent
      //     },

      {
        path: "danh-muc-bai-viet",
        component: ArticleCategoryComponent
      },

      //     {
      //       path: "thong-tin/:alias",
      //       component: ArticleExtComponent
      //     },

      {
        path: "not-found",
        component: PageNotFoundComponent
      },
      {
        path: "gio-hang",
        component: CartComponent
      },
      {
        path: "tai-khoan",
        component: ProfileComponent
      },
      {
        path: "danh-sach-bai-viet",
        component: ArticleCategoryComponent
      },
      {
        path: "bai-viet",
        component: ArticleComponent
      },
      {
        path: "gio-hang-trong",
        component: EmptyCardComponent
      },
      {
        path: "dat-hang-thanh-cong",
        component: ThankYouPageComponent
      },


      //     {
      //       path: "tim-kiem/:alias",
      //       component: SearchComponent
      //     },
      {
        path: "san-pham/:alias", //:alias
        component: ProductDetailComponent
      },
      {
        path: "bai-viet/:alias",
        component: ArticleComponent
      },
      {
        path: "danh-muc-bai-viet/:alias",
        component: ArticleCategoryComponent
      },
      {
        path: ":alias",
        component: CategoryComponent
      },
      {
        path: "",
        component: HomeComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

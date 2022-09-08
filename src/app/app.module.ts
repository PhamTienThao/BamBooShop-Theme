import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductTemplateComponent } from './components/product-template/product-template.component';
import { ArticleComponent } from './containers/client/article/article.component';
import { ArticleCategoryComponent } from './containers/client/article-category/article-category.component';
import { AuthComponent } from './containers/client/auth/auth.component';
import { CartComponent } from './containers/client/cart/cart.component';
import { CategoryComponent } from './containers/client/category/category.component';
import { ForgotPasswordComponent } from './containers/client/forgot-password/forgot-password.component';
import { HomeComponent } from './containers/client/home/home.component';
import { LayoutComponent } from './containers/client/layout/layout.component';
import { LoginComponent } from './containers/client/login/login.component';
import { LogoutComponent } from './containers/client/logout/logout.component';
import { OrderSuccessfulComponent } from './containers/client/order-successful/order-successful.component';
import { PageNotFoundComponent } from './containers/client/page-not-found/page-not-found.component';
import { ProductDetailComponent } from './containers/client/product-detail/product-detail.component';
import { ProfileComponent } from './containers/client/profile/profile.component';
import { SearchComponent } from './containers/client/search/search.component';
import { SignUpComponent } from './containers/client/sign-up/sign-up.component';
import { EmptyCardComponent } from './containers/client/empty-card/empty-card.component';
import { ThankYouPageComponent } from './containers/client/thank-you-page/thank-you-page.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductTemplateComponent,
    ArticleComponent,
    ArticleCategoryComponent,
    AuthComponent,
    CartComponent,
    CategoryComponent,
    ForgotPasswordComponent,
    HomeComponent,
    LayoutComponent,
    LoginComponent,
    LogoutComponent,
    OrderSuccessfulComponent,
    PageNotFoundComponent,
    ProductDetailComponent,
    ProfileComponent,
    SearchComponent,
    SignUpComponent,
    EmptyCardComponent,
    ThankYouPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

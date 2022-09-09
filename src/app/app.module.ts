import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
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
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocialAuthServiceConfig, SocialAuthService, FacebookLoginProvider, SocialLoginModule, GoogleLoginProvider } from 'angularx-social-login';
import { AuthGuardService } from './containers/client/auth/auth-guard.service';
import { ErrorInterceptor } from './containers/client/auth/error.interceptor';
import { JwtInterceptor } from './containers/client/auth/jwt.interceptor';
import { HostImageClientPipe } from './core/pipe/host-image-client.pipe';
import { SafePipe } from './core/pipe/safe.pipe';
import { OrderStatusPipe } from './core/pipe/order-status.pipe';
import { PipeHostImagePipe } from './core/pipe/pipe-host-image.pipe';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';

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
    ThankYouPageComponent,
    HostImageClientPipe,
    SafePipe,
    PipeHostImagePipe,
    OrderStatusPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SocialLoginModule,
    NzMessageModule
  ],
  providers: [
    AuthGuardService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: NZ_I18N, useValue: en_US },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: { 
          autoLogin: false, 
          providers: [
              {
                id:GoogleLoginProvider.PROVIDER_ID,
                provider:new GoogleLoginProvider(
                  '251499186409-9rhhvhr9o1jgnrj4luf7gcro2q5l26r6.apps.googleusercontent.com',
                  {
                    scope: 'email',
                    plugin_name: 'login-app'
                  })
              },
              {
                id:FacebookLoginProvider.PROVIDER_ID,
                provider:new FacebookLoginProvider('601671584841160')
              },
            ],
          onError: (err) => {
            console.log(err);
          }
        } as SocialAuthServiceConfig
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

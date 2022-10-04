import { CarouselModule } from './components/carousel/carousel.module';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatStepperModule } from '@angular/material/stepper';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { ProductTemplateComponent } from './components/product-template/product-template.component';
import { ArticleComponent } from './containers/client/article/article.component';
import { ArticleCategoryComponent } from './containers/client/article-category/article-category.component';
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
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  SocialAuthServiceConfig,
  SocialAuthService,
  FacebookLoginProvider,
  SocialLoginModule,
  GoogleLoginProvider,
} from 'angularx-social-login';
import { AuthGuardService } from './containers/client/auth/auth-guard.service';
import { ErrorInterceptor } from './containers/client/auth/error.interceptor';
import { JwtInterceptor } from './containers/client/auth/jwt.interceptor';
import { HostImageClientPipe } from './core/pipe/host-image-client.pipe';
import { SafePipe } from './core/pipe/safe.pipe';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { ArticleTemplateComponent } from './components/article-template/article-template.component';
import { ArticleTemplateHorizontalComponent } from './components/article-template-horizontal/article-template-horizontal.component';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { ArticleExtComponent } from './containers/client/article-ext/article-ext.component';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { OrderTemplateComponent } from './components/order-template/order-template.component';
import { OrderTableComponent } from './components/order-table/order-table.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RatingComponent } from './components/rating/rating.component';
import { ProductTemplateListComponent } from './components/product-template-list/product-template-list.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductTemplateComponent,
    ArticleComponent,
    ArticleCategoryComponent,
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
    HostImageClientPipe,
    SafePipe,
    // PipeHostImagePipe,
    // OrderStatusPipe,
    ArticleTemplateComponent,
    ArticleTemplateHorizontalComponent,
    ArticleExtComponent,
    OrderTemplateComponent,
    OrderTableComponent,
    CategoryComponent,
    RatingComponent,
    ProductTemplateListComponent,
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
    NzMessageModule,
    NzTabsModule,
    MatRadioModule,
    NgxSpinnerModule,
    MatDialogModule,
    NgbModule,
    NzFormModule,
    NzStepsModule,
    MatStepperModule,
    CarouselModule,
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
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '251499186409-9rhhvhr9o1jgnrj4luf7gcro2q5l26r6.apps.googleusercontent.com',
              {
                scope: 'email',
                plugin_name: 'login-app',
              }
            ),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('601671584841160'),
          },
        ],
        onError: (err) => {},
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [OrderTemplateComponent],
})
export class AppModule {}

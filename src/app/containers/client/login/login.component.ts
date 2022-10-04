import { Component, NgZone, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialAuthService, GoogleLoginProvider } from 'angularx-social-login';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CustomerService } from 'src/app/core/service/customer.service';
import { AuthenticationService } from '../auth/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  formData!: FormGroup;
  submitted: boolean = false;
  isSocialNetworkLogin: boolean = false;
  user: any;
  constructor(
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private messageService: NzMessageService,
    private ngZone: NgZone,
    private router: Router,
    private socialLoginAuthService: SocialAuthService,
    private customerService: CustomerService
  ) { }

  ngOnInit() {
    this.formData = this.formBuilder.group({
      Email: [null, [Validators.email, Validators.required]],
      Password: [null, [Validators.required, Validators.minLength(5)]],
      Remember: [false],
    });
  }

  onSubmit() {
    for (const i in this.formData.controls) {
      if (this.formData.controls.hasOwnProperty(i)) {
        this.formData.controls[i].markAsDirty();
        this.formData.controls[i].updateValueAndValidity();
      }
    }
    if (this.formData.invalid) {
      return;
    }

    this.authenticationService.login(this.formData.getRawValue()).subscribe({
      next: (resp: any) => {
        // this.messageService.success("Đăng nhập thành công");
        this.navigate('/');
      },
      error: (err: any) => {
        this.messageService.error(err.error.message);
      },
    });
  }

  navigate(path: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(path)).then();
  }
  loginWithGoogle(): void {
    this.socialLoginAuthService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(
        (data) => {
          this.user = {
            email: data.email,
            fullName: data.firstName + ' ' + data.lastName,
            avatar: data.photoUrl,
            authToken: data.authToken,
            idToken: data.idToken,
          };
          this.customerService
            .loginWithSocialNetwork(this.user)
            .subscribe({
              next: (resp: any) => {
                // this.messageService.success("Đăng nhập thành công");
                this.navigate('/tai-khoan');
              },
              error: (err: any) => {
                this.messageService.error(err.error.message);
              }
            });
        },
        (error) => console.log(error)
      )
      .catch((data) => console.log(data));
  }
  logoutGoogle(): void {
    this.socialLoginAuthService.signOut();
    this.router.navigateByUrl('/dang-xuat');

  }
}

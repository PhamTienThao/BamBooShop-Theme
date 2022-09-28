import {
  AfterViewInit,
  Component,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize } from 'rxjs/operators';
import { CustomerService } from 'src/app/core/service/customer.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit, AfterViewInit {
  @ViewChild('myStepper') myStepper!: MatStepper;

  formMail!: FormGroup;
  formOTP!: FormGroup;
  formData!: FormGroup;

  constructor(
    private customerService: CustomerService,
    private messageService: NzMessageService,
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formMail = this.formBuilder.group({
      Email: ['', [Validators.email, Validators.required]],
    });
    this.formOTP = this.formBuilder.group({
      OTP: ['', Validators.required],
    });
    this.formData = this.formBuilder.group({
      Email: [
        { value: '', disabled: true },
        [Validators.email, Validators.required],
      ],
      OTP: [{ value: '', disabled: true }, Validators.required],
      Password: [null, [Validators.required, Validators.minLength(5)]],
      RePassword: [null, [Validators.required, Validators.minLength(5)]],
      FullName: [null, Validators.required],
      PhoneNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(
            '^\\s*(?:\\+?(\\d{1,3}))?[-. (]*(\\d{3})[-. )]*(\\d{3})[-. ]*(\\d{4})(?: *x(\\d+))?\\s*$'
          ),
        ],
      ],
    });
  }
  ngAfterViewInit() {}
  requestOTP() {
    for (const i in this.formMail.controls) {
      if (this.formMail.controls.hasOwnProperty(i)) {
        this.formMail.controls[i].markAsDirty();
        this.formMail.controls[i].updateValueAndValidity();
      }
    }
    if (this.formMail.invalid) {
      return;
    }

    this.customerService
      .requestOTP(this.formMail.getRawValue().Email)
      .subscribe({
        next: (resp: any) => {
          this.messageService.success('OTP Has been sent to your email.');
          this.myStepper.next();
        },
        error: (err: any) => {
          this.messageService.error(err.error.message);
        },
      });
  }

  confirmOTP() {
    for (const i in this.formOTP.controls) {
      if (this.formOTP.controls.hasOwnProperty(i)) {
        this.formOTP.controls[i].markAsDirty();
        this.formOTP.controls[i].updateValueAndValidity();
      }
    }
    if (this.formOTP.invalid) {
      return;
    }

    const email = this.formMail.getRawValue().Email;
    const otp = this.formOTP.getRawValue().OTP;
    this.customerService.confirmOTP(email, otp).subscribe({
      next: (resp: any) => {
        let data: boolean = JSON.parse(resp['data']);
        if (data == true) {
          this.myStepper.next();
          this.formData.patchValue({
            Email: email,
            OTP: otp,
          });
        } else {
          this.messageService.error('Wrong OTP.');
        }
      },
      error: (err: any) => {
        this.messageService.error(err.error.message);
      },
    });
  }

  onSubmit(): void {
    for (const i in this.formData.controls) {
      if (this.formData.controls.hasOwnProperty(i)) {
        this.formData.controls[i].markAsDirty();
        this.formData.controls[i].updateValueAndValidity();
      }
    }
    if (this.formData.invalid) {
      return;
    }
    if (this.formData.value.Password != this.formData.value.RePassword) {
      return;
    }
    this.customerService
      .post({
        Email: this.formData.get('Email')?.value,
        OTP: this.formData.get('OTP')?.value,
        Password: this.formData.value.Password,
        FullName: this.formData.value.FullName,
        PhoneNumber: this.formData.value.PhoneNumber,
      })
      .subscribe({
        next: (resp: any) => {
          this.messageService.success('Sign in successfully');
          this.navigate('/dang-nhap');
        },
        error: (err: any) => {
          this.messageService.error(err.error.message);
        },
      });
  }

  navigate(path: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(path)).then();
  }
}

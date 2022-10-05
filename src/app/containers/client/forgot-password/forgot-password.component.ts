import { Component, NgZone, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { CustomerService } from 'src/app/core/service/customer.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  formData!: FormGroup;

  constructor(
    private customerService: CustomerService,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      Email: [null, [Validators.email, Validators.required]],
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

    this.customerService
      .forgotPassword(this.formData.getRawValue().Email)
      .subscribe({
        next: (resp: any) => {
          this.toastrService.success('Request completed. Please check your email.',"",{positionClass :'toast-bottom-right'});
        },
        error: (err: any) => {
          this.toastrService.error(err.error.message,"",{positionClass :'toast-bottom-right'});
        },
      });
  }

  navigate(path: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(path)).then();
  }
}

import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize } from 'rxjs';
import { Customer } from 'src/app/core/model/customer';
import { Order } from 'src/app/core/model/order';
import { CustomerService } from 'src/app/core/service/customer.service';
import { Constants } from 'src/app/core/util/constants';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  formData!: FormGroup;
  formChangePassword!: FormGroup;
  profile!: Customer;
  orders: Order[] = [];
  isConfirmPasswordRight: boolean = true;
  constructor(
    private customerService: CustomerService,
    private messageService: NzMessageService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.formData = this.formBuilder.group({
      Code: [{ value: '', disabled: true }, Validators.required],
      Email: [{ value: '', disabled: true }, Validators.required],
      FullName: [null, Validators.required],
      PhoneNumber: [null, Validators.required],
      Address: [null, Validators.required],
      Dob: [null],
      Gender: [null],
      timePicker: [null]
    });
    this.formChangePassword = this.formBuilder.group({
      OldPassword: [null, Validators.required],
      NewPassword: [null, [Validators.required, Validators.minLength(5)]],
      ConfirmPassword: [null, [Validators.required, Validators.minLength(5)]],
    });
    this.getProfile();
    this.getOrders();
  }

  getProfile() {
    this.customerService.getProfile()
      .subscribe({
        next: (resp: any) => {
          this.profile = JSON.parse(resp["data"]);
          this.profile.Dob = moment(new Date(this.profile.Dob)).format("YYYY-MM-DD")
          this.formData.patchValue(this.profile)
        }, error: (err: any) => {

        }
      })
  }

  getOrders() {
    this.customerService.getOrders()
      .subscribe({
        next: (resp: any) => {
          this.orders = JSON.parse(resp["data"]);
        }, error: (err: any) => {

        }
      })
  }

  filterOrderByStatus(status: number): Order[] {
    return this.orders.filter(x => x.Status == status);
  }

  submitForm(): void {
    for (const i in this.formData.controls) {
      if (this.formData.controls.hasOwnProperty(i)) {
        this.formData.controls[i].markAsDirty();
        this.formData.controls[i].updateValueAndValidity();
      }
    }
    if (this.formData.invalid) {
      return;
    }

    let dataPost = this.formData.getRawValue();
    if (dataPost.Dob != null)
      dataPost.Dob = moment(new Date(dataPost.Dob)).format("YYYY-MM-DD")

    this.customerService.updateProfile(dataPost)
      .subscribe({
        next: (resp: any) => {
          this.messageService.success("Update Done");
          this.getProfile();
        }, error: (err: any) => {
          this.messageService.error(err.error.message);
        }
      })
  }

  submitChangePassword(): void {
    for (const i in this.formChangePassword.controls) {
      if (this.formChangePassword.controls.hasOwnProperty(i)) {
        this.formChangePassword.controls[i].markAsDirty();
        this.formChangePassword.controls[i].updateValueAndValidity();
      }
    }
    if (this.formChangePassword.invalid) {
      return;
    }

    const dataPost = this.formChangePassword.getRawValue();
    if(dataPost["NewPassword"] != dataPost["ConfirmPassword"]) return;
    this.customerService.changePassword(dataPost["OldPassword"], dataPost["NewPassword"])
      .subscribe({
        next: (resp: any) => {
          this.messageService.success("Update Done");
          this.formChangePassword.reset();
        }, error: (err: any) => {
          this.messageService.error(err.error.message);
        }
      })
  }
  rePasswordChange(){
    if(this.formChangePassword.get('NewPassword')?.value == this.formChangePassword.get('ConfirmPassword')?.value)
      this.isConfirmPasswordRight = true;
    else this.isConfirmPasswordRight = false;
  }
}

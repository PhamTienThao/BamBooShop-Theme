import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { EmailConfiguration } from 'src/app/core/model/email-configuration';
import { EmailConfigurationService } from 'src/app/core/service/email-configuration.service';

@Component({
  selector: 'app-email-configuration',
  templateUrl: './email-configuration.component.html',
  styleUrls: ['./email-configuration.component.css'],
})
export class EmailConfigurationComponent implements OnInit {
  formData!: FormGroup;
  passwordVisible: boolean = false;

  constructor(
    private emailConfigurationService: EmailConfigurationService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private messageService: NzMessageService
  ) {}

  ngOnInit() {
    this.initForm();
    this.getData();
  }

  initForm() {
    this.formData = this.formBuilder.group({
      Id: [0],
      Email: ['', Validators.required],
      Password: ['', Validators.required],
    });
  }

  getData() {
    this.spinner.show();
    this.emailConfigurationService
      .get({})
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe({
        next: (resp: any) => {
          let config: EmailConfiguration = JSON.parse(resp['data']);
          this.formData.patchValue(config);
        },
        error: (err) => {
          this.messageService.error('Không thành công!');
        },
      });
  }

  submit() {
    for (const i in this.formData.controls) {
      if (this.formData.controls.hasOwnProperty(i)) {
        this.formData.controls[i].markAsDirty();
        this.formData.controls[i].updateValueAndValidity();
      }
    }
    if (this.formData.invalid) {
      return;
    }

    this.spinner.show();
    let config: EmailConfiguration = this.formData.getRawValue();
    this.emailConfigurationService
      .put(config.Id, config)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe({
        next: (resp: any) => {
          this.messageService.success('Cập nhật thành công');
          this.getData();
        },
        error: (err) => {
          this.messageService.error('Không thành công!');
        },
      });
  }
}

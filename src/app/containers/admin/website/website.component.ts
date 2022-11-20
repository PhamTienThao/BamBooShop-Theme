import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { Website } from 'src/app/core/model/website';
import { WebsiteService } from 'src/app/core/service/website.service';

@Component({
  selector: 'app-website',
  templateUrl: './website.component.html',
  styleUrls: ['./website.component.css'],
})
export class WebsiteComponent implements OnInit {
  formData!: FormGroup;
  srcLogo: string = 'no_img.jpg';
  srcCloudLogo: string = '';

  constructor(
    private websiteService: WebsiteService,
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
      Name: ['', Validators.required],
      Logo: [this.srcLogo],
      PhoneNumber: [''],
      Fax: [''],
      Email: [''],
      Address: [''],
      Location: [''],
      Facebook: [''],
      Youtube: [''],
      Copyright: [''],
      LogoCloudLink: [{ value: '', disabled: true }],
    });
  }

  getData() {
    this.spinner.show();
    this.websiteService
      .get({})
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe({
        next: (resp: any) => {
          let website: Website = JSON.parse(resp['data']);
          this.srcLogo = website.Logo;
          this.srcCloudLogo = website.ImageCloudLink;
          if (this.srcCloudLogo != null && this.srcCloudLogo.length > 0)
            this.srcLogo = this.srcCloudLogo;
          this.formData.patchValue(website);
        },
        error: (err) => {
          this.messageService.error(err);
        },
      });
  }

  onloadLogo(src: string) {
    this.srcLogo = src;
    this.formData.get('Logo')?.setValue(src);
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
    let website: Website = this.formData.getRawValue();
    this.websiteService
      .put(website.Id, website)
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
          this.messageService.error(err);
        },
      });
  }
}

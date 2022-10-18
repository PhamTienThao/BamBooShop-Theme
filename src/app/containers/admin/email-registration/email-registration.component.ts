import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { EmailRegistrationService } from 'src/app/core/service/email-registration.service';

@Component({
  selector: 'app-email-registration',
  templateUrl: './email-registration.component.html',
  styleUrls: ['./email-registration.component.css'],
})
export class EmailRegistrationComponent implements OnInit {
  datas: { Email: string; Created: Date }[] = [];

  filter = {
    keySearch: '',
  };

  constructor(
    private emailRegistrationService: EmailRegistrationService,
    private spinner: NgxSpinnerService,
    private messageService: NzMessageService
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.spinner.show();
    this.emailRegistrationService
      .get(this.filter)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe({
        next: (resp: any) => {
          this.datas = JSON.parse(resp['data']);
        },
        error: (err) => {
          this.messageService.error(err);
        },
      });
  }
}

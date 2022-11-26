import { Component, OnInit, ViewChild } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { EmailTemplate } from 'src/app/core/model/email-template';
import { EmailTemplateService } from 'src/app/core/service/email-template.service';
import { EmailTemplateDetailComponent } from './email-template-detail/email-template-detail.component';

@Component({
  selector: 'app-email-template',
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.css'],
})
export class EmailTemplateComponent implements OnInit {
  @ViewChild('frmDetail', { static: true })
  frmDetail!: EmailTemplateDetailComponent;

  datas: EmailTemplate[] = [];
  dataColumns: any[] = [];
  filterDatas: EmailTemplate[] = [];
  filter = {
    keySearch: '',
  };

  constructor(
    private emailTemplateService: EmailTemplateService,
    private spinner: NgxSpinnerService,
    private messageService: NzMessageService
  ) {}

  ngOnInit() {
    this.getData();
    this.tableInit();
  }

  getData() {
    this.spinner.show();
    this.emailTemplateService
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

  showDetail(emailTemplate: EmailTemplate) {
    this.spinner.show();
    this.emailTemplateService
      .getById(emailTemplate.Id)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe({
        next: (resp: any) => {
          this.frmDetail.visible = true;
          this.frmDetail.setForm(JSON.parse(resp['data']));
        },
        error: (err) => {
          this.messageService.error(err);
        },
      });
  }
  tableInit() {
    this.dataColumns = [
      {
        name: 'Mẫu gửi Email',
        prop: 'Type',
        type: 'text',
        sortFn: (a: any, b: any) => a.Type.localeCompare(b.Type),
      },
      {
        name: 'Subject',
        prop: 'Subject',
        type: 'text',
        sortFn: (a: any, b: any) => a.Subject.localeCompare(b.Subject),
      },
    ];
  }
  onSubmit(emailTemplate: EmailTemplate) {
    this.spinner.show();
    this.emailTemplateService
      .put(emailTemplate.Id, emailTemplate)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe({
        next: (resp: any) => {
          this.messageService.success('Cập nhật thành công');
          this.frmDetail.visible = false;
          this.getData();
        },
        error: (err) => {
          this.messageService.error(err);
        },
      });
  }
}

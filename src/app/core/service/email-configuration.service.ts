import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppRoutingApi } from 'src/app/app-routing-api';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class EmailConfigurationService extends BaseService {
  constructor(public override http: HttpClient) {
    super(http, AppRoutingApi.EmailConfiguration.Router_Prefix);
  }

}

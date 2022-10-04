import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AppRoutingApi } from 'src/app/app-routing-api';
import { Constants } from '../util/constants';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseService {
  constructor(public override http: HttpClient) {
    super(http, AppRoutingApi.Customer.Router_Prefix);
  }

  requestOTP(email: string) {
    return this.http.get(this.routerPrefix + "/request-otp", {
      params: {
        email
      }
    })
  }

  confirmOTP(email: string, otp: string) {
    return this.http.get(this.routerPrefix + "/confirm-otp", {
      params: {
        email,
        otp
      }
    })
  }

  forgotPassword(email: string) {
    return this.http.get(this.routerPrefix + "/forgot-password", {
      params: {
        email
      }
    })
  }

  getProfile() {
    return this.http.get(this.routerPrefix + "/get-profile");
  }

  updateProfile(entity: any) {
    return this.http.put(this.routerPrefix + "/update-profile", entity);
  }

  getOrders() {
    return this.http.get(this.routerPrefix + "/get-orders");
  }

  changePassword(oldPassword: string, newPassword: string) {
    return this.http.get(this.routerPrefix + "/change-password", {
      params: {
        oldPassword,
        newPassword
      }
    });
  }

  signInWithSocialNetwork(entity: any) {
    return this.http.post(this.routerPrefix + "/socialNetwork-signIn", entity)
  }
  loginWithSocialNetwork(entity: any) {
    return this.http.post(this.routerPrefix + "/socialNetwork-login", entity).pipe(
      map((resp: any) => {
        localStorage.setItem(Constants.LOCAL_STORAGE_KEY.SESSION, resp["data"]);
        localStorage.setItem(Constants.LOCAL_STORAGE_KEY.TOKEN, JSON.parse(resp["data"])["Token"]);
        localStorage.setItem(Constants.LOCAL_STORAGE_KEY.SOCIAL_LOGIN, "true");
        return resp;
      })
    );
  }
}

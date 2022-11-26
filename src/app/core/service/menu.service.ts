import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppRoutingApi } from 'src/app/app-routing-api';
import { Menu } from '../model/menu';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class MenuService extends BaseService {
  private _menus = new BehaviorSubject<Menu[]>([]);
  private dataStore: { menus: any } = { menus: [] };
  readonly menus = this._menus.asObservable();

  constructor(public override http: HttpClient) {
    super(http, AppRoutingApi.Menu.Router_Prefix);
  }

  getMainMenu(filter: {}) {
    return this.http.get(this.routerPrefix + '/get-main-menu', {
      params: filter,
    });
  }

  getSubMenu(filter: {}) {
    return this.http.get(this.routerPrefix + '/get-sub-menu', {
      params: filter,
    });
  }

  getParentMainMenu() {
    return this.http.get(this.routerPrefix + '/get-parent-main-menu');
  }

  getParentSubMenu() {
    return this.http.get(this.routerPrefix + '/get-parent-sub-menu');
  }

  getMainMenuActive() {
    return this.http.get(this.routerPrefix + '/get-main-menu-active');
  }

  getSubMenuActive() {
    return this.http.get(this.routerPrefix + '/get-sub-menu-active');
  }

  getAllMenuHomePage() {
    return this.http.get(this.routerPrefix + '/get-all-menu-homepage');
  }

  getByType(types: string[]) {
    return this.http.get(this.routerPrefix + '/get-by-type', {
      params: {
        types,
      },
    });
  }
  getByTypeMenu(types: string[]) {
    return this.http
      .get(this.routerPrefix + '/get-by-type', { params: { types } })
      .subscribe((data) => {
        this.dataStore.menus = data;
        this._menus.next(Object.assign({}, this.dataStore).menus);
      });
  }
  loadAllProductMenu(): Observable<any[]> {
    return this.http.get<any[]>(this.routerPrefix + '/get-all-product-menu');
  }
  deleteByListId(listId: number[]) {
    return this.http.get(this.routerPrefix + '/delete-by-list-id-menu', {
      params: {
        listId,
      },
    });
  }
}

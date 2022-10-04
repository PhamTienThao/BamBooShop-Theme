import { Component, EventEmitter, NgZone, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Gallery } from 'src/app/core/model/gallery';
import { Menu } from 'src/app/core/model/menu';
import { Website } from 'src/app/core/model/website';
import { CartService } from 'src/app/core/service/cart.service';
import { EmailRegistrationService } from 'src/app/core/service/email-registration.service';
import { GalleryService } from 'src/app/core/service/gallery.service';
import { MenuService } from 'src/app/core/service/menu.service';
import { WebsiteService } from 'src/app/core/service/website.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  menuStatus: boolean = false;
  displaySubMenu: string = 'none';
  subMenuStatus: boolean = false;
  formRegistration!: FormGroup;
  website: Website = {
    Id: 0,
    Name: '',
    Logo: '',
    PhoneNumber: '',
    Fax: '',
    Email: '',
    Address: '',
    Location: '',
    Facebook: '',
    Youtube: '',
    Copyright: '',
  };
  mainMenus: Menu[] = [];
  subMenus: Menu[] = [];
  subBanner: Gallery[] = [];
  keySearch: string = '';

  constructor(
    private websiteService: WebsiteService,
    private galleryService: GalleryService,
    private emailRegistrationService: EmailRegistrationService,
    private menuService: MenuService,
    private cartService: CartService,
    private messageService: NzMessageService,
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private router: Router
  ) {}

  ngOnInit() {
    this.formRegistration = this.formBuilder.group({
      Email: [null, [Validators.email, Validators.required]],
    });

    this.getWebsiteInfo();
    this.getMainMenuActive();
    this.getSubMenuActive();
    this.getBanner();
  }
  // subMenu() {
  //   if (this.displaySubMenu == 'none') {
  //     this.displaySubMenu = 'inline-grid';
  //     this.subMenuStatus = true;
  //   } else {
  //     this.displaySubMenu = 'none';
  //     this.subMenuStatus = false;
  //   }
  // }

  openSideNav() {
    this.menuStatus = true;
  }
  closeSideNav() {
    this.menuStatus = false;
  }
  openSubMenu(menuAlias: string) {
    let a  = document.getElementById(menuAlias);
    if(a!=null)
      {
        if(a.style.display == 'none') a.style.display = 'inline-grid';
        else a.style.display = 'none'
      }
  }
  getWebsiteInfo() {
    this.websiteService.get({}).subscribe({
      next: (resp: any) => {
        this.website = JSON.parse(resp['data']);
      },
      error: (err: any) => {
        this.messageService.error('Error loading Website information');
      },
    });
  }

  getMainMenuActive() {
    this.menuService.getMainMenuActive().subscribe({
      next: (resp: any) => {
        this.mainMenus = JSON.parse(resp['data']);
      },
      error: (err: any) => {
        //this.messageService.error(err)
      },
    });
  }

  getSubMenuActive() {
    this.menuService.getSubMenuActive().subscribe({
      next: (resp: any) => {
        this.subMenus = JSON.parse(resp['data']);
      },
      error: (err: any) => {
        //this.messageService.error(err)
      },
    });
  }

  getBanner() {
    this.galleryService.get({}).subscribe({
      next: (resp: any) => {
        let datas: Gallery[] = JSON.parse(resp['data']);
        this.subBanner = datas.filter((x) => x.Type == 2);
      },
      error: (err: any) => {
        //this.messsageService.error(err);
      },
    });
  }

  get getQtyItemInCart(): number {
    let sum: number = 0;
    this.cartService.getCart().forEach((x) => (sum += x.Qty));
    return sum;
  }

  submitRegistration() {
    for (const i in this.formRegistration.controls) {
      if (this.formRegistration.controls.hasOwnProperty(i)) {
        this.formRegistration.controls[i].markAsDirty();
        this.formRegistration.controls[i].updateValueAndValidity();
      }
    }
    if (this.formRegistration.invalid) {
      return;
    }
    this.emailRegistrationService
      .post(this.formRegistration.getRawValue())
      .subscribe({
        next: (resp: any) => {
          this.messageService.success('Đăng ký thành công.');
          this.formRegistration.reset();
        },
        error: (err: any) => {
          this.messageService.error(err);
        },
      });
  }

  search() {
    if (this.keySearch != null && this.keySearch != '') {
      this.navigate('/tim-kiem/' + this.keySearch);
    }
  }

  navigate(path: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(path)).then();
  }
}

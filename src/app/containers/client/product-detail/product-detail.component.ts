import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/core/model/product';
import { ProductAttribute } from 'src/app/core/model/product-attribute';
import { CartService } from 'src/app/core/service/cart.service';
import { ProductService } from 'src/app/core/service/product.service';
import { Constants } from 'src/app/core/util/constants';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  productAlias: string = '';
  product!: Product;
  qty: number = 1;
  image: string = './assets/imgs/tivi.png';
  //hmtien add 26/8
  qtyAvailable!: boolean;

  selectedIndex = 0;
  // config: any = {
  //   pagination: {
  //     el: '.swiper-pagination',
  //   },
  //   paginationClickable: true,
  //   navigation: {
  //     nextEl: '.swiper-button-next',
  //     prevEl: '.swiper-button-prev',
  //   },
  //   spaceBetween: 30
  // };
  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService,
    private toastrService: ToastrService,
    private ngZone: NgZone,
    private router: Router
  ) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.productAlias = this.activatedRoute.snapshot.params['alias'];
        this.getData();
        if (this.product.Quantity > 0) this.qtyAvailable = true;
        else this.qtyAvailable = false;
      }
    });
  }

  ngOnInit(): void {
    this.productAlias = this.activatedRoute.snapshot.params['alias'];
    this.getData();
  }

  selectImage(index: number): void {
    this.selectedIndex = index;
  }

  handleMinus() {
    if (this.qty > 1) {
      this.qty--;
    } else {
      this.qty = 1;
    }
  }
  handlePlus() {
    if (this.qty < this.product.Quantity) {
      this.qty++;
    } else {
      this.qty = this.product.Quantity;
    }
  }

  handleInputQuantity() {
    if (this.qty > this.product.Quantity) {
      this.qty = this.product.Quantity;
    } else if (this.qty < 0) {
      this.qty = 1;
    }
  }

  getData() {
    this.productService.getByAlias(this.productAlias).subscribe({
      next: (resp: any) => {
        this.product = JSON.parse(resp['data']);
        console.log(this.product.RateAvg);
      },
      error: (err: any) => {
        this.toastrService.error('Thông tin sản phẩm không khả dụng', '', {
          positionClass: 'toast-bottom-right',
        });
      },
    });
  }

  showImg(src: string) {
    this.product.Image = src;
  }

  chooseAttribute(attributes: ProductAttribute[], event: any) {
    let index = Number(event.target.value);
    for (let i = 0; i < attributes.length; i++) {
      if (i == index) {
        if (attributes[i].Checked == true) attributes[i].Checked = false;
        else attributes[i].Checked = true;
      } else attributes[i].Checked = false;
    }
  }

  addToCart() {
    if (this.qty > this.product.Quantity || this.qty < 1) {
      this.toastrService.error('Số lượng sản phẩm không hợp lệ', '', {
        positionClass: 'toast-bottom-right',
      });
      return;
    }
    if (this.product.Attributes != null && this.product.Attributes.length > 0) {
      if (
        !(
          this.product.Attributes.findIndex(
            (x) => x.ProductAttributes.findIndex((y) => y.Checked) >= 0
          ) >= 0
        )
      ) {
        this.product.Attributes.forEach((x) => {
          if (x.ProductAttributes.length > 0)
            x.ProductAttributes[0].Checked = true;
          for (let i = 1; i < x.ProductAttributes.length; i++) {
            x.ProductAttributes[i].Checked = false;
          }
        });
      }
    }
    //fix bug product qty when add to cart
    this.toastrService.success(
      `Đã thêm ${this.product.Name} vào giỏ hàng`,
      '',
      { positionClass: 'toast-bottom-right' }
    );
    this.cartService.addProductToCart(this.product, this.qty);
  }

  buyNow() {
    if (this.qty > this.product.Quantity || this.qty < 1) {
      this.toastrService.error('Số lượng sản phẩm không hợp lệ', '', {
        positionClass: 'toast-bottom-right',
      });
      return;
    }
    if (this.product.Attributes != null && this.product.Attributes.length > 0) {
      if (
        !(
          this.product.Attributes.findIndex(
            (x) => x.ProductAttributes.findIndex((y) => y.Checked) >= 0
          ) >= 0
        )
      ) {
        this.product.Attributes.forEach((x) => {
          if (x.ProductAttributes.length > 0)
            x.ProductAttributes[0].Checked = true;
          for (let i = 1; i < x.ProductAttributes.length; i++) {
            x.ProductAttributes[i].Checked = false;
          }
        });
      }
    }
    this.cartService.addProductToCart(this.product, this.qty);
    this.navigate('/gio-hang');
  }

  navigate(path: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(path)).then();
  }
}

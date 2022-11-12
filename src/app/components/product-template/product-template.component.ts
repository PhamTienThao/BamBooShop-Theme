import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/core/model/product';
import { CartService } from 'src/app/core/service/cart.service';
import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/app/core/util/constants';

@Component({
  selector: 'app-product-template',
  templateUrl: './product-template.component.html',
  styleUrls: ['./product-template.component.css'],
})
export class ProductTemplateComponent implements OnInit {
  @Input() product!: Product;
  constructor(
    private toastrService: ToastrService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    console.log(this.product)
  }

  addToCart() {
    if (this.product.Attributes != null) {
      this.product.Attributes.forEach((x) => {
        if (x.ProductAttributes.length > 0)
          x.ProductAttributes[0].Checked = true;
        for (let i = 1; i < x.ProductAttributes.length; i++) {
          x.ProductAttributes[i].Checked = false;
        }
      });
    }
    this.toastrService.success(`Đã thêm ${this.product.Name} vào giỏ hàng`,"",{positionClass :'toast-bottom-right'});
    this.cartService.addProductToCart(this.product);
  }
}

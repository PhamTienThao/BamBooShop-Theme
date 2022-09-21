import { Component, Input, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Product } from 'src/app/core/model/product';
import { CartService } from 'src/app/core/service/cart.service';
import { Constants } from 'src/app/core/util/constants';

@Component({
  selector: 'app-product-template-list',
  templateUrl: './product-template-list.component.html',
  styleUrls: ['./product-template-list.component.css']
})
export class ProductTemplateListComponent implements OnInit {
  @Input() product!: Product
  constructor(
    private messageService: NzMessageService,
    private cartService: CartService
  ) { }

  ngOnInit() {
  }

  addToCart() {
    if (this.product.Attributes != null) {
      this.product.Attributes.forEach(x => {
        if (x.ProductAttributes.length > 0)
          x.ProductAttributes[0].Checked = true;
        for (let i = 1; i < x.ProductAttributes.length; i++) {
          x.ProductAttributes[i].Checked = false;
        }
      })
    }
    this.messageService.success(`Đã thêm ${this.product.Name} vào giỏ hàng`);
    this.cartService.addProductToCart(this.product);
  }

}

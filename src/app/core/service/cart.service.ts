import { ProductAttribute } from 'src/app/core/model/product-attribute';
import { Injectable } from '@angular/core';
import { OrderDetail } from '../model/order-detail';
import { Product } from '../model/product';
import { Constants } from '../util/constants';
import { isFakeMousedownFromScreenReader } from '@angular/cdk/a11y';
import { flattenTreeData } from 'ng-zorro-antd/core/tree';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  getCart(): OrderDetail[] {
    let cartJson = localStorage.getItem(Constants.LOCAL_STORAGE_KEY.CART);
    if (cartJson == null || cartJson == "")
      return [];
    return JSON.parse(cartJson);
  }

  addProductToCart(product: Product, qty: number = 1) {
    let cart: OrderDetail[] = [];
    let cartJson = localStorage.getItem(Constants.LOCAL_STORAGE_KEY.CART);
    if (cartJson != null)
      cart = JSON.parse(cartJson);
    // let pExist = cart.find(x => x.ProductId == product.Id);
    // Fix attribute check logic
    let isExist: boolean = true;
    //let listDuplicate : OrderDetail[] = [];
    //let dupliacteDetail :[] =[];
    if (cart.length == 0) isExist = false;
    else {
      for (let i = 0; i < cart.length; i++) {
        if (product.Id == cart[i].ProductId) {
          // listDuplicate.push(cart[i]);
          console.log(product.Attributes)
          console.log(cart[i].Attributes)
          if (JSON.stringify(product.Attributes) == JSON.stringify(cart[i].Attributes)) {
            cart[i].Qty += qty;
            isExist = true;
            break;
          } else {
            isExist = false;
          }
        }
        else {
          isExist = false;
        }
      }
    }
    // if(listDuplicate.length == 0){
    //   isExist = false;
    // }
    // else{
    //   let productAdd = product.Attributes;
    //   let length = listDuplicate.length;
    //   for(let i = 0; i < length; i++){
    //     let productCart = listDuplicate[i].Attributes;

    //     for(let j = 0; j < productAdd.length; j++){
    //       if(productAdd[j].Id == productCart[i].Id){
    //         let productAttributesLength = productAdd[j].ProductAttributes.length;

    //         for(let k = 0; k < productAttributesLength; k ++){
    //           if(productCart[j].ProductAttributes[k].Checked != productAdd[j].ProductAttributes[k].Checked)
    //           {
    //             isExist = false;
    //             break;
    //           }
    //         }

    //         if(!isExist) break;
    //       }


    //     }
    //     if(!isExist) break;
    //   }
    // }
    //console.log(isExist);
    if (!isExist) {
      cart.push({
        Id: 0,
        ProductDiscountPrice: product.DiscountPrice,
        ProductId: product.Id,
        ProductImage: product.Image,
        ProductName: product.Name,
        ProductAlias: product.Alias,
        ProductPrice: product.Price,
        Qty: qty,
        Attributes: product.Attributes,
        QtyRemain: product.Quantity
      });
    }


    localStorage.setItem(Constants.LOCAL_STORAGE_KEY.CART, JSON.stringify(cart));
  }

  updateCart(cart: OrderDetail[]) {
    localStorage.setItem(Constants.LOCAL_STORAGE_KEY.CART, JSON.stringify(cart));
  }

  clearCart() {
    localStorage.removeItem(Constants.LOCAL_STORAGE_KEY.CART);
  }
  deleteCartProduct() {

  }
}

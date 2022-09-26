import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize } from 'rxjs/operators';
import { OrderDetail } from 'src/app/core/model/order-detail';
import { ProductAttribute } from 'src/app/core/model/product-attribute';
import { CartService } from 'src/app/core/service/cart.service';
import { CustomerService } from 'src/app/core/service/customer.service';
import { OrderService } from 'src/app/core/service/order.service';
import { DataHelper } from 'src/app/core/util/data-helper';
// import { render } from 'creditcardpayments/creditCardPayments';
import { CityData } from 'src/app/containers/client/cart/city'
import { Constants } from 'src/app/core/util/constants';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  formData!: FormGroup;
  orderDetail: OrderDetail[] = [];
  totalPayPal!: number;
  //quantityRemain!: number | any;
  qtyProductCart!: number | any;



  //hmtien add 29/8
  cities = CityData;
  district: string[] = ['District'];


  constructor(private orderService: OrderService,
    private customerService: CustomerService,
    private cartService: CartService,
    private messageService: NzMessageService,
    private formBuilder: FormBuilder,
    private ngZone: NgZone,
    private router: Router,) { }

  ngOnInit(): void {
    this.formData = this.formBuilder.group({
      FullName: [{ value: '', disabled: true }, Validators.required],
      PhoneNumber: [{ value: '', disabled: true }, Validators.required],
      Email: [{ value: '', disabled: true }, Validators.required],
      Address: [null, Validators.required],
      City: [null, Validators.required],
      District: [null, Validators.required],
      Note: [null]
    });
    this.getCart();
    // for (let i = 0; i <= this.orderDetail.length; i++) {
    //   this.qtyProductCart = this.orderDetail[i].Qty;
    // }
    // this.quantityRemain = this.orderDetail[0].QtyRemain;
    this.getProfile();
  }
  // showPaypal() {
  //   //Paypal test
  //   render({
  //     id: "#myPaypalButtons",
  //     currency: "VND",
  //     value: "100.00",
  //     onApprove: (detail) => {
  //       alert("Transaction successfully")
  //     }
  //   });
  //   this.totalPayPal
  //   //Paypal test
  // }

  getProfile() {
    this.customerService.getProfile()
      .subscribe({
        next: (resp: any) => {
          let profile = JSON.parse(resp["data"]);
          this.formData.patchValue(profile)
        }, error: (err: any) => {
          this.messageService.error(err);
        }
      });
  }

  handleQty(orderDetailIndex: number, checkMath: number, event: any = null) {
    switch (checkMath) {
      case -1:
        if (this.orderDetail[orderDetailIndex].QtyRemain > 1) {
          this.orderDetail[orderDetailIndex].Qty--;
        }
        else {
          this.orderDetail[orderDetailIndex].Qty = 1;
        }
        break;
      case 0:
        if (Number(event.target.value) < 0)
          this.orderDetail[orderDetailIndex].Qty = 1;
        else if (Number(event.target.value) > this.orderDetail[orderDetailIndex].QtyRemain)
          this.orderDetail[orderDetailIndex].Qty = this.orderDetail[orderDetailIndex].QtyRemain;
        else
          this.orderDetail[orderDetailIndex].Qty = Number(event.target.value);
        break;
      case 1:
        if (this.orderDetail[orderDetailIndex].QtyRemain > this.orderDetail[orderDetailIndex].Qty) {
          this.orderDetail[orderDetailIndex].Qty++;
        } else {
          this.orderDetail[orderDetailIndex].Qty = this.orderDetail[orderDetailIndex].QtyRemain;
        }
        break;
    }
    //if (this.orderDetail[orderDetailIndex].Qty == 0) this.updateCart();
    this.updateCart();
  }

  getCart() {
    this.orderDetail = this.cartService.getCart();

  }

  get getTotalAmount(): number {
    let total: number = 0;
    this.orderDetail.forEach(x => {
      total += x.Qty * x.ProductDiscountPrice;
    })
    this.totalPayPal = total;
    return total;
  }


  clearCart() {
    this.cartService.clearCart();

  }

  updateCart() {
    this.orderDetail = this.orderDetail.filter(x => x.Qty > 0);
    this.cartService.updateCart(this.orderDetail);
  }



  chooseAttribute(orderDetailIndex: number, attributeIndex: number, productAttributeIndex: any, attributes: ProductAttribute[]) {
    let index = Number(productAttributeIndex.target.value);
    for (let i = 0; i < attributes.length; i++) {
      if (i == index) {
        this.orderDetail[orderDetailIndex].Attributes[attributeIndex].ProductAttributes[i].Checked = true;
      }
      else
        this.orderDetail[orderDetailIndex].Attributes[attributeIndex].ProductAttributes[i].Checked = false;
    }
    for (let i = 0; i < this.orderDetail.length; i++) {
      if (i != orderDetailIndex
        && this.orderDetail[i].ProductId == this.orderDetail[orderDetailIndex].ProductId
        && JSON.stringify(this.orderDetail[i].Attributes) == JSON.stringify(this.orderDetail[orderDetailIndex].Attributes)) {
        {
          this.orderDetail[orderDetailIndex].Qty += this.orderDetail[i].Qty
          let array1 = this.orderDetail.slice(0,i);
          let array2 = this.orderDetail.slice(i+1, this.orderDetail.length)
          this.orderDetail = array1.concat(array2);
          break;
        }


      }
    }
    this.updateCart();
  }
  submitForm(): void {
    for (const i in this.formData.controls) {
      if (this.formData.controls.hasOwnProperty(i)) {
        this.formData.controls[i].markAsDirty();
        this.formData.controls[i].updateValueAndValidity();
      }
    }
    debugger;
    if (this.formData.invalid) {
      this.messageService.error("Thiếu thông tin cần thiết");
      return; 
    }
    let orderDetailPost: OrderDetail[] = DataHelper.clone(this.orderDetail);
    orderDetailPost.forEach(x => {
      x.Attribute = "";
      if (x.Attributes != null && x.Attributes.length > 0) {
        x.Attributes.forEach(y => {
          x.Attribute += ('<b>' + y.Name + "</b>: " + y.ProductAttributes.find(z => z.Checked == true)?.Value + "<br>");
        })
      }
      x.Attributes = [];
    });
    this.orderService.post({
      Customer: this.formData.getRawValue(),
      OrderDetails: orderDetailPost
    })
      .subscribe({
        next: (resp: any) => {
          this.cartService.clearCart();
          this.navigate("/dat-hang-thanh-cong");
        }, error: (err: any) => {
          this.messageService.error(err);
        }
      });
  }

  navigate(path: string): void {
    this.ngZone.run(() => this.router.navigateByUrl(path)).then();
  }
  public changeCity(event: any): void {
    const city = event.target.value;
    if (!city) {
      return;
    }

    // cách 1
    // const search = this.vietnamData.filter((data) => data.city === city);
    // console.log('search', search);
    // if (search && search.length > 0) {
    //   this.districts = search[0].district;
    // }

    // cách 2
    this.district =
      this.cities.find((data) => data.name === city)?.districts || [];
    this.formData.controls['District'].setValue(this.district[0])
  }
}



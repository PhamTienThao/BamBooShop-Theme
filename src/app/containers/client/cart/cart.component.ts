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

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  formData!: FormGroup;
  orderDetail: OrderDetail[] = [];
  nzLoading: boolean = false;
  totalPayPal!: number;
  quantityRemain!: number | any;



  //hmtien add 29/8
  cities = CityData;
  district: string[] = ['Quận Huyện'];


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
      PhoneNumber: [null, Validators.required],
      Address: [null, Validators.required],
      City: [null, Validators.required],
      District: [null, Validators.required],
      Note: [null]
    });
    this.getCart();
    this.quantityRemain = this.orderDetail[0].QtyRemain;
    this.getProfile();
    console.log(CityData);
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

  handleMinus() {
    // if (this.quantityRemain > 1) {
    //   this.quantityRemain--;
    // }
    // else {
    //   this.quantityRemain = 1;
    // }
  }
  handlePlus() {
    // if (this.quantityRemain < this.product.Quantity) {
    //   this.quantityRemain++;
    // }
    // else {
    //   this.quantityRemain = this.product.Quantity;
    // }
  }

  handleInputQuantity() {
    // if (this.quantityRemain > this.product.Quantity) {
    //   this.quantityRemain = this.product.Quantity;
    // } else if (this.quantityRemain < 0) {
    //   this.quantityRemain = 1;
    // }
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

  updateCart() {
    this.orderDetail = this.orderDetail.filter(x => x.Qty > 0);
    this.cartService.updateCart(this.orderDetail);
  }
  chooseAttribute(attributes: ProductAttribute[], index: number) {
    for (let i = 0; i < attributes.length; i++) {
      if (i == index) {
        // if (attributes[i].Checked == true)
        //   attributes[i].Checked = false;
        // else
        //   attributes[i].Checked = true;
        attributes[i].Checked = !attributes[i].Checked;
        //check if no attributes was checked
        let noAttributesChecked = attributes.filter(x => x.Checked == true);
        if (noAttributesChecked.length < 1) {
          attributes[i].Checked = !attributes[i].Checked;
        }
      }
      else
        attributes[i].Checked = false;
    }
  }


  submitForm(): void {
    for (const i in this.formData.controls) {
      if (this.formData.controls.hasOwnProperty(i)) {
        this.formData.controls[i].markAsDirty();
        this.formData.controls[i].updateValueAndValidity();
      }
    }

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

    this.nzLoading = true;
    this.orderService.post({
      Customer: this.formData.getRawValue(),
      OrderDetails: orderDetailPost
    })
      .pipe(
        finalize(() => {
          this.nzLoading = false;
        })
      )
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
  }
}



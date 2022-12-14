import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { finalize } from 'rxjs';
import { Menu } from 'src/app/core/model/menu';
import { ProductService } from 'src/app/core/service/product.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  menu!: Menu;
  filter = {
    menuAlias: '',
    orderBy: 'highlight',
    price: 'all',
    take: 20,
  };

  filterPrice = [
    { name: 'Tất cả', value: 'all' },
    { name: 'Trên 30tr', value: '30m' },
    { name: 'Từ 20tr tới 30tr', value: 'f20t30' },
    { name: 'Từ 10tr tới 20tr', value: 'f10t20' },
    { name: 'Từ 5tr tới 10tr', value: 'f5t10' },
    { name: 'Dưới 5tr', value: 'l5' },
  ];
  filterOption = [
    { name: 'Mặc định', value: 'highlight' },
    { name: 'Từ A tới Z', value: 'az' },
    { name: 'Từ Z tới A', value: 'za' },
    { name: 'Nổi bật', value: 'highlight' },
    { name: 'Giảm dần theo giá', value: 'price-asc' },
    { name: 'Tăng dần theo giá', value: 'price-desc' },
  ];

  currentFilterPrice: any;
  currentFilterOption: any;

  countAllProducts: number = 0;
  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private viewportScroller: ViewportScroller,
    private router: Router
  ) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.filter.menuAlias = this.activatedRoute.snapshot.params['alias'];
        this.filter.take = 20;
        this.getData();
      }
    });
  }

  ngOnInit() {
    this.filter.menuAlias = this.activatedRoute.snapshot.params['alias'];
    this.currentFilterPrice = this.filterPrice[0].name;
    this.getData();
  }

  getData() {
    if (
      this.filterPrice.find((x) => x.value == this.filter.price) != null ||
      this.filterPrice.find((x) => x.value == this.filter.price) != undefined
    ) {
      this.currentFilterPrice = this.filterPrice.find(
        (x) => x.value == this.filter.price
      )?.name;
    }

    if (
      this.filterOption.find((x) => x.value == this.filter.orderBy) != null ||
      this.filterOption.find((x) => x.value == this.filter.orderBy) != undefined
    ) {
      this.currentFilterOption = this.filterOption.find(
        (x) => x.value == this.filter.orderBy
      )?.name;
    }

    this.productService
      .getByMenu(
        this.filter.menuAlias,
        this.filter.orderBy,
        this.filter.price,
        this.filter.take
      )
      .subscribe({
        next: (resp: any) => {
          this.menu = JSON.parse(resp['data']);
          if (this.menu.Products != null) {
            this.countAllProducts = this.menu.Products.length;
          }
        },
        error: (err: any) => {},
      });
  }

  showMore() {
    let currentLocation: [number, number] =
      this.viewportScroller.getScrollPosition();
    this.filter.take += 20;
    this.productService
      .getByMenu(
        this.filter.menuAlias,
        this.filter.orderBy,
        this.filter.price,
        this.filter.take
      )
      .subscribe({
        next: (resp: any) => {
          this.menu = JSON.parse(resp['data']);
          if (this.menu.Products != null) {
            this.countAllProducts = this.menu.Products.length;
          }
          setTimeout(() => {
            this.viewportScroller.scrollToPosition(currentLocation);
          }, 10);
        },
        error: (err: any) => {},
      });
  }
}

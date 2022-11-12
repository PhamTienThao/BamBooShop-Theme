import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { finalize } from 'rxjs';
import { Product } from 'src/app/core/model/product';
import { ProductService } from 'src/app/core/service/product.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  products: Product[] = [];

  filter = {
    keySearch: '',
    orderBy: 'highlight',
    price: 'all',
    take: 20,
  };
  filterPrice = [
    { name: 'All', value: 'all' },
    { name: 'Above 30m', value: '30m' },
    { name: 'From 20m to 30m', value: 'f20t30' },
    { name: 'From 10m to 20m', value: 'f10t20' },
    { name: 'From 5m to 10m', value: 'f5t10' },
    { name: 'Below 5m', value: 'l5' },
  ];
  filterOption = [
    { name: 'Default', value: 'highlight' },
    { name: 'Name, A to Z', value: 'az' },
    { name: 'Name, Z to A', value: 'za' },
    { name: 'Best fit', value: 'highlight' },
    { name: 'Price, low to high', value: 'price-asc' },
    { name: 'Price, high to low', value: 'price-desc' },
  ];
  currentFilterPrice: any;
  currentFilterOption: any;
  constructor(
    private productService: ProductService,
    private viewportScroller: ViewportScroller,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.filter.keySearch = this.activatedRoute.snapshot.params['alias'];
        // if(this.router.getCurrentNavigation()!= undefined && this.router.getCurrentNavigation() != null)
        //   this.filter.keySearch =(this.router.getCurrentNavigation()?.extras.state?.['example']); // should log out 'bar'
        this.filter.take = 20;
        this.getData();
      }
    });
  }

  ngOnInit() {
    this.filter.keySearch = this.activatedRoute.snapshot.params['alias'];
    // if(this.router.getCurrentNavigation()!= undefined && this.router.getCurrentNavigation() != null)
    //       this.filter.keySearch =(this.router.getCurrentNavigation()?.extras.state?.['example']);
    //       else this.filter.keySearch = "";
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
      .search(
        this.filter.keySearch,
        this.filter.orderBy,
        this.filter.price,
        this.filter.take
      )
      .subscribe({
        next: (resp: any) => {
          this.products = JSON.parse(resp['data']);
          console.log(this.products)
        },
        error: (err: any) => {},
      });
  }

  showMore() {
    let currentLocation: [number, number] =
      this.viewportScroller.getScrollPosition();
    this.filter.take += 20;
    this.productService
      .search(
        this.filter.keySearch,
        this.filter.orderBy,
        this.filter.price,
        this.filter.take
      )
      .subscribe({
        next: (resp: any) => {
          this.products = JSON.parse(resp['data']);
          setTimeout(() => {
            this.viewportScroller.scrollToPosition(currentLocation);
          }, 10);
        },
        error: (err: any) => {},
      });
  }
}

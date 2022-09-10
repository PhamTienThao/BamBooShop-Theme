import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Article } from 'src/app/core/model/article';
import { Gallery } from 'src/app/core/model/gallery';
import { Menu } from 'src/app/core/model/menu';
import { Product } from 'src/app/core/model/product';
import { ArticleService } from 'src/app/core/service/article.service';
import { GalleryService } from 'src/app/core/service/gallery.service';
import { MenuService } from 'src/app/core/service/menu.service';
import { ProductService } from 'src/app/core/service/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // slideConfig = {
  //   slidesToShow: 3,
  //   slidesToScroll: 1,
  //   autoplay: true,
  //   dots: true,
  //   // responsive: [
  //   //   {
  //   //     breakpoint: 1024,
  //   //     settings: {
  //   //       slidesToShow: 2,
  //   //       slidesToScroll: 2,
  //   //       dots: true,
  //   //     },
  //   //   },
  //   //   {
  //   //     breakpoint: 600,
  //   //     settings: {
  //   //       slidesToShow: 2,
  //   //       slidesToScroll: 2,
  //   //     },
  //   //   },
  //   //   {
  //   //     breakpoint: 480,
  //   //     settings: {
  //   //       slidesToShow: 1,
  //   //       slidesToScroll: 1,
  //   //     },
  //   //   },
  //   //   {
  //   //     breakpoint: 360,
  //   //     settings: {
  //   //       slidesToShow: 1,
  //   //       slidesToScroll: 1,
  //   //     },
  //   //   },
  //   // ],
  // };
  mainBanner: Gallery[] = [];
  productSellings: Product[] = [];
  menuHomePages: Menu[] = [];
  highlightArticle: Article[] = [];

  constructor(
    private menuService: MenuService,
    private articleService: ArticleService,
    private galleryService: GalleryService,
    private productService: ProductService,
    private messageService: NzMessageService,
  ) { }

  ngOnInit() {
    this.getBanner();
    this.getProductSelling();
    this.getAllMenuHomePage();
    this.getHighlightArticle();
  }

  getBanner() {
    // this.galleryService.get({})
    //   .subscribe((resp: any) => {
    //     let datas: Gallery[] = JSON.parse(resp["data"]);
    //     this.mainBanner = datas.filter(x => x.Type == 1);
    //   }, error => {

    //   })
    this.galleryService.get({}).subscribe({
      next: (resp: any) => {
        let datas: Gallery[] = JSON.parse(resp["data"]);
        this.mainBanner = datas.filter(x => x.Type == 1);
      },
      error: (err: any) => {
        this.messageService.error(err);
      }
    }
    );
  }

  getProductSelling() {
    // this.productService.getSelling()
    //   .subscribe((resp: any) => {
    //     this.productSellings = JSON.parse(resp["data"]);
    //   }, error => {

    //   })
    this.productService.getSelling().subscribe({
      next: (resp:any) =>{
        this.productSellings = JSON.parse(resp["data"]);
      },
      error: (err: any) => {
        this.messageService.error(err);
      }
    });
  }

  getAllMenuHomePage() {
    // this.menuService.getAllMenuHomePage()
    //   .subscribe((resp: any) => {
    //     this.menuHomePages = JSON.parse(resp["data"]);
    //     console.log(this.menuHomePages)

    //   }, error => {

    //   })
    this.menuService.getAllMenuHomePage().subscribe({
      next: (resp: any) => {
        this.menuHomePages = JSON.parse(resp["data"]);
      },
      error: (err: any) => {
        this.messageService.error(err);
      }
    });
  }

  getHighlightArticle() {
    // this.articleService.getHighlight()
    //   .subscribe((resp: any) => {
    //     this.highlightArticle = JSON.parse(resp["data"])
    //   }, error => {

    //   })
    this.articleService.getHighlight().subscribe({
      next: (resp: any) => {
        this.highlightArticle = JSON.parse(resp["data"])
      },
      error: (err: any) => {
        this.messageService.error(err);
      }
    });
  }

}

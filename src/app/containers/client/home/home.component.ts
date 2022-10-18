import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  mainBanner: Gallery[] = [];
  productSelling: Product[] = [];
  menuHomePages: Menu[] = [];
  highlightArticle: Article[] = [];

  constructor(
    private menuService: MenuService,
    private articleService: ArticleService,
    private galleryService: GalleryService,
    private productService: ProductService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.getBanner();
    this.getProductSelling();
    this.getAllMenuHomePage();
    this.getHighlightArticle();
  }

  getBanner() {
    this.galleryService.get({}).subscribe({
      next: (resp: any) => {
        let datas: Gallery[] = JSON.parse(resp['data']);
        this.mainBanner = datas.filter((x) => x.Type == 1);
      },
      error: (err: any) => {
        this.toastrService.error(err.error.message, '', {
          positionClass: 'toast-bottom-right',
        });
      },
    });
  }

  getProductSelling() {
    this.productService.getSelling().subscribe({
      next: (resp: any) => {
        this.productSelling = JSON.parse(resp['data']);
      },
      error: (err: any) => {
        this.toastrService.error(err.error.message, '', {
          positionClass: 'toast-bottom-right',
        });
      },
    });
  }

  getAllMenuHomePage() {
    this.menuService.getAllMenuHomePage().subscribe({
      next: (resp: any) => {
        this.menuHomePages = JSON.parse(resp['data']);
      },
      error: (err: any) => {
        this.toastrService.error(err.error.message, '', {
          positionClass: 'toast-bottom-right',
        });
      },
    });
  }

  getHighlightArticle() {
    this.articleService.getHighlight().subscribe({
      next: (resp: any) => {
        this.highlightArticle = JSON.parse(resp['data']);
      },
      error: (err: any) => {
        this.toastrService.error(err.error.message, '', {
          positionClass: 'toast-bottom-right',
        });
      },
    });
  }
}

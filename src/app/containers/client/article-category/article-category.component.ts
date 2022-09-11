import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize } from 'rxjs';
import { Article } from 'src/app/core/model/article';
import { Menu } from 'src/app/core/model/menu';
import { ArticleService } from 'src/app/core/service/article.service';

@Component({
  selector: 'app-article-category',
  templateUrl: './article-category.component.html',
  styleUrls: ['./article-category.component.css']
})
export class ArticleCategoryComponent implements OnInit {

  menu!: Menu;
  nzLoading: boolean = false;
  article: Article[] = [];
  filter = {
    menuAlias: "",
    take: 10
  }

  constructor(
    private articleService: ArticleService,
    private activatedRoute: ActivatedRoute,
    private viewportScroller: ViewportScroller,
    private router: Router,
    private messageService: NzMessageService
  ) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.filter.menuAlias = this.activatedRoute.snapshot.params['alias'];
        this.getData();
      }
    });
  }

  ngOnInit() {
    this.filter.menuAlias = this.activatedRoute.snapshot.params['alias'];
    this.getData();
  }

  getData() {
    if(this.filter.menuAlias == null){
      this.articleService.getAll().subscribe({
        next: (resp: any) => {
          this.menu = {Id: null, ParentMenu: null,  Group: "",  Name: "",  Alias: "",  Index: null,  ShowHomePage: true,  Type: "",
            Active: true, SubMenus: null, PMenu: null, Products: null, Articles: this.article
          }
          this.menu.Articles = JSON.parse(resp["data"]);  
          console.log(this.menu.Articles)
        },
        error: (err: any) => {
          this.messageService.error("Error loading article");
        }
      })
    }else{
      this.articleService.getByMenu(this.filter.menuAlias, this.filter.take)
      .subscribe({
        next: (resp: any) => {
          this.menu = JSON.parse(resp["data"])
        }, error: (err: any) => {
          this.messageService.error("Error loading article");
        }
      })
    };
    
  }

  showMore() {
    let currentLocation: [number, number] = this.viewportScroller.getScrollPosition();
    this.filter.take += 10;
    this.nzLoading = true;
    this.articleService.getByMenu(this.filter.menuAlias, this.filter.take)
      .pipe(
        finalize(() => {
          this.nzLoading = false;
        })
      )
      .subscribe({
        next: (resp: any) => {
          this.menu = JSON.parse(resp["data"])
          setTimeout(() => {
            this.viewportScroller.scrollToPosition(currentLocation)
          }, 10);
        },
        error: (error: any) => {
          this.messageService.error("error loading article");
        }
      })
  }

}

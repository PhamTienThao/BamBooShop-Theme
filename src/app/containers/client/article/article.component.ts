import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Article } from 'src/app/core/model/article';
import { Menu } from 'src/app/core/model/menu';
import { ArticleService } from 'src/app/core/service/article.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css'],
})
export class ArticleComponent implements OnInit {
  menu!: Menu;
  articleAlias: string = '';
  article!: Article;
  formSearchArticles!: FormGroup;
  constructor(
    private articleService: ArticleService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService,
    private formBuilder: FormBuilder
  ) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        this.articleAlias = this.activatedRoute.snapshot.params['alias'];
        this.getData();
      }
    });
  }

  ngOnInit() {
    this.formSearchArticles = this.formBuilder.group({
      SearchText: [''],
    });
    this.articleAlias = this.activatedRoute.snapshot.params['alias'];
    this.getData();
  }

  getData() {
    this.articleService.getByAlias(this.articleAlias).subscribe({
      next: (resp: any) => {
        this.article = JSON.parse(resp['data']);
        this.getArticleRelated();
      },
      error: (err: any) => {
        this.toastrService.error('Error loading article', '', {
          positionClass: 'toast-bottom-right',
        });
      },
    });
  }

  getArticleRelated() {
    if (this.article != null) {
      this.articleService.getByMenu(this.article.Menu.Alias, 10).subscribe({
        next: (resp: any) => {
          this.menu = JSON.parse(resp['data']);
        },
        error: (err: any) => {
          this.toastrService.error('Error loading related articles', '', {
            positionClass: 'toast-bottom-right',
          });
        },
      });
    }
  }
  searchArticle() {
    let data = this.formSearchArticles.get('SearchText')?.value;
    console.log(data);
    if (data == null || data == '' || data == undefined) {
      this.getArticleRelated();
    } else {
      this.articleService.getArticleByKeySearch(data).subscribe({
        next: (resp: any) => {
          this.menu.Articles = JSON.parse(resp['data']);
        },
        error: (err: any) => {
          this.toastrService.error('Search article function failed', '', {
            positionClass: 'toast-bottom-right',
          });
        },
      });
    }
  }
}

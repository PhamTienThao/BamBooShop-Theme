import { Article } from './article';
import { Product } from './product';

export interface Menu {
  Id: number | null;
  ParentMenu: number | null;
  Group: string;
  Name: string;
  Alias: string;
  Index: number | null;
  ShowHomePage: boolean;
  Type: string;
  Active: boolean;

  SubMenus: Menu[] | null;
  PMenu: Menu | null;

  Products: Product[] | null;
  Articles: Article[] | null;
}

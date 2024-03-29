import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Menu } from 'src/app/core/model/menu';
import { Product } from 'src/app/core/model/product';
import { MenuService } from 'src/app/core/service/menu.service';
import { DataHelper } from 'src/app/core/util/data-helper';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { AttributeService } from 'src/app/core/service/attribule.service';
import { Attribute } from 'src/app/core/model/attribute';
import { ProductService } from 'src/app/core/service/product.service';
import { ProductAttribute } from 'src/app/core/model/product-attribute';
import { ProductImage } from 'src/app/core/model/product-image';
import { ProductRelated } from 'src/app/core/model/product-related';
import { environment } from 'src/environments/environment';
import { NzMessageService } from 'ng-zorro-antd/message';

const getBase64 = (file: File): Promise<string | ArrayBuffer | null> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject('Không thành công!');
  });

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  @Input() isAddNew: boolean = true;
  @Output() onSubmit = new EventEmitter<Product>();

  menus: Menu[] = [];
  attribute: Attribute[] = [];
  allProducts: Product[] = [];

  formData!: FormGroup;
  visible = false;
  srcImage: string = 'no_img.jpg';
  srcCloudImg: string = '';
  fileList: NzUploadFile[] = [];
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '350px',
    minHeight: '5rem',
    placeholder: '',
    translate: 'no',
    defaultParagraphSeparator: 'p',
  };
  constructor(
    private menuService: MenuService,
    private productService: ProductService,
    private attributeService: AttributeService,
    private formBuilder: FormBuilder,
    //hmtien add 26/8
    private messageService: NzMessageService
  ) {}

  ngOnInit() {
    this.formData = this.formBuilder.group({
      Id: [0],
      MenuId: [0, Validators.required],
      Name: ['', Validators.required],
      Alias: ['', Validators.required, { disabled: true }],
      Image: [''],
      Index: [1],
      Status: [10, Validators.required],
      Price: [0, Validators.required],
      DiscountPrice: [0, Validators.required],
      Selling: [true],
      ShortDescription: [''],
      Description: [''],
      ImageCloudLink: [{ value: '', disabled: true }],
      ProductRelateds: [[]],
      ProductAttributes: this.formBuilder.array([]),
      //hmtien add 26/8
      Quantity: ['', Validators.required],
    });
    this.getAttribute();
  }

  get ProductAttributes(): FormArray {
    return this.formData.get('ProductAttributes') as FormArray;
  }

  setForm(product: Product | any) {
    this.formData.reset();
    this.ProductAttributes.clear();
    this.fileList = [];
    this.srcImage = product.Image;
    this.srcCloudImg = product.ImageCloudLink;
    if (this.srcCloudImg != null && this.srcCloudImg.length > 0)
      this.srcImage = this.srcCloudImg;
    this.formData.patchValue(product);

    if (
      product != null &&
      product.ProductImages != null &&
      product.ProductImages.length > 0
    ) {
      this.fileList = product.ProductImages.map(
        (x: ProductImage, i: number) => {
          var imgUrl = '';
          if (x.ImageCloudLink != null && x.ImageCloudLink.length > 0)
            imgUrl = x.ImageCloudLink;
          else imgUrl = environment.hostImage + x.Image;
          return {
            uid: i.toString(),
            name: i.toString(),
            status: 'done',
            url: imgUrl,
          };
        }
      );
    }

    if (
      product.ProductAttributes != null &&
      product.ProductAttributes.length > 0
    ) {
      product.ProductAttributes.forEach((x: ProductAttribute) => {
        const id = x.AttributeId;
        const attr = x.Value?.split(',') ?? [];
        this.ProductAttributes.push(
          new FormGroup({
            AttributeId: new FormControl(id),
            Attributes: new FormControl(attr),
          })
        );
      });
    }

    if (product.ProductRelateds != null && product.ProductRelateds.length > 0) {
      this.formData.patchValue({
        ProductRelateds: product.ProductRelateds.map(
          (x: ProductRelated) => x.ProductRelatedId
        ),
      });
    }

    this.getMenu();
    this.getAllProduct();
  }

  getAllProduct() {
    this.productService.getAll().subscribe({
      next: (resp: any) => {
        this.allProducts = JSON.parse(resp['data']);
      },
      error: (err) => {
        this.messageService.error('Không thành công!');
      },
    });
  }

  getAttribute() {
    this.attributeService.get({}).subscribe({
      next: (resp: any) => {
        this.attribute = JSON.parse(resp['data']);
      },
      error: (err) => {
        this.messageService.error('Không thành công!');
      },
    });
  }

  getMenu() {
    this.menuService.getByType(['san-pham']).subscribe((resp: any) => {
      this.menus = JSON.parse(resp['data']);
    });
  }

  changeName(e: any) {
    this.formData.patchValue({
      Alias: DataHelper.unsign(this.formData.get('Name')?.value ?? ''),
    });
  }

  onloadImage(src: string) {
    this.srcImage = src;
    this.formData.get('Image')?.setValue(src);
  }

  close() {
    this.visible = false;
  }

  addAttribute() {
    this.ProductAttributes.push(
      this.formBuilder.group({
        AttributeId: null,
        Attributes: [],
      })
    );
  }

  deleteAttribute(index: number) {
    this.ProductAttributes.removeAt(index);
  }

  submit() {
    for (const i in this.formData.controls) {
      if (this.formData.controls.hasOwnProperty(i)) {
        this.formData.controls[i].markAsDirty();
        this.formData.controls[i].updateValueAndValidity();
      }
    }
    if (this.formData.invalid) {
      return;
    }
    //hmtien add 26/8
    if (this.formData.get('Quantity')?.value < 0) {
      this.messageService.error('Số lượng không hợp lệ');
      return;
    }

    let dataForm = this.formData.getRawValue();

    if (dataForm.ProductAttributes != null) {
      let productAttributes: ProductAttribute[] =
        dataForm.ProductAttributes.map((x: any) => {
          return {
            AttributeId: x.AttributeId,
            Value: x.Attributes.join(','),
          };
        });

      dataForm.ProductAttributes = productAttributes;
    }
    let productImages: ProductImage[] = this.fileList.map((x) => {
      return {
        Id: 0,
        ProductId: 0,
        Image: x.thumbUrl ?? x.url?.toString().split('/').pop() ?? '',
        ImageCloudLink: '',
      };
    });
    console.log(productImages);
    dataForm.ProductImages = productImages;

    if (dataForm.ProductRelateds != null) {
      let productRelateds: ProductRelated[] = dataForm.ProductRelateds.map(
        (x: any) => {
          return {
            Id: 0,
            ProductId: 0,
            ProductRelatedId: x,
          };
        }
      );

      dataForm.ProductRelateds = productRelateds;
    }

    this.onSubmit.emit(dataForm);
  }
}

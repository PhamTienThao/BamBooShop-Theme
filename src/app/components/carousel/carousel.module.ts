import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from './carousel.component';
import { HostImageBannerClientPipe } from 'src/app/core/pipe/host-image-banner-client.pipe';



@NgModule({
  declarations: [
    CarouselComponent,
    HostImageBannerClientPipe,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CarouselComponent
  ]
})
export class CarouselModule { }

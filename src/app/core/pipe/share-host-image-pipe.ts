import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'sharePipeHostImage'
})
export class ShareHostImagePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): string {
    if (value == null || value =='')
      {
        value = "no_img.jpg";
        //value = "https://cloudinary.com/console/c-5aa65bbe96caef200dc8dd1255111a/media_library/folders/c2016fdb2c09279fec6725a644d89601fc/asset/428a879dd5f7dfb93d0ff83886c08336/manage?context=manage"
      }    
      else if((value as string).indexOf("https://res.cloudinary.com/") >=0)
      return value as string;
    else if ((value as string).indexOf("data:image/png;base64,") >= 0)
      return value as string;
    return environment.hostImage + value;
  }

}
import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'hostImageBannerClient'
})
export class HostImageBannerClientPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): string {
    if (value == null || value == '')
      value = "no_img.jpg";
    else if ((value as string).indexOf("data:image/png;base64,") >= 0)
      return value as string;
    return environment.hostImage + value;
  }

}

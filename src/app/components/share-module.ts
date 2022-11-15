import { TableTemplateComponent } from 'src/app/components/table-template/table-template.component';
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DENgZorroAntdModule } from '../ng-zorro-antd.module';
import { PipeHostImagePipe } from '../core/pipe/pipe-host-image.pipe';
import { ShareHostImagePipe } from '../core/pipe/share-host-image-pipe';

@NgModule({
    imports: [CommonModule,DENgZorroAntdModule],
    declarations: [ShareHostImagePipe],
    providers: [],
    exports: [],
 })
 export class SharedModule { }
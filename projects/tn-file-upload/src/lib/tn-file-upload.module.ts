import { NgModule } from '@angular/core';
import { TnFileUploadComponent } from './tn-file-upload.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [TnFileUploadComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [TnFileUploadComponent]
})
export class TnFileUploadModule { }

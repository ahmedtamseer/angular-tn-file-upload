import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  demoForm: FormGroup;
  ngModalExample: any;

  constructor() {
    this.demoForm = new FormGroup({
      accept: new FormControl('image/*'),
      multiple: new FormControl('false'),
      displayFile: new FormControl('true'),
      displayName: new FormControl('true'),
      displaySize: new FormControl('true'),
      hidden: new FormControl('false'),
      base64: new FormControl('false'),
      isDisabled: new FormControl('false'),
      maxFileCount: new FormControl(10),
      class: new FormControl(''),
      showCustomRemoveButton: new FormControl('true'),
      restrictSize: new FormControl(1),
      tn_file: new FormControl('')
    });

    // this.demoForm.patchValue({
    //   tn_file: ['https://ourcodeworld.com/public-media/articles/articleocw-5ab67235cd941.png']
    // })

    // this.ngModalExample = ['https://ourcodeworld.com/public-media/articles/articleocw-5ab67235cd941.png'];

    this.demoForm.get('tn_file').valueChanges.subscribe(console.log);
  }
}

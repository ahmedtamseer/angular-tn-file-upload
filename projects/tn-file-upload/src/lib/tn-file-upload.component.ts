import { Component, OnInit, SimpleChanges, ViewChild, Input, forwardRef, ElementRef, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

const UPLOAD_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TnFileUploadComponent),
  multi: true,
};

interface Base64Obj {
  url: string | ArrayBuffer;
  name?: string;
  size?: number;
  status?: string;
  type?: string;
  ext?: string;
  preExt?: string;
  file?: File
}

interface FileAndBase64 {
  file: File;
  base64?: Base64Obj;
}

@Component({
  selector: 'tn-file-upload',
  templateUrl: './tn-file-upload.component.html',
  styleUrls: ['./tn-file-upload.component.css'],
  providers: [UPLOAD_VALUE_ACCESSOR]
})
export class TnFileUploadComponent implements OnInit, OnDestroy {

  @Input('multiple') multiple: boolean = false;
  @Input('accept') accept: string = '*/*';
  @Input('class') class: string = '';
  @Input('maxFileCount') maxFileCount: number = 10;
  @Input('displayFile') displayFile: boolean = true;
  @Input('displayName') displayName: boolean = true;
  @Input('displaySize') displaySize: boolean = true;
  @Input('hidden') hidden: boolean = false;
  @Input('base64') base64: boolean = false;
  @Input('showCustomRemoveButton') showCustomRemoveButton: boolean = true;
  @Input('restrictSize') restrictSize: number = 5;
  @Input('isDisabled') isDisabled: boolean = false;

  @ViewChild('tnFileUploader', { static: false }) tnFileUploader: ElementRef;

  msg: string = '';
  files: File[] | Base64Obj[] = [];
  images: Base64Obj[] = [];
  pdfPath: string = '';
  showSpinner: boolean = false;
  dontReadFile = this.displayFile && this.displayName && this.displaySize && !this.hidden;
  value: any = '';

  constructor(
    public sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.dontReadFile = !(this.displayFile && this.displayName && this.displaySize && !this.hidden);
    this.showCustomRemoveButton = !this.showCustomRemoveButton ? false : this.showCustomRemoveButton && (this.displayFile || this.displayName || this.displaySize || this.hidden);

    if (changes['clearFieldAfterCustomUploading'] && changes['clearFieldAfterCustomUploading'].currentValue) {
      this.tnRemoveAll();
    } else {
      if (changes['multiple'] && changes['multiple'].currentValue && this.maxFileCount == 1) {
        this.maxFileCount = 5;
      }
    }
  }

  onChange = (change: any) => {
  };

  onTouched = () => { };

  writeValue(value: string | any): void {
    this.value = value || '';
if (typeof this.value == "string" && this.value) {
      this.images = [{ url: this.value }];
      this.files = [];
    } else if (Array.isArray(this.value) && this.value.length > 0) {
      this.images = [];
      this.files = [];
      Array.from(this.value).map(img => {
        this.images.push({ url: img });
      })
    }
  }

  pushChanges(value: any) {
    this.onChange(value);
  }

  registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => {}): void { this.onTouched = fn; }

  setDisabledState(_isDisabled: boolean): void {
    this.isDisabled = this.isDisabled;
    }

  isFileSizeGreatorThanMaxSize(file: File) {
    return (file.size / Math.pow(1024, 2)) <= this.restrictSize;
  }


  async tnImportFile(e) {
    this.msg = '';
    let eFiles = e.target || e.srcElement;

    this.images = [];
    let notUploadedCount = 0, maxUploadLimit = 0;

    if (eFiles.files && eFiles.files.length) {
      this.showSpinner = true;

      this.files = Array.from(eFiles.files) as File[];
      let _tempFiles: File[] = [];

      for (let i = 0; i < this.files.length; i++) {
        if (i != 0 && !this.multiple) {
          break;
        }

        if (this.isFileSizeGreatorThanMaxSize(this.files[i]) && (i + 1 <= this.maxFileCount )) {
          const file: FileAndBase64 | string | any = await this.readFile(this.files[i]).catch(console.log);
          if (file) _tempFiles.push(file.file);
        } else {
          if(i + 1 > this.maxFileCount ) maxUploadLimit++; else notUploadedCount++;
        }

      }
      this.files = _tempFiles;

      if (notUploadedCount) this.msg += `${notUploadedCount} file is / are greator than ${this.restrictSize} MB. `;
      if (maxUploadLimit) this.msg += `${maxUploadLimit} file could not be addded. Max files count is ${this.maxFileCount}. `;

      this.emitChange();

      _tempFiles = undefined;
      this.showSpinner = false;


    }
  }

  emitChange() {
    this.onChange(this.base64 ? (this.multiple ? this.images: this.images[0]) : (this.multiple ? this.files: this.files[0]));
    this.files = [];
  }

  private readFile(file: File): Promise<FileAndBase64 | string> {
    return new Promise((resolve, reject) => {
      try {

        if (this.dontReadFile) return resolve({ file });

        const _fileReader = new FileReader();

        _fileReader.onload = event => {
          const base64: Base64Obj = {
            file,
            url: _fileReader.result as string,
            name: file.name,
            size: file.size,
            status: '',
            type: file.type,
            ext: file.type.indexOf('/') != -1 ? file.type.split('/')[1] : '',
            preExt: file.type.indexOf('/') != -1 ? file.type.split('/')[0] : ''
          }
          this.images.push(base64);
          return resolve({ file, base64 });
        }
        _fileReader.onerror = () => {
          return resolve('');
        }
        _fileReader.readAsDataURL(file);

      } catch (error) {
        return resolve('');
      }
    })
  }

  private tnRemoveAll(err?: any) {
    this.files = [];
    this.images = [];
    this.tnFileUploader.nativeElement.value = "";
    this.msg = '';
    this.value = ''
    if (!err)
      if (this.multiple)
        this.onChange([])
      else
        this.onChange('')
  }

  private tnRemove(index) {
    if (!isNaN(index) && this.files.length > 0 && index < this.files.length) {
      this.files.splice(index, 1);
      this.images.splice(index, 1);
      if (this.files.length == 0) { this.tnRemoveAll(); }
      else {
        this.onChange(!this.base64 ? this.files : this.images);
      }
    } else if (typeof index == "number" && index > -1 && this.images.length) {
      this.images.splice(index, 1);
      if (this.images.length == 0) {
        this.tnRemoveAll();
      } else {
        this.onChange(this.images);
      }
    }
  }

  ngOnDestroy() {
    this.accept = this.class = this.files = this.images = this.maxFileCount = this.value = undefined;
    this.dontReadFile = this.showCustomRemoveButton = this.restrictSize = this.pdfPath = this.multiple = undefined;
    this.base64 = this.displayFile = this.displayName = this.displaySize = this.hidden = this.msg = undefined;
  }

}

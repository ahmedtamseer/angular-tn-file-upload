# TnFileUpload
The [Angular](https://angular.io/) library for [input type file](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file).

```bash
ng add @ahmedtamseer/tn-file-upload
```

## What is TnFileUpload?

TnFileUpload is angular package for form element (input:file). This package gives new look and good user experience both reactive and template driven forms. This package can return both type File or Base64 value.

## Quickstart

### 1. Create a new project

```bash
npm install -g @angular/cli
ng new <project-name>
cd <project-name>
```

The Angular CLI's `new` command will set up the latest Angular build in a new project structure.

### 2. Install Angular Form Error

```bash
ng add @ahmedtamseer/tn-file-upload
```

Now that you have a new project setup, install Angular Form Error from npm.

### 3. Setup `@NgModule` for the `TnFileUploadModule`

Open `/src/app/app.module.ts`, inject the TnFileUploadModule.

```ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TnFileUploadModule } from '@ahmedtamseer/tn-file-upload';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    TnFileUploadModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### 4. Use it in your component

```ts
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  template: `
  <form [formGroup]="demoForm">
    <div>
        <label for="file">File</label>
         <tn-file-upload [(ngModel)]="ngModalExample" #name="ngModel"></tn-file-upload>
    </div>
  </form>
  `
})
export class MyApp {

  demoForm: FormGroup;

  constructor() {
      this.demoForm = new FormGroup({
      file: new FormControl('')
    });
  }
}
```

### 5. Run your app locally

```bash
ng serve
```

## Resources

[Stackblitz Template](https://stackblitz.com/edit/tn-file-upload) - A demo app which shows how to use package for Reactive and Template Driven form.

## Developer Guide

| attribute   | purpose            |
| ---------|--------------------|
| `[multiple]` | Boolean. A Boolean which, if present, indicates that the user may choose more than one file. Default `false` |
| `[maxFileCount]` | Number. Maximum number of files a user can select. This applies only when `[multiple]="true"`. Default `10` |
| `[restrictSize]` | Number. Maximum size of file/s. This value is in MB. Default `5` |
| `[accept]` | String. One or more unique file type specifiers describing file types to allow. [KnowMore](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#Unique_file_type_specifiers) Default `*/*` |
| `[displayFile]` | Boolean. Whether or not to display (preview) file after selection. Default `true` |
| `[displayName]` | Boolean. Whether or not to display file name after selection. Default `true` |
| `[displaySize]` | Boolean. Whether or not to display file size after selection. Default `true` |
| `[showCustomRemoveButton]` | Boolean. Whether or not allow user to remove a file. Default `true` |
| `[hidden]` | Boolean. This hides input element. Default `false` |
| `[isDisabled]` | Boolean. Disabled property of html. Default `false` |
| `[base64]` | Boolean. Setting this to true will return base64 value along with original file. Default `false` |
| `[class]` | String. List of classes separated by space. Ex:- `[class]="'bg-danger text-white'"` |

## Base64 return value

```ts
{
  url: string;
  name?: string;
  size?: number;
  status?: string;
  type?: string;
  ext?: string;
  preExt?: string;
  file?: File
}

```



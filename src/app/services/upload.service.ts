import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private http = inject(HttpClient);


  dataFiles: any[] = [];
  dataImages: any[] = [];
  progress: any;
  progressObserver: any;
  img: any;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor () {
    this.progress = new Observable(observer => {
      return this.progressObserver = observer;
    });
  }

  public filePreview(files: any):Observable<any> {
    this.dataFiles = [];
    this.dataImages = [];
    for (let i = 0; i < files.length; i++) {
      if(files[i].type == 'image/jpeg' || files[i].type == 'image/png'){
        let reader = new FileReader();
        reader.onload = () => {
          this.img = document.createElement("img");
          this.img.src = reader.result;
          this.resize(this.img, 1600, 1600, files[i].type, (resized_img, file_data)=>{
            this.dataImages.push(resized_img);
            this.dataFiles.push(file_data);
          });
        };
        reader.readAsDataURL(files[i]);
      }
      else 
        this.dataFiles.push(files[i]);
    }
    let data = [{images: this.dataImages, files: this.dataFiles}];
    return of(data);
  } 

  public fileUpload (url: string, params: any, files: any) {    
    let formData: FormData = new FormData(),
        xhr: XMLHttpRequest = new XMLHttpRequest();

    for (let i = 0; i < files.length; i++) {
      let type;
      let typeImage = false;

      if(files[i].type == 'application/msword')
        type = '.doc';
      if(files[i].type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        type = '.docx';
      if(files[i].type == 'application/vnd.ms-excel')
        type = '.xls';
      if(files[i].type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        type = '.xlsx';
      if(files[i].type == 'application/pdf')
        type = '.pdf';

      if(files[i].type == 'image/x-citrix-jpeg'){
        type = '.jpg';
        typeImage = true;
      }
      if(files[i].type == 'image/jpeg'){
        type = '.jpg';
        typeImage = true;
      }
      if(files[i].type == 'image/png'){
        type = '.png';
        typeImage = true;
      }
      if(files[i].type == 'image/gif'){
        type = '.gif';
        typeImage = true;
      }
      
      let hash = (new Date().getTime()).toString(36);
      let fName = hash+'_'+files[i].name+'_'+i+type;
      let iName = 'uploads['+i+']';
      formData.append(iName, files[i], files[i].name);
    }
    
    formData.append("contact_id", params);

    return this.http.post(url, formData, {
      reportProgress: true,
      observe: 'events'
    });   
  }

  resize(img, MAX_WIDTH:number, MAX_HEIGHT:number, img_type:string, callback){
    return img.onload = () => {
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      
      let canvas = document.createElement("canvas");
    
      canvas.width = width;
      canvas.height = height;
      var ctx:any = canvas.getContext("2d");  

      ctx.drawImage(img, 0, 0,  width, height); 
      let dataUrl = canvas.toDataURL(img_type);
      var blobBin = atob(dataUrl.split(',')[1]);
      var array: any[] = [];
      for(var i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i));
      }
      var data_file = new Blob([new Uint8Array(array)], {type: img_type});

      callback(dataUrl, data_file);
    };
  }

}
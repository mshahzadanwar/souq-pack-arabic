import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {CommonService} from './../common.service';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
};

@Injectable({
  providedIn: 'root'
})
export class CustomizerService {

  apiUrl = "";

  constructor(
    private http: HttpClient,
    private common:CommonService
    ) {

      this.apiUrl = common.apiUrl;
     }


  public getData(form:any) {
    console.log(form);
    form.is_guest = this.common.is_guest;
    form.guest_id=this.common.guest_id;
    form.token = this.common.myToken;
    
    return this.http.post(this.apiUrl +'get_cust_cats',form,httpOptions);
  }
  public orderNow(form:any,lan_id) {
    console.log(form);
    form.is_guest = this.common.is_guest;
    form.guest_id=this.common.guest_id;
    form.token = this.common.myToken;
    form.lang_id = lan_id;
    form.from_web = 1;
    return this.http.post(this.apiUrl +'custom_order',form,httpOptions);
  }
  postFile(fileToUpload: File) {
    const formData: FormData = new FormData();
    formData.append('photo', fileToUpload, fileToUpload.name);
    return this.http
      .post(this.apiUrl+"logo_file", formData );
}



is_logged(data)
{

  var token = JSON.parse(data);
  return this.http.post(
    this.apiUrl+"check_login",
    {is_guest:token.is_guest,token:token.token,guest_id:token.guest_id},httpOptions);
}
  
}

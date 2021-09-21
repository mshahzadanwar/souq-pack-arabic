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
export class VcustomizerService {

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
    return this.http.post(this.apiUrl +'get_cust_ord',form,httpOptions);
  }
  public orderNow(form:any) {
    console.log(form);
    form.is_guest = this.common.is_guest;
    form.guest_id=this.common.guest_id;
    form.token = this.common.myToken;
    return this.http.post(this.apiUrl +'custom_order',form,httpOptions);
  }
  postFile(fileToUpload: File) {
    const formData: FormData = new FormData();
    formData.append('photo', fileToUpload, fileToUpload.name);
    return this.http
      .post(this.apiUrl+"logo_file", formData );
}

public submit_bank_details(form:any){
    form.is_guest = this.common.is_guest;
    form.guest_id=this.common.guest_id;
    form.token = this.common.myToken;
    return this.http.post(this.apiUrl +'upload_bank_data',form,httpOptions);
}

public posTComment(form:any){
  form.is_guest = this.common.is_guest;
  form.guest_id=this.common.guest_id;
  form.token = this.common.myToken;
  return this.http.post(this.apiUrl +'post_comment_customer',form,httpOptions);
}

public rejectDelivery(form:any) {
  console.log(form);
  form.is_guest = this.common.is_guest;
  form.guest_id=this.common.guest_id;
  form.token = this.common.myToken;
  return this.http.post(this.apiUrl +'reject_delivery',form,httpOptions);
}
public acceptDelivery(form:any) {
  console.log(form);
  form.is_guest = this.common.is_guest;
  form.guest_id=this.common.guest_id;
  form.token = this.common.myToken;
  return this.http.post(this.apiUrl +'accept_delivery',form,httpOptions);
}
  
}

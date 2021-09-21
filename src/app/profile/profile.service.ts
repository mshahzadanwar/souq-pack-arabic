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
export class ProfileService {

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
    console.log(this.apiUrl +'get_mydashboard');
    console.log(form);
    return this.http.post(this.apiUrl +'get_mydashboard',form,httpOptions);
  }
  public updateProfile(form:any) {
    console.log(form);
    form.is_guest = this.common.is_guest;
    form.guest_id=this.common.guest_id;
    form.token = this.common.myToken;
    return this.http.post(this.apiUrl +'update_profile',form,httpOptions);
  }
  public addOrUpdateAddress(form:any,id:any)
  {
    console.log(form);
    form.is_guest = this.common.is_guest;
    form.guest_id=this.common.guest_id;
    form.token = this.common.myToken;
    form.id = id;

    if(id==0)
    return this.http.post(this.apiUrl +'store_address',form,httpOptions);
    else
    return this.http.post(this.apiUrl +'update_address',form,httpOptions);
  }
  public cancelformsubmit(form:any,isd:any)
  {
    form.is_guest = this.common.is_guest;
    form.guest_id=this.common.guest_id;
    form.token = this.common.myToken;
    form.id = isd;
   
    return this.http.post(this.apiUrl +'cancel_order_web',form,httpOptions);

  }
  public get_phone_pickerss(form:any) {
    return this.http.post(this.apiUrl+'get_phone_picker',form,httpOptions);
  }
  public Refundformsubmit(form:any,isd:any)
  {
    form.is_guest = this.common.is_guest;
    form.guest_id=this.common.guest_id;
    form.token = this.common.myToken;
    form.id = isd;
   
    return this.http.post(this.apiUrl +'refund_order_web',form,httpOptions);

  }
}

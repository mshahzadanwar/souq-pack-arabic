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
export class CheckoutService {

  apiUrl = "";

  constructor(
    private http: HttpClient,
    private common:CommonService
    ) {

      this.apiUrl = common.apiUrl;
     }


  
  public orderNow(form:any) {
    form.is_guest = this.common.is_guest;
    form.guest_id=this.common.guest_id;
    form.token = this.common.myToken;
    form.lang_id = this.common.selectedLang;
    form.region_id = this.common.selectedRegion;
    return this.http.post(this.apiUrl +'new_order_web',form,httpOptions);
  }

  public get_shipping_address_user(form:any) {
    form.is_guest = this.common.is_guest;
    form.guest_id=this.common.guest_id;
    form.token = this.common.myToken;
    form.region_id = this.common.selectedRegion;
    return this.http.post(this.apiUrl +'get_shipping_address_user',form,httpOptions);
  }
  
}

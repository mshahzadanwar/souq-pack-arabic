
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
export class PaynowService {

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
    return this.http.post(this.apiUrl +'new_order_web',form,httpOptions);
  }
  public getOrder(form:any) {
    form.is_guest = this.common.is_guest;
    form.guest_id=this.common.guest_id;
    form.token = this.common.myToken;
    return this.http.post(this.apiUrl +'get_order_web',form,httpOptions);
  }
  public getPayfort(form:any) {
    form.is_guest = this.common.is_guest;
    form.guest_id=this.common.guest_id;
    form.token = this.common.myToken;
    return this.http.post(this.apiUrl +'get_payfort',form,httpOptions);
  }
  public notifyServer(form:any,order_id:any)
  {
    return this.http.post(this.apiUrl+"save_order",{order_id:order_id,raw_data:form},httpOptions);
  }
}

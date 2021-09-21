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
export class PdetailSerive {

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
    console.log("agy");
    return this.http.post(this.apiUrl +'get_product_details/'+form.slug+'/'+form.lang_id,form,httpOptions);
  }
  public postReview(form:any,id:number=0)
  {
    console.log(form);
    form.is_guest = this.common.is_guest;
    form.guest_id=this.common.guest_id;
    form.token = this.common.myToken;
    form.order_id = id;
    form.type=2;
    console.log("agy");
    return this.http.post(this.apiUrl +'submit_review/'+form.slug+'/'+form.lang_id,form,httpOptions);
  }
}

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
export class CategoryService {

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
    return this.http.post(this.apiUrl +'get_cat_data',form,httpOptions);
  }
  
}

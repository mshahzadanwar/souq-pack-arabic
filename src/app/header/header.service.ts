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
export class HeaderService {

  apiUrl = "";

  constructor(
    private http: HttpClient,
    private common:CommonService
    ) {

      this.apiUrl = common.apiUrl;
     }


  public getCats(form:any) {
    return this.http.post(this.apiUrl +'get_categories',form,httpOptions);
  }
  public getImpData(form:any) {
    
    return this.http.post(this.apiUrl +'get_important_data',form,httpOptions);
  }
  public getip()
  {
    return this.http.get("https://ipinfo.io/?token=f4f44d182614d6");
  }
}

import { Injectable,Inject } from '@angular/core';
import { Observable ,  of ,  BehaviorSubject } from 'rxjs';
import{ settings,logged,signup} from './../_models/commonModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { ActivatedRoute,Router } from '@angular/router';
import {CommonService} from './../common.service';
import 'rxjs/Rx';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
}; 
@Injectable()
export class ForgotPasswordServiceService {

 
  constructor(
    @Inject('Window') private window: Window,
    private route:ActivatedRoute,
    private router:Router,
    private http: HttpClient,
    private common:CommonService
  ) {  }

  php_url = this.common.apiUrlPhp;
  // client_url = this.common.client_url;
  app_url = this.common.apiUrl;


  isLogged()
  {
    this.http.get<logged>(this.app_url+'?q=islogged').subscribe((data)=>{
      if(data.logged==1)
      {
        return true;
      }
      return false;
    });
  }
  auth()
  {
    this.http.get<logged>(this.app_url+'?q=islogged').subscribe((data)=>{
      if(data.logged==1)
      {
        return true;
      }
      else{
        this.window.location.href=this.app_url+'login';
        // this.router.navigate(['/login']);
      }
    });
  }
  public doReset(form:any) {
    return this.http.post<logged>(this.app_url+'forgot_pw',form,httpOptions);
    //return this.http.post(this.app_url+'?q=doReset',form,httpOptions);
  }}
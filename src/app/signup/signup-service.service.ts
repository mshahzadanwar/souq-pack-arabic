import { Injectable,Inject } from '@angular/core';
import{ logged} from './../_models/commonModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute,Router } from '@angular/router';
import {CommonService} from './../common.service';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Rx';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
}; 
@Injectable()
export class SignupServiceService {

 
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
    this.http.post<logged>(this.app_url+'check_login',{token:this.common.token},httpOptions).subscribe((data)=>{
      if(data.action=="success")
      {
        return true;
      }
      return false;
    });
  }
  auth()
  {


    this.http.post<logged>(this.app_url+'check_login',{token:this.common.token},httpOptions).subscribe((data)=>{
      if(data.action=="success")
      {
        return true;
      }
      else{
        this.window.location.href=this.app_url+'login';
      }
    });
    // this.http.get<logged>(this.app_url+'check_login').subscribe((data)=>{
    //   if(data.logged==1)
    //   {
    //     return true;
    //   }
    //   else{
    //     this.window.location.href=this.app_url+'login';
    //     // this.router.navigate(['/login']);
    //   }
    // });
  }
  

  public doSignup(form:any) {
    form.lang_id = this.common.selectedLang;
    return this.http.post(this.app_url+'signup',form,httpOptions);
  }
  public get_phone_pickerss(form:any) {
    return this.http.post(this.app_url+'get_phone_picker',form,httpOptions);
  }
  

  public socialLoggin(form:any): Observable<logged> {
    return this.http.post<logged>(this.app_url+'social_fb',form,httpOptions);
  }

  public setOrders(id:string): Observable<logged> {
    return this.http.post<logged>(this.app_url+'update_order_junks',{order_id:id,is_guest:0,token:this.common.myToken},httpOptions);
  }


}


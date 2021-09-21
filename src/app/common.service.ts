
import { Injectable, ViewChild, ElementRef, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' })
};
import { DOCUMENT } from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  @ViewChild('cssTag') cssTag: ElementRef;

  selectedLang=1
  selectedRegion=1
  is_guest=1
  guest_id=0
  myToken=""
  // search=
  // currency="$"

  private notification_pre = new BehaviorSubject({ shown: false, text: '', warning: false, error: false, sticky: false });
  notification_after = this.notification_pre.asObservable();

  private screen_blocker_pre = new BehaviorSubject({ shown: false});
  screen_blocker_after = this.screen_blocker_pre.asObservable();

  private is_cust_screen_pre = new BehaviorSubject(false);
  is_cust_screen_after = this.is_cust_screen_pre.asObservable();


  temp_token = localStorage.getItem('User');
  private token_ = new BehaviorSubject(this.temp_token);
  token = this.token_.asObservable();



  temp_search = {category:0,search:""};
  private search_ = new BehaviorSubject(this.temp_search);
  search = this.search_.asObservable();


  temp_imp = {};
  private imp_ = new BehaviorSubject(this.temp_imp);
  imp = this.imp_.asObservable();

  t_temp_cart = localStorage.getItem('cart_items');
  temp_cart = this.t_temp_cart!=null?JSON.parse(this.t_temp_cart):[];
  private cart_items_ = new BehaviorSubject(this.temp_cart);
  cart_items = this.cart_items_.asObservable();


  doc = DOCUMENT;

  t_temp_curr = localStorage.getItem('imp_data');
  temp_curr_2 = this.t_temp_curr!=null?JSON.parse(this.t_temp_curr):{currency:"$"};
  private currency_ = new BehaviorSubject(this.temp_curr_2.currency);
  currency = this.currency_.asObservable();
  document:any;

  constructor(
    private http: HttpClient,
    @Inject(DOCUMENT) document
    ) {
    this.setItem("lang_id",1);
    this.fire_first_shot();
    this.document=document;
   }
   public fire_first_shot()
   {
    this.getItem("lang_id").then((i)=>{
      if(i!=null)
      {

        this.is_guest=0
        if(i=="2"){
          localStorage.removeItem('home_date');
        }
        //this.selectedLang = parseInt( i );
        this.selectedLang = 1;
      }
      else{
        localStorage.removeItem('home_date');
        this.selectedLang = 1;
      }

      this.getItem("region_id").then((i)=>{
        
        if(i!=null)
        {
  
          this.selectedRegion = parseInt( i );
        }
        else{
          
        }
      });
      if(this.selectedLang==1)
      {
        this.go_full_arabic()
      }
      // this.go_full_arabic()
      this.getItem("login_data").then((data:any)=>{
        if(data!=null)
        {
          
          this.check_login(data)
        }
        else{
          
          this.install_guest();
        }
      })
      // this.selectedLang = parseInt( i );
  });
   }

   public removeGuest()
   {
     this.is_guest=0
     
   }

   go_full_arabic()
   {
    this.document.getElementById('theme').setAttribute('href','assets/rtl-style.css');
    this.document.getElementById('bootstrapCSS').setAttribute('href','assets/bootstrap/css/rbootstrap.min.css');
    // this.document.dir = "rtl";
   }

   public install_guest()
   {

    //console.log("Ok, I see you are not logged in");

    var new_guest_id=(new Date().getTime());
    
    this.getItem("guest_id").then((v)=>{
      if(v!=null)
      {
        new_guest_id = parseInt(v);
      }

      this.guest_id = new_guest_id;
      this.is_guest=1;
      this.http.post(this.apiUrl+"install_guest",{guest_id:new_guest_id,lang_id:this.selectedLang},httpOptions).subscribe((data:any)=>{
        this.setItem("guest_id",new_guest_id).then(()=>{
        })

        this.setItem("login_data",JSON.stringify(data.data)).then(()=>{
          this.update_token(data.data.token);
        })
      })
    })
     
   }

   public wish_me(product_id,do_add)
   {
     //console.log("i'm willing to post this data");
    this.http.post(this.apiUrl+"wish_me",{
      is_guest:this.is_guest,
      guest_id:this.guest_id,
      token:this.myToken,
      product_id:product_id,
      do_add:do_add
      
    },httpOptions).subscribe((data:any)=>{
      console.log("Im not required");
    });
   }

   check_login(data:any)
   {

    // this.install_guest();
     var token = JSON.parse(data);


    this.update_token(token.token);

    this.is_guest=token.is_guest;
    this.guest_id=token.guest_id;



     this.http.post(this.apiUrl+"check_login",{is_guest:this.is_guest,token:token.token,guest_id:this.guest_id},httpOptions).subscribe((data:any)=>{
      if(data.action=="success")
      {
        //console.log("Fake logged in, handle me now");
        var data = data.data;
      

        if(data.is_guest==1)
        {
          //console.log("I'll justify it by setting guest id");


          this.is_guest=1;
          this.guest_id=data.guest_id;


          //console.log(this.guest_id);

        }
        else{
          this.is_guest=0;
        }
        // data = JSON.parse(data);
        this.update_token(data.token);
      }
      
     })
    
   }

   update_token(token: any) {
    this.token_.next(token);
    this.myToken=token;
  }
  update_cust_screen(b){
    this.is_cust_screen_pre.next(b)
  }

  update_search(search: any) {
    this.search_.next(search);
    // this.mysearch=search;
  }

  update_imp(search: any) {
    this.imp_.next(search);
    // this.mysearch=search;
  }

  update_currency(currency: any) {
    this.currency_.next(currency);
    // this.myToken=token;
  }

  update_cart_items(cart_items: any) {
    this.cart_items_.next(cart_items);
    // this.cart_items=cart_items;
  }

  public setItem(key:any, value:any) {
      return Promise.resolve().then(function () {
          localStorage.setItem(key, value);
      });
  }
  public getItem(key:any) {
      return Promise.resolve().then(function () {
          return localStorage.getItem(key);
      });
  }

  notify(shown: boolean, text: string, warning: boolean, error: boolean, sticky: boolean) {
    let arr = { shown: shown, text: text, warning: warning, error: error, sticky: sticky };
    this.notification_pre.next(arr);
  }

  loading(shown: boolean) {
    let arr = { shown: shown};
    this.screen_blocker_pre.next(arr);
  }

  apiUrl = 'https://admin.souqpack.com/api/';
  apiUrlPhp = 'https://admin.souqpack.com/';
  webURL = 'https://souqpack.com/';

  // apiUrl = 'https://admin.ae.souqpack.com/api/';
  // apiUrlPhp = 'https://admin.ae.souqpack.com/';/

  // apiUrl = 'http://localhost/souqpack/api/';
  // apiUrlPhp = 'http://localhost/souqpack/';
  // webURL = 'https://souqpack.com/';
}

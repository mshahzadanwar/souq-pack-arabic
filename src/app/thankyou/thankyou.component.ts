// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-thankyou',
//   templateUrl: './thankyou.component.html',
//   styleUrls: ['./thankyou.component.css']
// })
// export class ThankyouComponent implements OnInit {

//   constructor() { 

//     selectedLang:2,
//   }

//   ngOnInit(): void {
//     console.log(this.selectedLang);
//   }

// }



import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { Router, NavigationEnd, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
// import {PaynowService} from './../paynow.service';
// import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal'

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css']
})
export class ThankyouComponent implements OnInit {
  // public payPalConfig?: IPayPalConfig;

  signup = {
    email:'jhgfdsytre',
    password:'hgfd',
    firstname:'jhgfd',
    lastname:'kjhg',
    phone:'qwert',
    country:"lkjhgfd",
    state:"qwerth",
    city:"kjhgds",
    zip:"qwsdg",
    address:"kjhg",
    address_2:"qwerghj",
    notes:"jhgf",
    total:"0",
    products:[]
  };
  nav_hidden=true;
  total="0";
  order_id="0";
  show_paypal=false;
  paypal_key="";
  payment_method=1;
  payfort:any={};
  show_payfort=false;
  my_email=""

  selectedLang=1
  currency="SAR"
  php_url=""
  userSubscription: Subscription;
  constructor(
    private cServie:CommonService,
    private router:Router,
    private route:ActivatedRoute,
    // private payService:PaynowService
  ) { 
    this.php_url=this.cServie.apiUrlPhp;

    var d = localStorage.getItem("login_data");
    var d2 = JSON.parse(d);
    this.my_email = d2.email || "dummy@souqpack.com";
    
  }

  toggleNav()
  {
    this.nav_hidden = !this.nav_hidden;
  }

  ngOnInit(): void {
      setTimeout(()=>{
        this.selectedLang = this.cServie.selectedLang;
        this.cServie.imp.subscribe((data:any)=>{
          this.currency=data.currency;
        })
      },700);
  }
  fix2(val)
  {
    return parseFloat(val.toString()).toFixed(2);
  }
  
}


import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { Router, NavigationEnd, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import {PaynowService} from './paynow.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal'

@Component({
  selector: 'app-paynow',
  templateUrl: './paynow.component.html',
  styleUrls: ['./paynow.component.css']
})
export class PaynowComponent implements OnInit {
  public payPalConfig?: IPayPalConfig;

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
  currency="$"
  php_url=""
  userSubscription: Subscription;
  constructor(
    private cServie:CommonService,
    private router:Router,
    private route:ActivatedRoute,
    private payService:PaynowService
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



      this.userSubscription = this.route.params.subscribe(
          (params: Params) => {
            this.order_id = this.route.snapshot.paramMap.get('oid');

            this.get_order_();
            

    })
        // this.cServie.currency.subscribe((c)=>{
        //   this.currency=c;
        // })
        this.cServie.imp.subscribe((data:any)=>{
          this.currency=data.currency;
        })
      },700);
  }
  get_order_()
  {
    this.payService.getOrder({order_id:this.order_id}).subscribe((data:any)=>{
      if(data.action=="success")
      {
        this.total = data.data.total;
        this.payment_method = data.data.payment_method;
        this.paypal_key = data.paypal_key;
        this.order_id = this.order_id; 
        if(this.payment_method==1)
        {
          this.show_paypal=true;
          this.initConfig();
        }
        else{
          this.fire_payfort();
        }
        
      }
      else
      {
        this.cServie.notify(false,"Who are you?",true,false,false);
      }
    });
  }

  fire_payfort()
  {
    this.payService.getPayfort({order_id:this.order_id}).subscribe((data:any)=>{
      if(data.action=="success")
      {
        this.payfort=data.payfort;
        this.show_payfort=true;
      }
      else{

      }
    });
  }

  private initConfig(): void {
    this.payPalConfig = {
    currency: 'USD',
    clientId: this.paypal_key,
    createOrderOnClient: (data) => <ICreateOrderRequest>{
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: this.total,
            
          }
        }
      ]
    },
    advanced: {
      commit: 'true'
    },
    style: {
      label: 'paypal',
      layout: 'vertical'
    },
    onApprove: (data, actions) => {
      console.log('onApprove - transaction was approved, but not authorized', data, actions);
      actions.order.get().then(details => {
        console.log('onApprove - you can get full order details inside onApprove: ', details);
      });
    },
    onClientAuthorization: (data) => {
      console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      this.payService.notifyServer(data,this.order_id).subscribe((data2:any)=>{
        if(data2.action=="success")
        {
          this.cServie.notify(true,"Thank You for the payment, we'll process your order soon",false,false,false);
          this.router.navigate(["/"]);
        }
        else{

        }
      })
      
    },
    onCancel: (data, actions) => {

      console.log('OnCancel', data, actions);
    },
    onError: err => {
      console.log('OnError', err);
    },
    onClick: (data, actions) => {
      console.log('onClick', data, actions);
    },
  };
  }

 

  onSubmit(form)
  {
   
  }

  fix2(val)
  {
    return parseFloat(val.toString()).toFixed(2);
  }
  
 
}

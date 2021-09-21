
import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { Router, NavigationEnd } from '@angular/router';
import{CartService} from './../cart/cart.service';
import{CheckoutService} from './checkout.service';
import { SEOService } from './../seo.service';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  // signup = {
  //   currency:"",
  //   email:'jhgfdsytre',
  //   password:'hgfd',
  //   firstname:'jhgfd',
  //   lastname:'kjhg',
  //   phone:'qwert',
  //   country:"lkjhgfd",
  //   state:"qwerth",
  //   city:"kjhgds",
  //   zip:"qwsdg",
  //   address:"kjhg",
  //   address_2:"qwerghj",
  //   notes:"jhgf",
  //   total:"0",
  //   payment_method:4,
  //   products:[]
  // };

  signup = {
    currency:"",
    email:'',
    password:'',
    firstname:'',
    lastname:'',
    phone:'',
    country:"",
    state:"",
    city:"",
    zip:"",
    address:"",
    address_2:"",
    notes:"",
    total:"0",
    payment_method:3,
    products:[]
  };
  cats = [];
  nav_hidden=true;
  cart_items=[];
  pre_total=0;
  dis_applied=false;
  dis_text="";
  dis_id=0;
  discount={coupon:""};
  total=0;
  currency="$"
  php_url=""
  constructor(
    private cServie:CommonService,
    private router:Router,
    private cartService:CartService,
    private chServie:CheckoutService,
    private seoService: SEOService,
  ) { 
    this.php_url=this.cServie.apiUrlPhp;
    
    this.dis_id = parseInt( localStorage.getItem("dis_id"));
    this.look_after_cart();
  }

  look_after_cart()
  {
    this.cServie.cart_items.subscribe((cart_items)=>{
      this.cart_items = cart_items;
      this.update_total()
    })
  }
  update_total()
  {
    var total = 0;

    for(var i = 0; i<=this.cart_items.length-1; i++)
    {
      total += (this.cart_items[i].price * this.cart_items[i].qty);
    }

    this.total=total;
    this.pre_total = total;

    this.apply_code();
  }

  selectedLang=1

  toggleNav()
  {
    this.nav_hidden = !this.nav_hidden;
  }


  

  ngOnInit(): void {

     

      setTimeout(()=>{
      this.selectedLang = this.cServie.selectedLang;
      this.cServie.imp.subscribe((data:any)=>{
        //this.cServie.currency.subscribe((c)=>{
          this.currency=data.currency;
          // console.log("i am token");
          // this.cServie.getItem("login_data").then((data:any)=>{
          //   console.log(data);
          // });
          // this.cServie.imp.subscribe((data:any)=>{
            this.get_shipping_address_user();
              
          // })
        })
      },700);
      this.seoService.updateCanonicalUrl();
  }

  removeItem(ind)
  {
    var all = this.cart_items;
    all.splice(ind,1);
    this.cart_items=all;
    this.update_total();
    this.cServie.update_cart_items(this.cart_items);
    this.cServie.setItem("cart_items",JSON.stringify(this.cart_items));
  }


  QtyPlus(ind)
  {
    var all = this.cart_items;


    if(all[ind].qty>98) return;

    all[ind].qty = all[ind].qty + 1;

    // this.cart_items=all;

    this.cServie.update_cart_items(all);
    this.cServie.setItem("cart_items",JSON.stringify(all));
  }
  QtyMinus(ind)
  {
    var all = this.cart_items;


    if(all[ind].min_qty==all[ind].qty)
    {
      
      this.cServie.notify(true,"Minimum required quantity is: "+all[ind].min_qty,true,false,false);
      return;
    }
    


    if(all[ind].qty==1) return;

    all[ind].qty = all[ind].qty - 1;

    // this.cart_items=all;

    this.cServie.update_cart_items(all);
    this.cServie.setItem("cart_items",JSON.stringify(all));
  }

  get_shipping_address_user()
  {
    this.chServie.get_shipping_address_user({}).subscribe((data:any)=>{
      //console.log(data);
      if(data.action=="success")
      {
        //this.signup = data.data;
        this.signup.firstname = data.data.firstname;    
        this.signup.lastname = data.data.lastname;    
        this.signup.address = data.data.address;    
        this.signup.city = data.data.city;    
        this.signup.zip = data.data.zip;    
        this.signup.state = data.data.state;    
        this.signup.phone = data.data.phone;  
        this.signup.email = data.data.email;
      }
      else{
        console.log("Coudn't load data");
      }
    })
  }
  onSubmit(form)
  {
    this.signup.total = this.fix2( this.total );
    this.signup.products = this.cart_items;
    this.signup.currency = this.currency;
    this.chServie.orderNow(this.signup).subscribe((data:any)=>{
      if(data.action=="success")
      {
        localStorage.setItem("cart_items",null);
        this.cServie.update_cart_items([]);

        //this.cServie.notify(true,"Your Order has been processed, Please proceed with the payment to complete order.",false,false,false);
        if(this.signup.payment_method==4)
        {
          this.router.navigate(['/']);
        }
        else{
          this.router.navigate(['/pay',data.order_id]);
        }
        
      }
      else{
        this.cServie.notify(true,data.error,true,false,false);
      }
    });
  }

  fix2(val)
  {
    return parseFloat(val.toString()).toFixed(2);
  }
  apply_code()
  {
    this.cartService.applyCouponS({id:this.dis_id}).subscribe((data:any)=>{
      if(data.action=="success")
      {
        var dis = data.data;

        this.dis_id = dis.id;
        this.pre_total = this.total;

        this.discount.coupon=dis.code;
        

        this.dis_applied=true;
        if(dis.discount_type==1)
        {
          this.dis_text = dis.discount + this.currency;

          this.total = (this.total-dis.discount);
        }
        else{
          this.dis_text = dis.discount + "%";

          var p = (dis.discount / 100) * this.total;

          this.total = (this.total-p);
        }

        // this.cServie.notify(true,"Coupon Applied Successfully",false,false,false);
      }
      else
      {
        // this.cServie.notify(true,"Invalid or expired coupon",true,false,false);
      }
    });
  }
  
 
}

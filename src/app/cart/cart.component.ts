import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';
import { Router, NavigationEnd } from '@angular/router';
import{CartService} from './cart.service';
import { SEOService } from './../seo.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cats = [];
  nav_hidden=true;
  cart_items=[];
  pre_total="0";
  dis_applied=false;
  dis_text="";
  dis_id=0;
  discount={coupon:""};
  total="0";
  currency="$"
  php_url=""
  constructor(
    private cServie:CommonService,
    private router:Router,
    private cartService:CartService,
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





    this.total= parseFloat(total.toString()).toFixed(2);
    this.pre_total = this.total;

    this.apply_code();
  }
  fix2(val)
  {
    return parseFloat(val.toString()).toFixed(2);
  }

  selectedLang=1

  toggleNav()
  {
    this.nav_hidden = !this.nav_hidden;
  }


  

  ngOnInit(): void {

      console.log("BILAL");
      console.log(this.cart_items);
    
      setTimeout(()=>{
        this.selectedLang = this.cServie.selectedLang;
        // this.cServie.currency.subscribe((c)=>{
        //   this.currency=c;
        // });
        this.cServie.imp.subscribe((data:any)=>{
          this.currency=data.currency;
        });
      },700);
      this.seoService.updateCanonicalUrl();
  }

  removeItem(ind)
  {
    var all = this.cart_items;
    all.splice(ind,1);
    this.cart_items=all;
    // this.update_total();
    this.cServie.update_cart_items(this.cart_items);
    this.cServie.setItem("cart_items",JSON.stringify(this.cart_items));
  }


  QtyPlus(ind)
  {
    var all = this.cart_items;


    // if(all[ind].qty>98) return;

    all[ind].qty = ( parseInt( all[ind].qty ) + 1);

    // this.cart_items=all;

    this.cServie.update_cart_items(all);
    this.cServie.setItem("cart_items",JSON.stringify(all));
  }
  QtyMinus(ind)
  {
    var all = this.cart_items;

    // if(all[ind].min_qty==all[ind].qty)
    // {
      
    //   this.cServie.notify(true,"Minimum required quantity is: "+all[ind].min_qty,true,false,false);
    //   return;
    // }
    


    if(all[ind].qty==1) return;

    all[ind].qty =( parseInt(all[ind].qty) - 1);

    // this.cart_items=all;

    this.cServie.update_cart_items(all);
    this.cServie.setItem("cart_items",JSON.stringify(all));
  }


  onSubmit(form)
  {
    this.cartService.applyCoupon({coupon:this.discount.coupon}).subscribe((data:any)=>{
      if(data.action=="success")
      {
        var dis = data.data;

        this.dis_id = dis.id;
        localStorage.setItem("dis_id",''+this.dis_id);
        this.pre_total = this.total;
        

        this.dis_applied=true;
        if(dis.discount_type==1)
        {
          this.dis_text = dis.discount + this.currency;

          this.total = parseFloat( (( parseFloat( this.total )- parseFloat( dis.discount)).toString())).toFixed(2);
        }
        else{
          this.dis_text = dis.discount + "%";

          var p = parseFloat( ((dis.discount / 100) * parseFloat( this.total )).toString() ).toFixed(2);

          this.total = parseFloat( (parseFloat(this.total)- parseFloat( p) ).toString() ).toFixed(2);
        }

        this.cServie.notify(true,"Coupon Applied Successfully",false,false,false);
      }
      else
      {

        this.dis_applied=false;
        this.dis_id=0;
        localStorage.setItem("dis_id",''+this.dis_id);
        this.update_total()
        this.cServie.notify(true,"Invalid or expired coupon",true,false,false);
      }
    });
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

          this.total = parseFloat(( parseFloat( this.total ) - dis.discount).toString()).toFixed(2);
        }
        else{
          this.dis_text = dis.discount + "%";

          var p = (dis.discount / 100) * parseFloat(  this.total );

          this.total = parseFloat(( parseFloat( this.total ) -p).toString()).toFixed(2);
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

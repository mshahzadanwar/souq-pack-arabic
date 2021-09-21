import { Component, OnInit } from '@angular/core';
import {WishlistService} from './wishlist.service';
import { CommonService } from '../common.service';
import * as scripts from './../../assets/js/scripts.js';
import { SEOService } from './../seo.service';
declare var slider_init: any;


@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  // carousel_slider: any;
  selectedLang=1
  sliced_tabs=[]
  sliders=[]
  offers=[]
  tabs=[]
  brands=[]
  prods=[]
  php_url = ""
  
  constructor(
    private hService:WishlistService,
    private cService:CommonService,
    private seoService: SEOService,
  ) { }

  ngOnInit(): void {

    setTimeout(()=>{
      // this.cService.fire_first_shot();
      this.selectedLang=this.cService.selectedLang;
      this.getHome(this.selectedLang);
      this.php_url = this.cService.apiUrlPhp;
    },500);

    this.seoService.updateCanonicalUrl();
    
  }
  getHome(lang_id:number)
  {
    this.hService.getHome({lang_id:lang_id}).subscribe((data:any)=>{
      console.log(data);
      if(data.action=="success")
      {
       
        this.prods = data.data.products;
        
        // console.log(this.sliced_tabs);
        // setTimeout(() => {
        //   slider_init();
        // }, (2000));
      }
      else{
        console.log("Coudn't load data");
      }
    })
  }
  addToCart(p)
  {
    this.cService.getItem("cart_items").then((cart_items)=>{


      var job_done = false;
      var final_obj=[];
      if(cart_items!=null && cart_items !="null" && typeof cart_items != 'undefined' && cart_items!="" && cart_items.length>0)
      {

        console.log(cart_items);
        console.log(("----"));
        
        var cart_itemss = JSON.parse(cart_items);
        for(var i = 0; i<=cart_itemss.length-1; i++)
        {
          if(cart_itemss[i].id==p.id)
          {
            cart_itemss[i].qty = (cart_itemss[i].qty + 1);
            job_done=true;
          }
        }

        final_obj = cart_itemss;
      }

      if(!job_done)
      {
        var item = {
          id:p.id,
          qty:p.min_qty,
          min_qty:p.min_qty,
          title:p.title,
          img:p.image,
          price:p.discounted_price>0?p.discounted_price:p.real_price,
          slug:p.slug
        };
        final_obj.push(item);
      }
      this.cService.setItem("cart_items",JSON.stringify(final_obj));
      this.cService.update_cart_items(final_obj);
      this.cService.notify(true,"Added to cart",false,false,false);
    });
  }
  wish_tab(prod,prod_i,tab_i)
  {
      var all = this.tabs;

      var in_wish = all[tab_i].products[prod_i].in_wish;

      var do_add = in_wish==1?0:1;


      this.tabs[tab_i].products[prod_i].in_wish = do_add;

      this.cService.wish_me(prod.id,do_add);
  }

  wish_prods(prod,prod_i)
  {
      var all = this.prods;

      var in_wish = all[prod_i].in_wish;

      var do_add = in_wish==1?0:1;


      this.prods[prod_i].in_wish = do_add;

      if(do_add==0)
      {
        this.prods.splice(prod_i,1);
      }

      this.cService.wish_me(prod.id,do_add);
  }

}

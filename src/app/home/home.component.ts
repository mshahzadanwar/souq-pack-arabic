import { Component, OnInit } from '@angular/core';
import {HomeService} from './home.service';
import { CommonService } from '../common.service';
import * as scripts from './../../assets/js/scripts.js';
import {Meta,Title} from '@angular/platform-browser';
import { SEOService } from './../seo.service';
declare var slider_init: any;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // carousel_slider: any;
  selectedLang=1
  sliced_tabs=[]
  sliders=[]
  offers=[]
  two_offers=[]
  tabs=[]
  tabsv2=[]
  brands=[]
  prods=[]
  php_url = ""
  defaul_image = "assets/loading.gif"
  defaul_image_banner = "" 
  
  constructor(
    private hService:HomeService,
    private cService:CommonService,
    private meta:Meta,
    private title:Title,
    private seoService: SEOService,
  ) { }

  ngOnInit(): void {

    // this.cService.fire_first_shot();
    setTimeout(()=>{
      this.selectedLang=this.cService.selectedLang;
      this.getHome(this.selectedLang);
      this.php_url = this.cService.apiUrlPhp;
      this.cService.imp.subscribe((data:any)=>{
        if(this.selectedLang==2){
          this.title.setTitle(data.title);
          this.title.setTitle(data.meta_en!=""?data.meta_en:data.title);
          this.meta.updateTag({name:'title',content:data.meta_en!=""?data.meta_en:data.title});
          this.meta.updateTag({name:'description',content:data.meta_des_en!=""?data.meta_des_en:data.titlen});
          this.meta.updateTag({name:'keywords',content:data.meta_keys_en!=""?data.meta_keys_en:data.title});
        }
        else {
          this.title.setTitle(data.title_ar);
          this.title.setTitle(data.meta_ar!=""?data.meta_ar:data.title);
          this.meta.updateTag({name:'title',content:data.meta_ar!=""?data.meta_ar:data.title});
          this.meta.updateTag({name:'description',content:data.meta_des_ar!=""?data.meta_des_ar:data.titlen});
          this.meta.updateTag({name:'keywords',content:data.meta_keys_ar!=""?data.meta_keys_ar:data.title});
        }
        this.seoService.updateCanonicalUrl();
      })
    },800);


    
   
    
  }
  getHome(lang_id:number)
  {
    // localStorage.removeItem('home_date_ar');
    // return;
    if(localStorage.getItem("home_date_ar") === null){
        this.hService.getHome({lang_id:lang_id}).subscribe((data:any)=>{
          if(data.action=="success")
          {
            
            this.sliders = data.data.sliders;
            this.tabs = data.data.tabs;
            this.tabsv2 = data.data.tabsv2;
            this.prods = data.data.products;
            this.offers = data.data.offers;
            this.two_offers = data.data.two_offers;
            this.brands = data.data.brands;

            // for(var i = 0; i<=2; i++)
            // {

            //   var groups=[];

            //   var all_prods = this.tabs[i].products;

            //   var group = [];

            //   for(var q = 0; q<=all_prods.length-1; q++)
            //   {
            //     if(q%3==0 && q!=0)
            //     {
            //       groups.push({prods:group});
            //       group=[];
            //     }

            //     group.push(all_prods[q]);
            //   }
            //   groups.push({prods:group});

            //   var to_push = this.tabs[i];
            //   to_push.groups = groups;
            //   this.sliced_tabs.push(to_push)


            // }
            //console.log(this.sliced_tabs);
            setTimeout(() => {
              slider_init();
              localStorage.setItem("home_date_ar",JSON.stringify(data));
            }, (500));
          }
          else{
            console.log("Coudn't load data");
          }
        })
      } else{
        var data = JSON.parse(localStorage.getItem("home_date_ar"));
         
          this.sliders = data.data.sliders;
          this.tabs = data.data.tabs;
          this.tabsv2 = data.data.tabsv2;
          this.prods = data.data.products;
          this.offers = data.data.offers;
          this.two_offers = data.data.two_offers;
          this.brands = data.data.brands;
          setTimeout(() => {
            slider_init();
          }, (500));
      }
  }
  addToCart(p)
  {
    this.cService.getItem("cart_items").then((cart_items)=>{


      var job_done = false;
      var final_obj=[];
      if(cart_items!=null && cart_items !="null" && typeof cart_items != 'undefined' && cart_items!="" && cart_items.length>0)
      {

        //console.log(cart_items);
        //console.log(("----"));
        
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

      this.cService.wish_me(prod.id,do_add);
  }
  addso(i)
  {
    return (i+100);
  }

}

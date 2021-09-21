import { Component, OnInit } from '@angular/core';
import {CategoryService} from './category.service';
import { CommonService } from '../common.service';
import * as scripts from './../../assets/js/scripts.js';
import { Subscription } from 'rxjs';
import {Meta,Title} from '@angular/platform-browser';
import { SEOService } from './../seo.service';
import { Params, Router, ActivatedRoute } from '@angular/router';
declare var shop_page_ready: any;
declare var list_grid: any;



@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  // carousel_slider: any;
  selectedLang=1
  sliced_tabs=[]
  sliders=[]
  offers=[]
  tabs=[]
  brands=[]
  cats=[]
  slug=""
  url="";
  prods=[]
  f_pages=[]
  php_url = ""
  order_by="";
  order=""
  pages=0
  page=0
  show_products_div = false
  catgory: any={}
  userSubscription:Subscription;
  constructor(
    private hService:CategoryService,
    private cService:CommonService,
    private route:ActivatedRoute,
    private meta:Meta,
    private title:Title,
    private seoService: SEOService,
    // private dom,
    private router: Router
  ) { }

  ngOnInit(): void {



    

  setTimeout(()=>{

    this.selectedLang=this.cService.selectedLang;
    // this.getHome(this.selectedLang);
    this.php_url = this.cService.apiUrlPhp;

    this.userSubscription = this.route.params.subscribe(
      (params: Params) => {
        this.url = params.link;
       
        var slug = this.route.snapshot.paramMap.get('slug');
        this.slug = slug;
        // console.log(this.slug);
        //"category/"+this.slug
        this.seoService.updateCanonicalUrl();
        //this.updateCanonicalUrl(this.router.url);
        //console.log(this.router.url);
        this.do_init();

        

})

    // this.cService.fire_first_shot();
    
  },500)
    
   
    
  }

  // updateCanonicalUrl(url:string){
  //   const head = this.dom.getElementsByTagName('head')[0];
  //   var element: HTMLLinkElement= this.dom.querySelector(`link[rel='canonical']`) || null
  //   if (element==null) {
  //     element= this.dom.createElement('link') as HTMLLinkElement;
  //     head.appendChild(element);
  //   }
  //   element.setAttribute('rel','canonical')
  //   element.setAttribute('href',url)
  // }

  do_init()
  {
    console.log("checking language");
    console.log(this.selectedLang);
    this.page=0;
    this.fetch_data(this.page);
  }

  sort_by(val)
  {

    var val = val.target.value;
    if(val=="order")
    {


      this.order_by="id";
      this.order="ASC";

      this.fetch_data(this.page);
    }
    if(val=="date")
    {
      this.order_by="id";
      this.order="DESC";

      this.fetch_data(this.page);
    }

    if(val=="price")
    {
      this.order_by="price";
      this.order="ASC";

      this.fetch_data(this.page);
    }

    if(val=="price-desc")
    {
      this.order_by="price";
      this.order="DESC";

      this.fetch_data(this.page);
    }
  }

  doPage(p)
  {
    this.page = (p-1);
    this.fetch_data(this.page);
  }

  fetch_data(page)
  {
    this.page = page;
    this.hService.getData(
      {
        lang_id:this.selectedLang,
        slug:this.slug,page:page,
        order_by:this.order_by,
        order:this.order,
      }).subscribe((data:any)=>{
      if(data.action=="success")
      {
        this.show_products_div = true;
        this.cats = data.data.cats;
        this.brands = data.data.brands;
        this.prods = data.data.products;
        this.pages = data.data.pages;
        this.f_pages = data.data.f_pages;

        var category = data.data.category;
        this.catgory=category;

        this.title.setTitle(category.meta_title);

        this.meta.updateTag({name:'title',content:category.meta_title});

        this.meta.updateTag({name:'description',content:category.meta_description});
        this.meta.updateTag({name:'keywords',content:category.meta_keywords});
        // this.meta.updateTag({name:'og:url',content:this.cService.apiUrlPhp + this.url});
        // this.meta.updateTag({name:'og:title',content:"Hellooo"});
        // this.meta.updateTag({name:'og:description',content:category.meta_description});
       
        console.log(this.sliced_tabs);
        setTimeout(() => {
          shop_page_ready();
          list_grid();
        }, (1500));
      }
      else{
        this.show_products_div = false;
        console.log("Coudn't load data");
      }
    })
  }
  addToCart(p)
  {
    this.cService.getItem("cart_items").then((cart_items)=>{


      var job_done = false;
      var final_obj=[];
      if(cart_items!=null && typeof cart_items != 'undefined' && cart_items!="" && cart_items.length>0)
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
          currency:p.currency,
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

}

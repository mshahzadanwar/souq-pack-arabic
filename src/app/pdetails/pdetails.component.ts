import { Component, OnInit } from '@angular/core';
import{PdetailSerive} from './pdetail.service';
import * as scripts from './../../assets/js/scripts.js';
import { CommonService } from '../common.service';
import { ActivatedRoute,Router, Params, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { DomSanitizer,Meta,Title } from '@angular/platform-browser';
import { SEOService } from './../seo.service';
declare var slick_slider: any;
declare var slider_init: any;
@Component({
  selector: 'app-pdetails',
  templateUrl: './pdetails.component.html',
  styleUrls: ['./pdetails.component.css']
})
export class PdetailsComponent implements OnInit {

  selectedLang=1
  srcIndex=0
  mainSrc = "assets/images/product_img1.jpg";
  dataLoaded=false
  phpApiUrl=""
  url=""
  related:any=[]
  slug="";
  rating=5
  review_for=[1,2,3,4,5];
  php_url = ""
  userSubscription: Subscription;
  new_cart:any={qty:1}
  review={
    rating:5,
    revieww:""
  }
  selected_option = ""
  custom_variation = ""
  currency = "$"
  product:any={}
  no_product = false

  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private pdService:PdetailSerive,
    private cService:CommonService,
    private meta:Meta,
    private title:Title,
    public sanitizer: DomSanitizer,
    private seoService: SEOService,
  ) { }

  setStar(i)
  {
    this.rating = i;
  }

  ngOnInit(): void {

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
  });
    setTimeout(()=>{
      this.selectedLang = this.cService.selectedLang;
      // this.cService.currency.subscribe((data)=>{
      //   this.currency = data;
      // })
      this.cService.imp.subscribe((data:any)=>{
        this.currency=data.currency;
      });
      this.userSubscription = this.route.params.subscribe(
        (params: Params) => {
          this.url = params.link;
          console.log("New Param");
          var slug = this.route.snapshot.paramMap.get('slug');
          this.do_init(slug,true);
    })
    },800);

    

    

  }

  do_init(slug,initt=false)
  {
    // this.dataLoaded=false
    this.selectedLang=this.cService.selectedLang;
    this.phpApiUrl = this.cService.apiUrlPhp;
    this.php_url = this.cService.apiUrlPhp;
    this.slug = slug;




    this.pdService.getData({
      slug:this.slug,
      lang_id:this.selectedLang,
      region_id:this.cService.selectedRegion
    }).subscribe((data:any)=>{
      if(data.action=="success")
      {
        this.product=data.data.product;
        if(data.data.product.slider_images.length>0){
          this.mainSrc = data.data.product.slider_images[0];
          // for(var qqq = 0; qqq<=this.product.slider_images.length-1; qqq+)
          // {
          //   this.product.slider_images[qqq].active = qqq==0;
          // }
        }
        // this.new_cart.qty = data.data.product.min_qty;
        this.new_cart.qty = 1;
        this.related = data.data.related;
       // console.log(data.data);
        this.dataLoaded=true;
        // var all = this.product.custom_variations;
        // var my_options = all[0].options;
        // this.product.real_price_text = my_options[0].price_text;
        this.title.setTitle(this.product.meta_title!=""?this.product.meta_title:this.product.title);
        this.meta.updateTag({name:'title',content:this.product.meta_title!=""?this.product.meta_title:this.product.title});
        this.meta.updateTag({name:'description',content:this.product.meta_description});
        this.meta.updateTag({name:'keywords',content:this.product.meta_keywords});

        this.seoService.updateCanonicalUrl();
        this.no_product = false;
        setTimeout(()=>{
          slick_slider();
          slider_init();
        },1500);
      }
      else{
          this.dataLoaded=true;
          this.no_product = true;
          console.log("idhar");
      }
    })
  }
  ngOnDestroy(): void {
      this.userSubscription.unsubscribe()
  }
  addToCart(p)
  {
    var options_selected_verify = p.custom_variations;
    if(options_selected_verify.length > 0){
          var count = 0;
          for(var chk=0; chk<=options_selected_verify.length-1; chk++){
            var my_options = options_selected_verify[chk].options;
                for(var i = 0; i <= my_options.length-1; i++){
                  if(my_options[i].selected == true){
                      count++;
                  }
                }
          }
          if(count!=options_selected_verify.length)
          {
            this.cService.notify(true,this.selectedLang!=1?"You need to select all variations to process with your order.":"تحتاج إلى تحديد جميع الأشكال لمعالجة طلبك.",false,true,false);
            return;
          }
    }
    this.cService.getItem("cart_items").then((cart_items)=>{
      var job_done = false;
      var final_obj=[];
      // return;
      if(cart_items!=null && cart_items!="null" && typeof cart_items != 'undefined' && cart_items!="" && cart_items.length>0)
      {

        // console.log(cart_items);
        // console.log(("----"));
        
        var cart_itemss = JSON.parse(cart_items);
        for(var i = 0; i<=cart_itemss.length-1; i++)
        {
          if(cart_itemss[i].id==p.id)
          {
            cart_itemss[i].qty = ( parseInt(cart_itemss[i].qty) + parseInt(this.new_cart.qty));
            job_done=true;
          }
        }

        final_obj = cart_itemss;
      }

      if(!job_done)
      {
        var real_price_no_var = p.discounted_price>0?p.discounted_price:p.real_price;

        var price_variation = p.custom_variations;
       
      if(price_variation.length >0 ){
          var my_options = price_variation[0].options;
            for(var i = 0; i<=my_options.length-1; i++)
            {
              if(my_options[i].selected == true){
                var selected_option = my_options[i];   
              }
            }
            
          var variations_store =[];
          if(typeof selected_option != 'undefined'){

            var price_1_var = parseFloat("0");
            
            for(var q = 0 ;q<=price_variation.length-1;q++)
            {
              for(var k=0; k<=price_variation[q].options.length-1;k++)
              {
                
                //console.log(price_variation[q]);
                if(price_variation[q].options[k].selected){
                  price_1_var += parseFloat(price_variation[q].options[k].price);

                  var objvar = {};
                  objvar[price_variation[q].title] = price_variation[q].options[k].title;
                  variations_store.push(objvar);
                }
              }
            }
           
            real_price_no_var = price_1_var;
            //var custom_variation = variations_store;
          }
        }
        var item = {
          id:p.id,
          qty:parseInt(this.new_cart.qty),
          title:p.title,
          img:p.image,
          price:real_price_no_var,
          custom_variation : variations_store,
          //price:p.discounted_price>0?p.discounted_price:p.real_price,
          slug:p.slug
        };
        //console.log(item);
       final_obj.push(item);
      }
      this.cService.setItem("cart_items",JSON.stringify(final_obj));
      this.cService.update_cart_items(final_obj);
      this.cService.notify(true,this.selectedLang!=1?"Your Item added to cart successfully":"تمت الاضافة للعربة بنجاح",false,false,false);
    });
  }
  QtyPlus()
  {
    this.new_cart.qty = ( parseInt( this.new_cart.qty ) + 1);
  }
  QtyMinus()
  {
    // this.product.min_qty
    if(this.new_cart.qty<2)
    {
      this.cService.notify(true,"Minimum required quantity is: "+this.product.min_qty,true,false,false);
      return;
    }
    
    this.new_cart.qty = this.new_cart.qty-1;
  }

  wish_single()
  {

    var in_wish = this.product.in_wish;

    var do_add = in_wish==1?0:1;


    this.product.in_wish = do_add;

    this.cService.wish_me(this.product.id,do_add);
  }
  wish_prods(prod,prod_i)
  {
    var all = this.related;

    var in_wish = all[prod_i].in_wish;

    var do_add = in_wish==1?0:1;


    this.related[prod_i].in_wish = do_add;

    this.cService.wish_me(prod.id,do_add);
  }
  onSubmit(form:any)
  {
    this.review.rating = this.rating;
    this.pdService.postReview(this.review,this.product.id).subscribe((data:any)=>{
      if(data.action=="success")
      {
        this.cService.notify(true,"Your review has been submitted and pending",false,false,false);
      }
      else
      {
        this.cService.notify(true,"Please login before posting your review",true,false,false);
      }
    })
  }
  // selectOption(var_ind,opt_ind)
  // {
  //   var all = this.product.custom_variations;
  //   var price_1 = parseFloat("0");
    
  //   var my_options = all[var_ind].options;
  //   for(var i = 0; i<=my_options.length-1; i++)
  //   {
  //     my_options[i].selected=false;
  //   }
  //   my_options[opt_ind].selected = true;
    
  //   for(var q = 0 ;q<=all.length-1;q++)
  //   {
  //     //if(q==var_ind) continue;
  //     for(var k=0; k<=all[q].options.length-1;k++)
  //     {
  //       if(all[q].options[k].selected)
  //         price_1 += parseFloat(all[q].options[k].price);
  //     }
  //   }

  //   var p = this.product;
  //   // var show_price = parseFloat(my_options[opt_ind].price) + price_1;
  //   var show_price = price_1;
  //   this.product.real_price_text = this.currency + " "+show_price;
   
  //   all[var_ind].options = my_options;
  //   p.custom_variations = all;
  //   this.product = p;

    
  // }

  selectOption(var_ind,opt_ind)
  {
    console.log("bilal index");
    console.log(var_ind);
    console.log(opt_ind);
    
    var all = this.product.custom_variations;
    var price_1 = parseFloat("0");
    var real_price_after_discounts = parseFloat("0");

    var my_options = all[var_ind].options;

    var last_selected = -1; // new line

    // new loop
    for(var i = 0; i<=my_options.length-1; i++)
    {
      if(my_options[i].selected)
      {
      	last_selected=i;
      }
    }

    for(var i = 0; i<=my_options.length-1; i++)
    {
      my_options[i].selected=false;
    }

    if(last_selected!=opt_ind)// new if condition
    	my_options[opt_ind].selected = true;
    
    for(var q = 0 ;q<=all.length-1;q++)
    {
      //if(q==var_ind) continue;
      for(var k=0; k<=all[q].options.length-1;k++)
      {
        if(all[q].options[k].selected)
        {
          price_1 += parseFloat(all[q].options[k].price);
          var discount_text = all[q].options[k].discount_text;
          console.log(all[q].options[k].real_price_after_discount);
          real_price_after_discounts += parseFloat(all[q].options[k].real_price_after_discount);
        }
      }
      
    }
    var p = this.product;
    // new condition
    if(price_1==0)
    {
      price_1 = p.discounted_price>0?p.discounted_price:p.real_price;
    }
    else {
      price_1 = price_1;
    }
   
    // var show_price = parseFloat(my_options[opt_ind].price) + price_1;
    var show_price = price_1;
    
    if(p.discount_type > 0){
      this.product.discounted_text = show_price+ " "+this.currency;
      this.product.real_price_text = real_price_after_discounts+ " "+this.currency;
      this.product.discount_text = discount_text;
    } else {
      this.product.real_price_text = show_price+ " "+this.currency;
    }
   
    all[var_ind].options = my_options;
    p.custom_variations = all;
    this.product = p;

    
  }
  mainSource(src,i)
  {
    this.mainSrc = src;
    this.srcIndex=i
  }



}

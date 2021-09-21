
import { Component, OnInit, Pipe } from '@angular/core';
import {ProfileService} from './profile.service';
import { CommonService } from '../common.service';
import * as scripts from './../../assets/js/scripts.js';
import { Subscription } from 'rxjs';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../_services';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
declare var shop_page_ready: any;
declare var list_grid: any;
 

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  // carousel_slider: any;
  profile:any={
    firstname:"",
    lastname:"",
    phone:"",
    code:"966",
  }
  code_picker=[];
  selectedLang=1
  editing=0
  sliced_tabs=[]
  sliders=[]
  offers=[]
  showing_list=true;
  show_popup_box = 0;
  show_reason = 0;
  refund_box = 0;
  tabs=[]
  brands=[]
  adrss=[]
  cats=[]
  slug=""
  prods=[]
  f_pages=[]
  php_url = ""
  order_by="";
  order="";
  orders=[];
  pre_total="0";
  total="0";
  corders=[];
  new_products;
  product_detail=[];
  pages=0
  currency="$"
  page=0
  cance_reason = {
    cancel:""
  }
  refund_reason = {
    reason:"",
    bankname:"",
    address:"",
    holdername: "",
    accountnum:"",
  }
  adrs_form = {
    email:'jhgfdsytre',
    first_name:'jhgfd',
    last_name:'kjhg',
    phone:'qwert',
    country:"lkjhgfd",
    state:"qwerth",
    city:"kjhgds",
    zip:"qwsdg",
    address:"kjhg",
    address_2:"",
    title:"",
  };
  userSubscription:Subscription;
  constructor(
    private pService:ProfileService,
    private cService:CommonService,
    private route:ActivatedRoute,
    private router:Router,
   
    
    private authService:AuthenticationService
  ) { }

  ngOnInit(): void {
    this.get_countries_list();
    // this.route.params.subscribe(params => {
    //   console.log("parameters");
    //   console.log(params);
    // });
    let param1 = this.route.snapshot.queryParams["order_success"];
    if(param1 == "order"){
      history.pushState(null, "", location.href.split("?")[0]);
      this.cService.notify(true,"Thank you for your order, your Order has been processed successfully.",false,false,false);
    }

    let param2 = this.route.snapshot.queryParams["order_failed"];
    if(param2 == "order_fail"){
      history.pushState(null, "", location.href.split("?")[0]);
      this.cService.notify(true,"Your payment is not done successfully, please try again later..",false,true,false);
    }
    setTimeout(()=>{
       // this.cService.fire_first_shot();
      this.selectedLang=this.cService.selectedLang;
      // this.getHome(this.selectedLang);
      this.php_url = this.cService.apiUrlPhp;
      
      this.cService.currency.subscribe((c)=>{
        this.currency=c;
      })
    },700);

    this.cService.getItem("login_data").then((r)=>{
      var data = JSON.parse(r);

      this.profile.firstname = data.first_name;
      this.profile.lastname = data.last_name;
      this.profile.phone = data.phone;
      this.profile.code = data.code;
      this.profile.email = data.email;
    })



  //   this.userSubscription = this.route.params.subscribe(
  //       (params: Params) => {
  //         console.log("New Param");
  //         var slug = this.route.snapshot.paramMap.get('slug');
  //         this.slug = slug;
  //         this.do_init();

  // })


          this.do_init();

   


    
   
    
  }
  do_init()
  {
    this.page=0;
    this.fetch_data(this.page);
  }

  get_countries_list(){
    this.pService.get_phone_pickerss(this.profile).subscribe((data:any)=>{
      if(data.action=="success")
      {
        this.code_picker = data.data;
      }
      else{
        this.cService.notify(true,data.error,false,true,false);
        return false;
      }
    });
  }

 
  fetch_data(page)
  {
    this.page = page;
    this.pService.getData(
      {
        lang_id:this.selectedLang
      }).subscribe((data:any)=>{
      console.log(data);
      if(data.action=="success")
      {
        this.orders = data.data.orders;
        var total = 0;
        for(var i = 0; i<=this.orders.length-1; i++)
        {
          var new_prd = this.orders[i].products;
          
          for(var j = 0; j<=new_prd.length-1; j++)
          {
             total += (new_prd[j].price * new_prd[j].qty);
          }
        }
        this.total= parseFloat(total.toString()).toFixed(2);
        this.pre_total = this.total;
        // for(var i = 0; i<=this.orders.length-1; i++)
        // {
        //     this.new_products = this.orders[i].products;
        //     console.log("New Produscts");
        //     console.log(this.new_products);
        //     // for(var j = 0; j<=this.new_products.length-1; j++)
        //     // {
        //     //   this.product_detail = this.new_products[j].pdata;
              
        //     // }
        // }
        this.corders = data.data.corders || [];
        this.adrss = data.data.addresses;
        
       
        // console.log(this.sliced_tabs);
        setTimeout(() => {
          // shop_page_ready();
          // list_grid();
        }, (1500));
      }
      else{
        console.log("Coudn't load data");
      }
    })
  }
 

  logout()
  {
    this.authService.logout();    
  }
  addAddress()
  {
    this.editing=0;
    this.adrs_form.first_name = "";
    this.adrs_form.last_name = "";
    this.adrs_form.email = "";
    this.adrs_form.phone = "";
    this.adrs_form.country = "";
    this.adrs_form.state = "";
    this.adrs_form.city = "";
    this.adrs_form.zip = "";
    this.adrs_form.address = "";
    this.adrs_form.title = "";
    this.showing_list=false;
    
  }
  fix2(val)
  {
    return parseFloat(val.toString()).toFixed(2);
  }
  editAddress(ind)
  {

    
    this.editing=this.adrss[ind].id;
    this.adrs_form.first_name = this.adrss[ind].first_name;
    this.adrs_form.last_name = this.adrss[ind].last_name;
    this.adrs_form.email = this.adrss[ind].email;
    this.adrs_form.phone = this.adrss[ind].phone;
    this.adrs_form.country = this.adrss[ind].country;
    this.adrs_form.state = this.adrss[ind].state;
    this.adrs_form.city = this.adrss[ind].city;
    this.adrs_form.zip = this.adrss[ind].zip;
    this.adrs_form.address = this.adrss[ind].address;
    this.adrs_form.address_2 = this.adrss[ind].address_2;
    this.adrs_form.title = this.adrss[ind].title;
    this.showing_list=false;
    
  }
  onSubmit(form)
  { 
    this.pService.updateProfile(this.profile).subscribe((data:any)=>{
      this.cService.setItem("login_data",JSON.stringify(data.data)).then(()=>{
        this.cService.notify(true,"Your profile has been updated",false,false,false);
      });
    });
  }
  onSubmit1(form)
  { 
    this.pService.addOrUpdateAddress(this.adrs_form,this.editing).subscribe((data:any)=>{
      this.adrss = data.data;
        this.cService.notify(true,"Your address has been updated",false,false,false);
        this.showing_list=true;
    });
  }
  submitCancelReason(form,id)
  { 
    this.pService.cancelformsubmit(this.cance_reason,id).subscribe((data:any)=>{
     
        //this.adrss = data.data;
        //this.cService.notify(true,data.error,false,false,false);
        this.show_popup_box = 0;
        this.show_reason = 0;
        setTimeout(()=>{
         window.location.reload();
        },500);
    });
  }
  submitRefundReason(form,id)
  { 
    this.pService.Refundformsubmit(this.refund_reason,id).subscribe((data:any)=>{
     
        //this.adrss = data.data;
        // "Refund Request has been initiated successfully."
        this.cService.notify(true,data.error,false,false,false);
        this.show_popup_box = 0;
        this.refund_box = 0;
        setTimeout(()=>{
         window.location.reload();
        },500);
    });
  }
  routerTo(id)
  {
    this.router.navigate(["/view-custom-order",id]);
  }
  routerToNormalOrders(id)
  {
    this.show_popup_box = id;
  }
  hide_popup(){
    this.show_popup_box = 0;
  }

  hide_reason(){
    this.show_reason = 0;
  }

  cancel_popup(id){
    this.show_reason = id;
  }

  refund_popup(id){
    this.refund_box = id;
  }
  hide_refund_box(){
    this.refund_box = 0;
  }
}

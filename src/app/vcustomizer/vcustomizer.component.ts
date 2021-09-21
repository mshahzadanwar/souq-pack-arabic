import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal'
import { Subscription } from 'rxjs';
import { CommonService } from '../common.service';
import { PaynowService } from '../paynow/paynow.service';
import { VcustomizerService } from './vcustomizer.service';
import { retry } from 'rxjs/operators';

interface Statics {
  min_qty:number,
  qty:number, //this
  pc_price:number,
  stamps_price:number,
  faces:number,
  faces_from:number,
  faces_to:number,
  faces_price:number,
  faces_val:number, // this
  faces_options:Array<number>,
  colors:number,
  colors_from:number,
  colors_to:number,
  colors_price:number,
  colors_val:number, // this
  colors_options:Array<number>,
  base:number,
  base_price:number,
  base_val:number, // this
  sides:number,
  sides_price:number,
  sides_val:number, // this
  height:number,
  height_val:number, // this
  width:number,
  width_val:number //this
};

@Component({
  selector: 'app-vcustomizer',
  templateUrl: './vcustomizer.component.html',
  styleUrls: ['./vcustomizer.component.css']
})
export class VcustomizerComponent implements OnInit {

  // carousel_slider: any;
  public payPalConfig?: IPayPalConfig;
  current_step = 1;
  selectedLang=1
  ready=false;
  ButtonTEXT = "";
  paypal_allowed=1;
  show_new_comment= false;
  selected_cat={
    subs:[]
  }
  signup = {
    file_name:"",
    order_id:0,
  }
  show_bank_details = false;
  payfort={};
  bank={};
  selected_sub:any={
    cust_image:"i.png",
    options:[],
    shipping:0,
    vat:15,
    logo_price:0
  }
  sliced_tabs=[]
  categories=[]
  sliders=[]
  offers=[]
  tabs=[]
  options=[]
  brands=[]
  cats=[]
  slug=""
  url="";
  prods=[]
  f_pages=[]
  php_url = ""
  order_by="";
  catgory={};
  order=""
  pages=0
  file_preview_src=""
  page=0
  color_preview="red";
  color_pallet={
    c:26,
    m:-6,
    y:5,
    k:1
  }
  total={
    only_items_price:"0",
    stamps_price:"0",
    s_price:0,
    price:558.56,
    s_logo:0,
    logo:594.54,
    down:549.45,
    shipping:546.95,
    s_vat:0,
    vat:5945.55,
    delivery:504.54,
    total:95459.90,
    sub_total:0
  }
  theRGBcolor="#000000";
  logo_type=1;
  color_type=1;
  fileToUpload: File = null;
  uploading=false;
  loading=false;
  userSubscription:Subscription;

  payment_popup=false;
  upload_box=false;
  payment_method=1;

  comment = {
    notes:"",
    order_id:0,
  }

  final_form = {
    options:[],
    statics:<Statics>{},
    logo:{
      logo_file:{
        file_name:"",
        logo_print:"UV",
        logo_colors:"4",
        logo_stamps:"4",
        selected:1,
      },
      logo_create:{
        logo_name:"",
        logo_name_2:"",
        logo_colors:"4",
        logo_desc:"",
        selected:0
      }
    },
    color:{
      choose_color:{
        color:"#000000",
        selected:1
      },
      create_color:{
        selected:0,
        hex_color:"",
        color:{
          c:0,
          m:0,
          y:0,
          k:0
        }
      }
    },
    notes:"",
    total:{},
    sub_cat_id:0,

  }
  threads=[1,2,3,4,5]
  my_email="";
  my_id=0
  oobj:any={}
  order_id=0;
  paypal_key=""
  rejecting=false
  rejectModal={
    reason:""
  }
  allowedAcceptAction=true

  constructor(
    private custService:VcustomizerService,
    private cService:CommonService,
    private route:ActivatedRoute,
    private meta:Meta,
    private title:Title,
    private payService:PaynowService,
    private router:Router,
  ) { }

  ngOnInit(): void {

  setTimeout(()=>{



    this.userSubscription = this.route.params.subscribe(
      (params: Params) => {
        // if ((params instanceof NavigationEnd)) {
        //   window.scrollTo(0, 0)
        // }
        this.url = params.link;
        console.log("New Param");
        var slug = this.route.snapshot.paramMap.get('slug');
        this.slug = slug;
        // this.toRGB();
        this.do_init();

        setTimeout(()=>{
          this.cService.update_cust_screen(true)
        },0);

        var d = localStorage.getItem("login_data");
        var d2 = JSON.parse(d);
        this.my_email = d2.email || "dummy@souqpack.com";
        this.my_id = d2.id || 0;

})

    // this.cService.fire_first_shot();
    this.selectedLang=this.cService.selectedLang;
    // this.getHome(this.selectedLang);
    this.php_url = this.cService.apiUrlPhp;
  },500)



    
   
    
  }
  do_init()
  {


     this.route.params.subscribe(
      (params: Params) => {
        var id = this.route.snapshot.paramMap.get('id');
        this.order_id = parseInt(id);
        this.fetch_data();

})



    // this.page=0;
    // this.fetch_data();
  }

  
  show_box_comment(){
    this.show_new_comment = true;
  }
  hide_box_comment(){
    this.show_new_comment = false;
  }

  fetch_data()
  {
    this.custService.getData(
      {
        lang_id:this.selectedLang,
        order_id:this.order_id
      }).subscribe((data:any)=>{
      console.log(data.data.order);
      if(data.action=="success")
      {
        

        
       
          this.oobj = data.data.order;
          // this.order_id = data.data.order.id;

          this.threads = data.data.threads;


          this.paypal_key = data.data.paypal_key;
          this.paypal_allowed = data.data.paypal_allowed;
          this.payment_method = data.data.paypal_allowed==1?1:0;
          this.payfort = data.data.payfort;
          this.bank = data.data.bank;
          // this.show_payment_popup();
          this.current_step =2;
          this.ready=true;
        
       
        // this.refer/esh_selection();
        

        this.title.setTitle("Customizer | View your order");
      }
      else{
        console.log("Coudn't load data");
      }
    })
  }
  submitBank(){
    if(this.final_form.logo.logo_file.file_name==""){
      alert("Please upload a receipt first");
      return;
    }
    this.signup.file_name = this.final_form.logo.logo_file.file_name;
    this.signup.order_id = this.order_id;
    this.custService.submit_bank_details(this.signup).subscribe((data:any) => {
      if(data.action=="success")
      {
        this.file_preview_src="";
        this.uploading=false;
        this.cService.notify(true,"Information submitted successfully! You will be notified once SouqPack will verify payment!",true,false,false);
        // window.location.reload();
        this.router.navigate(['/thank-you']);
      }
      else{
        this.cService.notify(true,data.error,false,true,false);
        this.uploading=false;
        this.file_preview_src="";
      }
      // do something, if upload success
      }, error => {
        console.log(error);
      });
  }
  handleFileInput(files: FileList) {

    if(files.length >0){
      this.cService.notify(true,"File Uploading....!",false,false,true);
      this.uploading=true;
      this.fileToUpload = files.item(0);
      this.custService.postFile(this.fileToUpload).subscribe((data:any) => {
        if(data.action=="success")
        {
          this.logo_type = 1;
          this.final_form.logo.logo_file.file_name=data.filename;
          if(data.ext !="jpg" && data.ext !="png" && data.ext !="jpeg"){
            this.file_preview_src = this.cService.apiUrlPhp+"resources/uploads/orders/PDF_file_icon.svg"; 
          }else {
            this.file_preview_src = this.cService.apiUrlPhp+"resources/uploads/orders/"+data.filename; 
          }
          this.uploading=false;
          this.upload_box=true;
          this.ButtonTEXT = "Confirm payment";
          this.cService.notify(true,"File uploaded successfully!",false,false,false);
        }
        else{
          this.cService.notify(true,data.error,false,true,false);
          this.uploading=false;
          this.file_preview_src="";
        }
        // do something, if upload success
        }, error => {
          console.log(error);
        });
    }
  }
  doNothing()
  {

  }

postComment(){
    this.comment.notes = this.comment.notes;
    this.comment.order_id = this.order_id;
    this.custService.posTComment(this.comment).subscribe((data:any) => {
        if(data.action=="success")
        {
          this.cService.notify(true,"Your comment has been posted successfully.",true,false,false);
          window.location.reload();
        }
        else{
          this.cService.notify(true,data.error,false,true,false);
        }
      }, error => {
        console.log(error);
      });
}
  buyNow()
  {
   
    if(this.current_step==2)
    {
      this.payment_popup=true;
      return;
    }

    
  }
  // show_upload_box(){
  //   this.upload_box=true;
  // }
  show_payment_popup()
  {
    this.payment_popup=true;
  }
  paymentMethod(i)
  {
    this.payment_method = i;
    if(i==4){
      this.show_bank_details = true;
    }
    else {
      this.show_bank_details = false;
    }
  }
  payNow()
  {
    if(this.payment_method==1)
    {
      // this.show_paypal=true;
      this.initConfig();
    }
    else{
      // this.fire_payfort();
    }
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
            value: this.total.down+"",
            
          },
          items:[]
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
          this.cService.notify(true,"Thank You for the payment, we'll process your order soon",false,false,false);
          // this.router.navigate(["/"]);
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
  cancelPayment()
  {
    this.payment_popup=false;
    // this.router.navigate(["/profile"]);
  }
  rejectDelivery()
  {
    this.rejecting=!this.rejecting
  }
  reallyReject()
  {
    if(this.rejectModal.reason=="")
    {
      this.cService.notify(true,"Please type a valid reason",false,true,false);
      return;
    }

    this.custService.rejectDelivery({reason:this.rejectModal.reason,order_id:this.oobj.id}).subscribe((d:any)=>{
      if(d.action=="success")
      {
        this.cService.notify(true,"Delivery has been rejected",false,false,false);
        this.rejectModal.reason="";
        this.rejecting=false
        this.allowedAcceptAction=false
        // this.threads = d.threads;
        this.fetch_data()
      }
      else{
        this.cService.notify(true,d.error,false,true,false);
      }
    },(e:any)=>{})
  }
  reallyAccept()
  {
    var x = confirm("Do you really want to accept this delivery?")
    if(!x) return

    this.custService.acceptDelivery({order_id:this.oobj.id}).subscribe((d:any)=>{
      if(d.action=="success")
      {
        this.cService.notify(true,"Delivery has been accepted",false,false,false);
        this.rejectModal.reason="";
        this.rejecting=false
        // this.threads = d.threads;
        this.fetch_data()
        this.allowedAcceptAction=false

        this.buyNow()
        this.oobj.show_payment=1;
      }
      else{
        this.cService.notify(true,d.error,false,true,false);
      }
    },(e:any)=>{})
  }
}

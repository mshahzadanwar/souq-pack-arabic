import { Component, OnInit,ViewEncapsulation  } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal'
import { Subscription } from 'rxjs';
import { CommonService } from '../common.service';
import { PaynowService } from '../paynow/paynow.service';
import { CustomizerService } from './customizer.service';
import { UUID } from 'angular2-uuid';
import { count, min } from 'rxjs/operators';
import { SEOService } from './../seo.service';
import * as scripts from './../../assets/js/scripts.js';
declare var slider_init: any;

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
  selector: 'app-customizer',
  templateUrl: './customizer.component.html',
  styleUrls: ['./customizer.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CustomizerComponent implements OnInit {

  // carousel_slider: any;
  public payPalConfig?: IPayPalConfig;
  current_step = 1;
  selectedLang=1
  ready=false;
  option_enabled = false;
  paypal_allowed=1;
  current_cust_image = ""
  selected_cat={
    subs:[]
  }
  // more_images=[]
  english_notes:""
  payfort={};
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
    logo:0,
    down:549.45,
    shipping:0,
    s_vat:0,
    vat:5945.55,
    delivery:504.54,
    total:95459.90,
    sub_total:0
  }
  theRGBcolor="#000000";
  logo_type=0;
  color_type=1;
  fileToUpload: File = null;
  uploading=false;
  loading=false;
  userSubscription:Subscription;

  payment_popup=false;
  payment_method=1;


  final_form = {
    c_title:"",
    c_title_ar:"",
    c_descps_ar:"",
    c_descps_en:"",
    lang_id:2,
    table_title_ar:"",
    table_title_en:"",
    table_size_ar:"",
    table_size_en:"",
    unit_name:"",
    unit_name_ar:"",
    options:[],
    more_images:[],
    statics:<Statics>{},
    db_logic:{
      table_index:0,
      selected_table:{rows:[]},
      minQty:0,
      row_index:0,
      prints:[],
      face_index:0,
      slots:[]
    },
    logo:{
      logo_type:0,
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
    junk_login:0,
    junk_login_for:""
  }
  my_email="";
  order_id=0;
  selected_item_index=0;
  paypal_key=""
  logged_in=false
  junk_login=0
  junk_login_for=""

  constructor(
    private custService:CustomizerService,
    private cService:CommonService,
    private route:ActivatedRoute,
    private meta:Meta,
    private title:Title,
    private payService:PaynowService,
    private router:Router,
    private seoService: SEOService,
  ) { }

  ngOnInit(): void {

  setTimeout(()=>{

    this.selectedLang=this.cService.selectedLang;

    this.userSubscription = this.route.params.subscribe(
      (params: Params) => {

        // if ((params instanceof NavigationEnd)) {
        //   window.scrollTo(0, 0)
        // }
       
        this.url = params.link;
        //console.log("New Param");
        var slug = this.route.snapshot.paramMap.get('slug');
        this.slug = slug;
        this.toRGB();
        this.do_init();

        var d = localStorage.getItem("login_data");
        var d2 = JSON.parse(d);
        this.my_email = d2.email || "dummy@souqpack.com";
        setTimeout(()=>{
          this.cService.update_cust_screen(true)
        },0);

        this.cService.getItem("login_data").then((d_data)=>{
          if(d_data && d_data!=null)
          {
            this.custService.is_logged(d_data).subscribe((res:any)=>{
              //console.log("login_status");
              //console.log(res);
              if(res.action=="success" && res.data && res.data!=null && res.data.is_guest!="1")
              {
                this.logged_in=true;
                // alert("logged_in");
                this.cService.setItem("login_for",null);
              }
              else{
                // alert("logged_in_not");

                this.logged_in=false;
                this.junk_login=1;
                this.junk_login_for = UUID.UUID();

                this.cService.setItem("login_for",this.junk_login_for);
              }
            })
          }
        })

})

    // this.cService.fire_first_shot();
    
    // this.getHome(this.selectedLang);
    this.php_url = this.cService.apiUrlPhp;
  },500)



    
   
    
  }
  do_init()
  {
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
    this.custService.getData(
      {
        lang_id:this.selectedLang,
        slug:this.slug,page:page
      }).subscribe((data:any)=>{
      //console.log(data);
      if(data.action=="success")
      {
        

        var categories = data.data.categories;
        this.categories=categories;
        this.selected_cat=this.categories[0];
       
        //console.log("categories:");
        //console.log(this.categories);

        // this.more_images = [];
        this.referesh_selection();

        // this.update_s_price();

        // this.title.setTitle("Customizer | Customize your order");

        // this.meta.updateTag({name:'title',content:category.meta_title});

        // this.meta.updateTag({name:'description',content:category.meta_description});
        // this.meta.updateTag({name:'keywords',content:category.meta_keywords});
        // this.meta.updateTag({name:'og:url',content:this.cService.apiUrlPhp + this.url});
        // this.meta.updateTag({name:'og:title',content:"Hellooo"});
        // this.meta.updateTag({name:'og:description',content:category.meta_description});
       
        //console.log(this.sliced_tabs);
        // setTimeout(() => {
        //   // shop_page_ready();
        //   // list_grid();
        // }, (1500));
        setTimeout(() => {
          slider_init();
        }, (3000));
      }
      else{
        console.log("Coudn't load data");
      }
    })
  }
  
  referesh_selection()
  {
    //console.log("SELECTED");
    //console.log(this.categories.length);
    //var ck = 0;
    for(var i = 0; i<=this.categories.length-1; i++)
    {
      
      //console.log(this.categories[i]);
      if(this.categories[i].selected==1)
      {
        //console.log("here i am");
        this.selected_cat = this.categories[i];
        
        var some_found = false;
        for(var z = 0; z<=this.selected_cat.subs.length-1; z++)
        {
          // console.log("BILAL E");
          // console.log(this.selected_cat.subs[z]);
          if(this.selected_cat.subs[z].selected==1)
          { 
            //this.selected_cat = this.selected_cat.subs[z];
            this.selected_sub = 0;
            this.selected_sub=this.selected_cat.subs[z];
            this.updateAvailableSlots();
            some_found = true;
          }
        }
        
        if(!some_found) this.selected_sub=this.selected_cat.subs[0];
        this.options = this.selected_sub.options;
        // console.log("options");
        // console.log(this.options);
        for(var vr = 0; vr<=this.options.length-1; vr++)
        {
          this.options[vr].vals = this.options[vr].values.split("\n");
        }


        this.total.s_logo = parseFloat(this.selected_sub.logo_price);
        this.total.s_vat = parseFloat(this.selected_sub.vat);
        this.total.shipping = parseFloat(this.selected_sub.shipping);

        var s_s_sub = this.selected_sub;

        
        // this.final_form.statics.min_qty = parseInt(s_s_sub.min_qty);
        // this.final_form.statics.qty = parseInt(s_s_sub.min_qty);
        this.final_form.statics.pc_price = parseInt(s_s_sub.pc_price);
        this.final_form.statics.stamps_price = parseInt(s_s_sub.stamps_price);

        this.final_form.statics.faces = parseInt(s_s_sub.faces);
        this.final_form.statics.faces_from = parseInt(s_s_sub.faces_from);
        this.final_form.statics.faces_to = parseInt(s_s_sub.faces_to);
        this.final_form.statics.faces_price = parseInt(s_s_sub.faces_price);
        this.final_form.statics.faces_val = parseInt("0");
        this.final_form.statics.faces_options = [];

        //from to thing
        var from = parseInt(s_s_sub.faces_from);
        var to = parseInt(s_s_sub.faces_to);
        for(var qj = from; qj<=to; qj++){
          
          this.final_form.statics.faces_options.push(qj);
        }

        this.final_form.statics.colors = parseInt(s_s_sub.colors);
        this.final_form.statics.colors_from = parseInt(s_s_sub.colors_from);
        this.final_form.statics.colors_to = parseInt(s_s_sub.colors_from);
        this.final_form.statics.colors_price = parseInt(s_s_sub.colors_price);
        this.final_form.statics.colors_val = parseInt("0");
        this.final_form.statics.colors_options = [];

        //from to thing
        var from = parseInt(s_s_sub.colors_from);
        var to = parseInt(s_s_sub.colors_to);
        for(var qj = from; qj<=to; qj++)
          this.final_form.statics.colors_options.push(qj);

        this.final_form.statics.sides = parseInt(s_s_sub.sides);
        this.final_form.statics.sides_price = parseInt(s_s_sub.sides_price);
        this.final_form.statics.sides_val = parseInt("0");

        this.final_form.statics.base = parseInt(s_s_sub.base);
        this.final_form.statics.base_price = parseInt(s_s_sub.base_price);
        this.final_form.statics.base_val = parseInt("0");

        this.final_form.statics.height = parseInt(s_s_sub.height);
        this.final_form.statics.width = parseInt(s_s_sub.width);
        this.final_form.statics.height_val = 0;
        this.final_form.statics.width_val = 0;

        this.update_s_price();
        this.ready=true;
        this.option_enabled = true;
        // continue;
        // break;
        
      }
      else{
        // console.log(ck);
        // console.log(i);
        // console.log(this.categories.length);
        // if(ck == this.categories.length-1) {
        //  // console.log("here i am 3");
        // this.ready=true;
        // this.selected_cat = this.categories[0];
        // this.categories[0].selected = 1;
        // this.selected_sub=this.selected_cat.subs[0];
        // this.selected_sub.selected = 1;
        // //this.referesh_selection();
        // this.updateAvailableSlots();
        // this.update_s_price();
        // some_found = true;
        // this.option_enabled = true;
        // }
        
      }
      //ck = ck+1;
    }
  }
  mainChange(q)
  {
    this.final_form.db_logic.row_index = 0;
    this.selected_cat = this.categories[q];
    for(var i = 0; i<=this.categories.length-1; i++)
    {
      this.categories[i].selected = 0;
    }

    this.categories[q].selected=1;

    for(var z = 0; z<=this.selected_cat.subs.length-1; z++)
    {
      this.selected_cat.subs[z].selected = 0;
    }

    this.selected_cat.subs[0].selected=1;
    this.selected_sub=this.selected_cat.subs[0];
    this.final_form.db_logic.selected_table = {rows:[]};
    // store
    this.updateAvailableSlots();
    // this.referesh_selection();
    this.options = this.selected_sub.options;
    for(var vr = 0; vr<=this.options.length-1; vr++)
    {
      this.options[vr].vals = this.options[vr].values.split("\n");
    }
    this.update_s_price();
  }
  sortTable( a, b ) {
    if ( parseInt(a.qty) < parseInt(b.qty) ){
      return -1;
    }
    if ( parseInt(a.qty) > parseInt(b.qty) ){
      return 1;
    }
    return 0;
  }
  updateAvailableSlots()
  {
    var all_tables = this.selected_sub.variations[this.selected_item_index].tables;
    // console.log("all tables");
    // console.log(all_tables);
    all_tables.sort(this.sortTable);
    // console.log(all_tables);

    var slots = [];
    var min_slot = all_tables[0].qty;
    var min_slot_index = 0;
    for(var i=0; i<=all_tables.length-1; i++)
    {
      this.option_enabled = true;
      slots.push(all_tables[i].qty);
      // if(min_slot<all_tables[i].qty){ 
      //   min_slot = all_tables[i].qty;
      //   min_slot_index=i;
      // }
    }
   

    this.final_form.db_logic.slots =slots;

    var min_avl = 0;

    this.final_form.db_logic.selected_table = this.selected_sub.variations[this.selected_item_index].tables[min_slot_index];
    this.final_form.db_logic.table_index=min_slot_index;
    this.final_form.db_logic.minQty=this.selected_sub.variations[this.selected_item_index].tables[min_slot_index].qty;
    this.final_form.statics.qty=this.selected_sub.variations[this.selected_item_index].tables[min_slot_index].qty;
    this.final_form.c_title=this.selected_sub.variations[this.selected_item_index].c_title;
    this.final_form.c_title_ar=this.selected_sub.variations[this.selected_item_index].c_title_ar;

    this.final_form.c_descps_en=this.selected_sub.variations[this.selected_item_index].c_descps_en;
    this.final_form.c_descps_ar=this.selected_sub.variations[this.selected_item_index].c_descps_ar;
    // console.log("BILAL CHECKING VARIATION");
    // console.log(this.selected_sub.variations[this.selected_item_index].tables[min_slot_index].table_print_name_en);
    this.final_form.table_title_ar=this.selected_sub.variations[this.selected_item_index].tables[min_slot_index].table_print_name_ar;
    this.final_form.table_title_en=this.selected_sub.variations[this.selected_item_index].tables[min_slot_index].table_print_name_en;
    
    this.final_form.table_size_ar=this.selected_sub.variations[this.selected_item_index].tables[min_slot_index].size_ar;
    this.final_form.table_size_en=this.selected_sub.variations[this.selected_item_index].tables[min_slot_index].size_eng;

    if(this.selected_sub.variations[this.selected_item_index].tables[min_slot_index].unit_name==null){
      this.final_form.unit_name="";
    }else{
      this.final_form.unit_name="("+this.selected_sub.variations[this.selected_item_index].tables[min_slot_index].unit_name+")";
    }

    if(this.selected_sub.variations[this.selected_item_index].tables[min_slot_index].unit_name_ar==null){
      this.final_form.unit_name_ar="";
    }else{
      this.final_form.unit_name_ar="("+this.selected_sub.variations[this.selected_item_index].tables[min_slot_index].unit_name_ar+")";
    }
    // this.final_form.unit_name=this.selected_sub.variations[this.selected_item_index].tables[min_slot_index].unit_name;

    // console.log("VARIATION BILLA");
    // console.log(this.selected_sub.variations[this.selected_item_index].more_images);
    // this.more_images = this.selected_sub.more_images;
    this.final_form.more_images = this.selected_sub.variations[this.selected_item_index].more_images;

    // ADD META TITLE
    if(this.selectedLang!=1){
      this.title.setTitle(this.selected_sub.variations[this.selected_item_index].meta_title_en);
      this.meta.updateTag({name:'title',content:this.selected_sub.variations[this.selected_item_index].meta_title_en});
      this.meta.updateTag({name:'description',content:this.selected_sub.variations[this.selected_item_index].meta_descps_en});
      this.meta.updateTag({name:'keywords',content:this.selected_sub.variations[this.selected_item_index].meta_keys_en});
    }else{
        this.title.setTitle(this.selected_sub.variations[this.selected_item_index].meta_title_ar);
        this.meta.updateTag({name:'title',content:this.selected_sub.variations[this.selected_item_index].meta_title_ar});
        this.meta.updateTag({name:'description',content:this.selected_sub.variations[this.selected_item_index].meta_descps_ar});
        this.meta.updateTag({name:'keywords',content:this.selected_sub.variations[this.selected_item_index].meta_keys_ar});
    }
    this.seoService.updateCanonicalUrl();
    
    //this.selected_cat.
    this.current_cust_image = this.selected_sub.variations[this.selected_item_index].cust_image
    this.selectFirstFace();


  }
  updatQty()
  {
    
    if(this.final_form.statics.qty<this.final_form.db_logic.minQty)
    {
      this.final_form.statics.qty=this.final_form.db_logic.minQty
      this.cService.notify(true,"Minimum "+this.final_form.db_logic.minQty+" qauntity is required",false,true,false);
      return;
    }

    var slots = this.final_form.db_logic.slots;
    var selected_index = 0;
    //console.log(slots);

    for(var i = 0; i<=slots.length-1; i++)
    {
      if(this.final_form.statics.qty >= slots[slots.length-1])
      {
        selected_index=i;
      }
      else{
      
      
        if(slots[i]<=this.final_form.statics.qty && slots[i+1]>this.final_form.statics.qty)
        {
          selected_index=i;
        }
      }
    }
    
    this.final_form.db_logic.selected_table = this.selected_sub.variations[this.selected_item_index].tables[selected_index];
    this.final_form.db_logic.table_index=selected_index;
    this.final_form.db_logic.row_index=0;
    this.final_form.c_title=this.selected_sub.variations[this.selected_item_index].c_title;
    this.final_form.c_title_ar=this.selected_sub.variations[this.selected_item_index].c_title_ar;
    
    this.final_form.c_descps_en=this.selected_sub.variations[this.selected_item_index].c_descps_en;
    this.final_form.c_descps_ar=this.selected_sub.variations[this.selected_item_index].c_descps_ar;

    this.final_form.table_title_ar=this.selected_sub.variations[this.selected_item_index].tables[selected_index].table_print_name_en;
    this.final_form.table_title_en=this.selected_sub.variations[this.selected_item_index].tables[selected_index].table_print_name_en;

    this.final_form.table_size_ar=this.selected_sub.variations[this.selected_item_index].tables[selected_index].ara_title_size;
    this.final_form.table_size_en=this.selected_sub.variations[this.selected_item_index].tables[selected_index].eng_title_size;
    if(this.selected_sub.variations[this.selected_item_index].tables[selected_index].unit_name==null){
      this.final_form.unit_name="";
    }else{
      this.final_form.unit_name=this.selected_sub.variations[this.selected_item_index].tables[selected_index].unit_name;
    }
    if(this.selected_sub.variations[this.selected_item_index].tables[selected_index].unit_name_ar==null){
      this.final_form.unit_name_ar="";
    }else{
      this.final_form.unit_name_ar="("+this.selected_sub.variations[this.selected_item_index].tables[selected_index].unit_name_ar+")";
    }

    // ADD META TITLE
    if(this.selectedLang!=1){
      this.title.setTitle(this.selected_sub.variations[this.selected_item_index].meta_title_en);
      this.meta.updateTag({name:'title',content:this.selected_sub.variations[this.selected_item_index].meta_title_en});
      this.meta.updateTag({name:'description',content:this.selected_sub.variations[this.selected_item_index].meta_descps_en});
      this.meta.updateTag({name:'keywords',content:this.selected_sub.variations[this.selected_item_index].meta_keys_en});
    }else{
        this.title.setTitle(this.selected_sub.variations[this.selected_item_index].meta_title_ar);
        this.meta.updateTag({name:'title',content:this.selected_sub.variations[this.selected_item_index].meta_title_ar});
        this.meta.updateTag({name:'description',content:this.selected_sub.variations[this.selected_item_index].meta_descps_ar});
        this.meta.updateTag({name:'keywords',content:this.selected_sub.variations[this.selected_item_index].meta_keys_ar});
    }
    this.seoService.updateCanonicalUrl();
    this.update_s_price();
  }
  updateSize()
  {
    this.update_s_price();
  }
  selectFirstFace()
  {
    
    this.final_form.db_logic.face_index = 0;
    //this.selected_item_index = 0;
  }

  miniChange(q)
  {
    this.final_form.db_logic.row_index = 0;
    for(var z = 0; z<=this.selected_cat.subs.length-1; z++)
    {
      this.selected_cat.subs[z].selected = 0;
      //this.option_enabled = true;
    }
    //selected_cat
    this.selected_cat.subs[q].selected=1;
    this.selected_sub=this.selected_cat.subs[q];
    this.final_form.db_logic.selected_table = {rows:[]};
    this.updateAvailableSlots();
    //this.referesh_selection();
    this.options = this.selected_sub.options;
    //this.selected_cat.subs[q] = this.selected_cat.subs[q];
    for(var vr = 0; vr<=this.options.length-1; vr++)
    {
      this.options[vr].vals = this.options[vr].values.split("\n");
    }
    this.update_s_price();
    //console.log("new Selected SUB");
    //console.log(this.selected_sub);
  }
  logoType(i)
  {


    if(this.logo_type==i)
    {
      this.total.logo=0;
      this.final_form.logo.logo_create.selected=0;
      this.final_form.logo.logo_file.selected=0;
      this.logo_type=0;
      return;
    }

    if(i==1) this.total.logo=0;
    if(i==2) this.total.logo=this.total.s_logo;


    if(i==1)
    {
      this.final_form.logo.logo_file.selected=1;
      this.final_form.logo.logo_create.selected=0;
    }
    else{
      this.final_form.logo.logo_file.selected=0;
      this.final_form.logo.logo_create.selected=1;
    }


    this.logo_type=i;
    this.update_total();
  }
  colorType(i)
  {
    this.color_type=i;
    if(i==1)
    {
      this.final_form.color.choose_color.selected=1;
      this.final_form.color.create_color.selected=0;
    }
    else{
      this.final_form.color.choose_color.selected=0;
      this.final_form.color.create_color.selected=1;
    }
  }

  toRGB(){
    var c = this.final_form.color.create_color.color.c;
    var m = this.final_form.color.create_color.color.m;
    var y = this.final_form.color.create_color.color.y;
    var k = this.final_form.color.create_color.color.k;

    var normalized = false;
    c = (c / 100);
    m = (m / 100);
    y = (y / 100);
    k = (k / 100);
    
    c = c * (1 - k) + k;
    m = m * (1 - k) + k;
    y = y * (1 - k) + k;
    
    var r = 1 - c;
    var g = 1 - m;
    var b = 1 - y;
    
    if(!normalized){
        r = Math.round(255 * r);
        g = Math.round(255 * g);
        b = Math.round(255 * b);
    }
    var color = this.rgbToHex(r,g,b);
    //console.log("Final color");
    //console.log( color);
    this.theRGBcolor =  color;
    this.final_form.color.create_color.hex_color = color;
  } 
  rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  
  }
  changeItemName(i,ii)
  {
    // alert(ii)
    console.log("CUSTOM");
    console.log(this.selected_item_index);
    this.selected_item_index = ii;
    this.final_form.db_logic.row_index = 0;
    this.updateAvailableSlots()
  }
  // checkData()
  // {
  //   console.log(this.selected_sub.variations);
  // }
  changeMenu(i,ii)
  {
    // console.log(e.target.selectedIndex);
    var all = this.selected_sub.variations[this.selected_item_index].options[i].options;
    for(var q= 0; q<=all.length-1; q++)
    {
      all[q].selected = 0;
    }
    all[ii].selected=1;
    this.selected_sub.variations[this.selected_item_index].options[i].options = all;
    // this.updateAvailableSlots();
    

    this.update_s_price();
  }

  // update_s_price__old()
  // {
  //   setTimeout(()=>{
      
  //   if(this.final_form.db_logic.minQty>this.final_form.statics.qty)
  //   {
  //     this.cService.notify(true,"Minium "+this.final_form.statics.min_qty+" is required to order",false,true,false);
  //     return;
  //   }
  //   var price = 0;

  //   var all = this.selected_sub.options;

  //   for(var i = 0; i<=all.length-1; i++)
  //   {
  //     var options = all[i].options;

  //     for(var q=0; q<=options.length-1; q++)
  //     {
  //       if(options[q].selected==1)
  //       {
  //         price += parseFloat(options[q].price);
  //         break;
  //       }
  //     }
  //   }


   
  //   var lc = this.final_form.statics;
		
  //   // Calculate Price.

  //   lc.height_val = lc.height==1?lc.height_val:1;
  //   lc.width_val = lc.width==1?lc.width_val:1;

  //   lc.faces_price = lc.faces==1?lc.faces:0;
  //   lc.faces_val = lc.faces==1?lc.faces_val:1;

  //   lc.base_val = lc.base==1?lc.base_val:1;
  //   lc.sides_val = lc.sides==1?lc.sides_val:1;
  //   lc.sides_price = lc.sides==1?lc.sides_price:0;

  //   lc.colors_price = lc.colors==1?lc.colors_price:0;
  //   lc.colors_val = lc.colors==1?lc.colors_val:0;
    
    

  //   var total_faces_price = lc.height_val * lc.width_val * lc.faces_price;
	// 	var total_sides_price = (lc.base_val + (lc.sides_val * 2)) * lc.sides_price;
		
	// 	var total_colors_price = lc.colors_price * lc.colors_val * lc.faces_val;
	// 	var stamps_qty = lc.colors_val * lc.faces_val;
  //   var total_stamps_price = lc.stamps_price * stamps_qty;

	// 	var item_price = (total_faces_price + total_sides_price  + total_colors_price) * 1;
  //   item_price = Math.round(item_price * 100)/100;
    
  //   this.final_form.statics.pc_price = total_faces_price + total_sides_price;

	// 	var total_price = item_price * lc.qty;
	// 	var item_total_price = total_price + total_stamps_price;
	// 	// End Calculate Price.
		
	// 	// // Assign new value to price elements in web page.
	// 	// $("#item_price").val(item_price.toFixed(2));
	// 	// $("#item_price_calculator").val(item_price.toFixed(2));
	// 	// $("#item_total_items").html(total_price.toFixed(0));
	// 	// $("#item_total_stamps").html(total_stamps_price.toFixed(0));
	// 	// $("#product_stamps_price").val(stamps_price);
	// 	// $("#product_stamps_qty").val(stamps_qty);
	// 	// $("#item_total_price").html(item_total_price.toFixed(2));


  //   this.total.logo = this.logo_type==1?0:this.total.s_logo;

  //   total_price = item_total_price+price;
  //   total_stamps_price = total_stamps_price + this.total.logo;

  //   this.total.only_items_price = total_price.toFixed(0);
  //   this.total.stamps_price = total_stamps_price.toFixed(0);

  //   this.total.s_price =total_price + total_stamps_price;


  //   this.update_total();

  // },500)


  // }

  update_s_price()
  {
    setTimeout(()=>{
      
    if(this.final_form.db_logic.minQty>this.final_form.statics.qty)
    {
      this.cService.notify(true,"Minium "+this.final_form.statics.min_qty+" is required to order",false,true,false);
      return;
    }
    var price = 0;

    var all = this.selected_sub.variations[this.selected_item_index].options;

    for(var i = 0; i<=all.length-1; i++)
    {
      var options = all[i].options;

      for(var q=0; q<=options.length-1; q++)
      {
        if(options[q].selected==1)
        {
          price += Math.round( parseFloat(options[q].price));
          break;
        }
      }
    }


   
    var lc = this.final_form.statics;
    var db = this.final_form.db_logic;
		
    // Calculate Price.

    // lc.height_val = lc.height==1?lc.height_val:1;
    // lc.width_val = lc.width==1?lc.width_val:1;

    // lc.faces_price = lc.faces==1?lc.faces:0;
    // lc.faces_val = lc.faces==1?lc.faces_val:1;

    // lc.base_val = lc.base==1?lc.base_val:1;
    // lc.sides_val = lc.sides==1?lc.sides_val:1;
    // lc.sides_price = lc.sides==1?lc.sides_price:0;

    // lc.colors_price = lc.colors==1?lc.colors_price:0;
    // lc.colors_val = lc.colors==1?lc.colors_val:0;
    
    

    // var total_faces_price = lc.height_val * lc.width_val * lc.faces_price;
		// var total_sides_price = (lc.base_val + (lc.sides_val * 2)) * lc.sides_price;
		
		// var total_colors_price = lc.colors_price * lc.colors_val * lc.faces_val;
		var stamps_qty = parseInt(db.selected_table.rows[db.row_index].faces[db.face_index].print_index)+1;
    // var total_stamps_price = lc.stamps_price * stamps_qty;
    var total_stamps_price = 0;
		// var item_price = (total_faces_price + total_sides_price  + total_colors_price) * 1;
    var item_price = (db.selected_table.rows[db.row_index].faces[db.face_index].price) * 1;
    //console.log("selected face");
    //console.log(db.selected_table.rows[db.row_index].faces[db.face_index]);
    item_price = Math.round(item_price * 100)/100;
    
    this.final_form.statics.pc_price = item_price + price;

		var total_price = item_price * lc.qty;
		var item_total_price = (total_price + total_stamps_price);
		// End Calculate Price.
		
		// // Assign new value to price elements in web page.
		// $("#item_price").val(item_price.toFixed(2));
		// $("#item_price_calculator").val(item_price.toFixed(2));
		// $("#item_total_items").html(total_price.toFixed(0));
		// $("#item_total_stamps").html(total_stamps_price.toFixed(0));
		// $("#product_stamps_price").val(stamps_price);
		// $("#product_stamps_qty").val(stamps_qty);
		// $("#item_total_price").html(item_total_price.toFixed(2));


    this.total.logo = this.logo_type==2?this.total.s_logo:0;
    this.total.shipping = parseFloat(this.selected_sub.shipping);
    total_price = item_total_price+price;
    // total_stamps_price = total_stamps_price + this.total.logo;

    this.total.only_items_price = total_price.toFixed(2);
    // this.total.stamps_price = total_stamps_price.toFixed(2);

    this.total.s_price =total_price + total_stamps_price;
    this.total.s_price = parseFloat(this.total.s_price.toFixed(2));


    this.update_total();

  },500)


  }
  update_total()
  {
    
    this.total.price = this.total.s_price;
    

    var total = this.total.price + this.total.shipping + this.total.logo;

    var vat = this.total.s_vat / 100;
    //vat = (vat*total);
    vat = 0;
    this.total.vat = Math.round(vat);
    total = vat + total;

    var down = Math.round(total/2);

    this.total.down = down;
    this.total.sub_total = Math.round(total);
    this.total.total = Math.round(down);
  }
  handleFileInput(files: FileList) {
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
        this.cService.notify(true,"File uploaded successfully!",true,false,false);
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
  doNothing()
  {

  }
  buyNow()
  {
   
    if(this.current_step==2)
    {
      this.payment_popup=true;
      return;
    }
    
    if(this.logo_type!=0) {
      if(this.logo_type==1)
      {
        if(this.final_form.logo.logo_file.file_name=="")
        {
          this.cService.notify(true,"Your must select a logo file, or choose create logo",false,true,false);
          return;
        }
      }
      else{
        if(this.final_form.logo.logo_create.logo_name=="")
        {
          this.cService.notify(true,"Your must enter logo name",false,true,false);
          return;
        }
        if(this.final_form.logo.logo_create.logo_desc=="")
        {
          this.cService.notify(true,"Your must enter logo description",false,true,false);
          return;
        }
      }
    }
    else {
      this.cService.notify(true,"Your must Select a logo type",false,true,false);
      return;
    }

    if(this.color_type==1)
    {
      if(this.final_form.color.choose_color.color=="")
      {
        this.cService.notify(true,"Your must choose a color",false,true,false);
        return;
      }
    }
    else{
      if(
        this.final_form.color.create_color.color.c==null
        || this.final_form.color.create_color.color.m==null
        || this.final_form.color.create_color.color.y==null
        || this.final_form.color.create_color.color.k==null
      )
      {
        this.cService.notify(true,"Your must choose a color",false,true,false);
        return;
      }
    }

    if(this.final_form.notes.length<=10)
    {
      // this.cService.notify(true,"Your must enter some meaningful notes",false,true,false);
      // return;
    }
    var selected_options = [];

    var all_options = this.selected_sub.variations[this.selected_item_index].options;
    for(var i = 0; i<=all_options.length-1; i++)
    {
      var all_values = all_options[i].options;

      for(var q = 0; q<=all_values.length-1; q++)
      {

        if(all_values[q].selected==1)
        {
          if(this.selectedLang!=1){
            var sel = {title:all_options[i].title,value:all_values[q].en,id:all_options[i].id,price:all_values[q].price};
          } else {
            var sel = {title:all_options[i].title_ar,value:all_values[q].ar,id:all_options[i].id,price:all_values[q].price};
          }

          selected_options.push(sel);
        }
      }
    }


    


    this.loading=true;


    this.final_form.options = selected_options;

    this.final_form.logo.logo_type=this.logo_type;

    this.final_form.total = this.total;
  
    this.final_form.sub_cat_id = this.selected_sub.id;

    this.final_form.junk_login = this.junk_login;
    this.final_form.junk_login_for = this.junk_login_for;
    // this.final_form.table_json = this.final_form
   // lang_id = this.selectedLang
    //thlang_id = this.selectedLang;
    //console.log(this.final_form);

    this.custService.orderNow(this.final_form,this.selectedLang).subscribe((data:any)=>{
      if(data.action=="success")
      {
        if(this.logged_in){
          this.order_id = data.order_id;
          this.paypal_key = data.paypal_key;
          this.paypal_allowed = data.paypal_allowed;
          this.payment_method = data.paypal_allowed==1?1:3;
          this.payfort = data.payfort;
          // this.show_payment_popup();
          this.cService.notify(true,"We have Received your custom order (Order #"+data.order_id+")",false,false,false);
          this.router.navigate(["/view-custom-order/",this.order_id]);
          this.current_step =2;
        }
        else{
          this.router.navigate(["/login"]);
        }
      }
      else
      {
        this.cService.notify(true,data.error,false,true,false);
        this.loading=false;
        return;
      }
    }); 
    
  }
  show_payment_popup()
  {
    this.payment_popup=true;
  }
  paymentMethod(i)
  {
    this.payment_method = i;
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
  cancelPayment()
  {
    this.payment_popup=false;
    this.router.navigate(["/profile"]);
  }
}

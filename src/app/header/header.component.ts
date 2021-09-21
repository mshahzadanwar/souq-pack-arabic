import { Component, OnInit, Inject, HostListener, ElementRef, ViewChild } from '@angular/core';
import {HeaderService} from './header.service';
import { CommonService } from '../common.service';
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('toggleButton') toggleButton: ElementRef;
  @ViewChild('navCatContent') menu: ElementRef;
  cats = [];
  nav_hidden=true;
  cart_items=[];
  logo="def"
  regions=[];
  selectedRegion=0
  total="0";
  currency="SAR"
  region_selection={region_id:0};
  php_url=""
  search={category:0,search:""}
  webphone=""
  selectedRegionText="Default"
  allowed_opening = true
  user_firstname = ""
  user_lastname = ""

  



  @HostListener('document:click', ['$event'])
  clickout(event) {
    // console.log(event.path[0]);
    // if(!this.menu.nativeElement.contains(event.target) && window.innerWidth<768) {
    //   if(!this.nav_hidden) this.toggleNav();
    // }
  }



  constructor(
    private eRef: ElementRef,
    private hService:HeaderService,
    private cServie:CommonService,
    private router:Router,
    @Inject(DOCUMENT) private _document: HTMLDocument
  ) { 
   
    var first_time = true;
    this.php_url=this.cServie.apiUrlPhp;
    router.events.subscribe((evall:any)=>{
      // console.log(this.router.url);
      setTimeout(()=>{
        this.cServie.update_cust_screen(false)
      },500);
      if(evall instanceof NavigationEnd)
      {
        
        if(evall.url=="/")
        {
          if(first_time)
          {
            if(window.innerWidth>768) this.nav_hidden=false;
          }
          else
          this.nav_hidden=false;
        }
        else{
          this.nav_hidden=true;
        }
        first_time=false;
      }
    })

    this.look_after_cart();
  }

  routeCustom(slug)
  {
    this.allowed_opening=false;
    setTimeout(()=>{
      this.allowed_opening=true
    },100);
    this.router.navigate(["category",slug]);
  }
  
  look_after_cart()
  {
    this.cServie.cart_items.subscribe((cart_items)=>{
      this.cart_items = cart_items;

      if(cart_items!=null && cart_items.length!=0)
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
    this.total = parseFloat(total.toString()).toFixed(2);
  }


  fix2(val)
  {
    return parseFloat(val.toString()).toFixed(2);
  }

  selectedLang=1

  toggleNav()
  {
    this.nav_hidden = false;
  }


  

  ngOnInit(): void {
    
      
      setTimeout(()=>{
        this.selectedLang = this.cServie.selectedLang;
        this.selectedRegion = this.cServie.selectedRegion;
      this.getCatsS(this.selectedLang);
      this.getImpData(this.selectedLang);
        
        // this.cServie.currency.subscribe((c)=>{
        //   this.currency=c;
        // });
        this.cServie.imp.subscribe((data:any)=>{
          this.currency=data.currency;
        });

        this.cServie.getItem("login_data").then((r)=>{
          var data = JSON.parse(r);
          this.user_firstname = data.first_name;
          this.user_lastname = data.last_name;
        })
      },1000);

    
  }
  
  langChange(i)
  {
    this.selectedLang = i;
      this.cServie.setItem("lang_id",i).then(()=>{
        localStorage.removeItem('home_date');
        localStorage.removeItem('home_date_ar');
        localStorage.removeItem('cart_items');
        if(i==1){
          location.href = this.cServie.webURL+this.router.url;
        }
        else {
          location.href = this.cServie.webURL+"en"+this.router.url;
        }
    });
  }

  getCatsS(lang_id:number)
  {
    this.hService.getCats({lang_id:lang_id}).subscribe((data:any)=>{
      if(data.action=="success")
      {
        //console.log( data.data.categories);
        this.cats = data.data.categories;
      }
      else{
        //console.log("Coudn't load data");
      }
    })
  }
  get_ip()
  {
    this.hService.getip().subscribe((data:any)=>{
      //console.log(data);
      if(data.country=="SA")
      {
        if(this.selectedRegion!=1)
        {
         
          //this.onChange(1,true)
        }
      }
    })
  }
  getImpData(lang_id:number)
  {
    this.hService.getImpData({lang_id:lang_id}).subscribe((data:any)=>{
      if(data.action=="success")
      {
        this.get_ip()
        //console.log("Important Data:");
        //console.log(data.data);
        this.webphone = data.data.phone;
        this.regions = data.data.regions;

        var regs = this.regions;
        var winner = false;
        for(var q = 0; q<=regs.length-1; q++)
        {
          if(regs[q].id==this.selectedRegion)
          {
            this.selectedRegionText=regs[q].value;
            this.cServie.update_currency(regs[q].currency);
            winner = true;
          }
        }
        if(!winner)
        {
          this.onChange(regs[0].id,true)
        }
        this._document.getElementById('appFavicon').setAttribute('href', data.data.favicon);
        this.logo = data.data.logo;

        this.cServie.update_imp(data.data);

        

        this.cServie.setItem("imp_data",JSON.stringify(data.data));
      }
      else{
        console.log("Coudn't load data");
      }
    })
  }
 
  removeItem(ind)
  {
    var all = this.cart_items;
    all.splice(ind,1);
    this.cart_items=all;
    this.update_total();

    this.cServie.setItem("cart_items",JSON.stringify(this.cart_items));
  }
  onSubmit(form:any)
  {
    this.cServie.update_search(this.search);
    this.router.navigate(['/search']);
  }
  
  onChange(e,force=false)
  {
    var link_urlss = "";
    if(e == 3) {link_urlss = "ae.";}
    if(!force){
      var x= confirm("On change of region, your cart will be flushed, do you want to continue?");
      if(x)
      {
          setTimeout(()=>{
            localStorage.clear();
          },500);
          this.cServie.setItem("region_id",e).then(()=>{
            this.cServie.setItem("cart_items",null).then(()=>{
              window.location.href = 'https://'+link_urlss+'souqpack.com';
            });
          
          });
       }
    }
    else{
      setTimeout(()=>{
        localStorage.clear();
      },500);
      this.cServie.setItem("region_id",e).then(()=>{
        this.cServie.setItem("cart_items",null).then(()=>{
          window.location.href = 'https://'+link_urlss+'souqpack.com';
        });
      
      });
    }
  }

}


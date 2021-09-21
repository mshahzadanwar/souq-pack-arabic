import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as scripts from './../../assets/js/scripts.js';
import { CommonService } from '../common.service';
import { ActivatedRoute,Router, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import {ContactUsService} from './contact-us.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SEOService } from './../seo.service';


declare var slick_slider: any;
declare var slider_init: any;
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ContactUsComponent implements OnInit {

  selectedLang=1
  dataLoaded=false
  phpApiUrl=""
  related:any=[]
  slug=""
  php_url = ""
  userSubscription: Subscription;
  title="Contact Us"
  signup:any={}
  printData:any={}

  product:any={}

  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private cService:CommonService,
    private pService:ContactUsService,
    public sanitizer: DomSanitizer,
    private seoService: SEOService,
  ) { }

  ngOnInit(): void {
    setTimeout(()=>{
      this.selectedLang=this.cService.selectedLang;
      this.userSubscription = this.route.params.subscribe(
          (params: Params) => {
            
            // var slug = this.route.snapshot.paramMap.get('slug');
            // this.do_init(slug,true);

    })
    
    this.printData = JSON.parse(localStorage.getItem("imp_data"));

    },500);
    this.seoService.updateCanonicalUrl();
  }

  onSubmit(form)
  {
    // this.dataLoaded=false
    
    this.phpApiUrl = this.cService.apiUrlPhp;
    this.php_url = this.cService.apiUrlPhp;
    


    this.signup.lang_id=this.selectedLang;

    this.pService.postContact(
      this.signup
      ).subscribe((data:any)=>{
      if(data.action=="success")
      {
        
       this.cService.notify(true,"Your message has been received, we'll get back to you as soon as possible",false,false,false);
       form.form.reset();
       
      }
      else{
        this.cService.notify(true,"Network error, please try later",true,false,false);
      }
    })
  }
  ngOnDestroy(): void {
      this.userSubscription.unsubscribe()
  }
  

}

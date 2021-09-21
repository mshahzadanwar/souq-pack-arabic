import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as scripts from './../../assets/js/scripts.js';
import { CommonService } from '../common.service';
import { ActivatedRoute,Router, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import {AboutUsService} from './about-us.service';
import { DomSanitizer,Meta,Title } from '@angular/platform-browser';
import { SEOService } from './../seo.service';
declare var slick_slider: any;
declare var slider_init: any;
@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AboutUsComponent implements OnInit {

  selectedLang=1
  dataLoaded=false
  phpApiUrl=""
  related:any=[]
  slug=""
  php_url = ""
  userSubscription: Subscription;
  title=""
  content=""
  url=""
  faq = []
  faqdataLoaded=false

  product:any={}

  constructor(
    private route:ActivatedRoute,
    private router:Router,
    private cService:CommonService,
    private pService:AboutUsService,
    public sanitizer: DomSanitizer,
    private meta:Meta,
    private t_title:Title,
    private seoService: SEOService,
    
  ) { }

  ngOnInit(): void {

    this.userSubscription = this.route.params.subscribe(
        (params: Params) => {
          this.url = params.link;
          var slug = this.route.snapshot.paramMap.get('slug');
          this.do_init(slug,true);
          this.seoService.updateCanonicalUrl();
          

  })

    

  }

  do_init(slug,initt=false)
  {
    // this.dataLoaded=false
    this.selectedLang=this.cService.selectedLang;
    this.phpApiUrl = this.cService.apiUrlPhp;
    this.php_url = this.cService.apiUrlPhp;
    this.slug = slug;

    //this.title.setTitle("FAQ");


    this.pService.getPage({slug:this.slug,lang_id:this.selectedLang}).subscribe((data:any)=>{
      if(data.action=="success")
      {
        
        // this.title=data.data.title;
        // this.content = data.data.content;
        // this.dataLoaded=true;

        if(this.slug == "faq"){
          this.faq=data.data;
          this.faqdataLoaded=true;
          this.dataLoaded=false;
          if(this.selectedLang!=1){
            this.t_title.setTitle("Frequently Asked Questions");
          }else {
            this.t_title.setTitle("أسئلة شائعة");
          }
        }
        else{
          this.title=data.data.title;
          this.content = data.data.content;
          this.dataLoaded=true;
          this.faqdataLoaded=false;
          this.t_title.setTitle(data.data.meta_title);
          this.meta.updateTag({name:'title',content:data.data.meta_title});
          this.meta.updateTag({name:'description',content:data.data.meta_description});
          this.meta.updateTag({name:'keywords',content:data.data.meta_keywords});
        }


        
        

       
      }
      else{
          console.log("idhar");
      }
    })
  }
  ngOnDestroy(): void {
      this.userSubscription.unsubscribe()
  }
  

}

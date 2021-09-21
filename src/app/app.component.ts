import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonService } from './common.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Params } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.css',

  
  ],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit{

  currentBootsrap = "bootstrap.min.css"
  title = 'fordeal';
  dataloaded=true;
  bodyClicked(event)
  {
    // console.log(" Happily Ignored");

    // navCatContent
    // if (!event.target.closest('#menutop').length) {
      // ... clicked on the 'body', but not inside of #menutop
    // }
  }
  constructor(private cService:CommonService,
    
    public sanitizer: DomSanitizer,
    private route:ActivatedRoute,
    ){

  }
  ngOnInit()
  {
    setTimeout(()=>{
      if(this.cService.selectedLang==1)
      {
        this.currentBootsrap = "rbootstrap.min.css";
      }
    },1500);

    // this.route.params.subscribe(
    //   (params: Params) => {
    //     alert(4);
    //     if ((params instanceof NavigationEnd)) {
    //       alert(5)
    //       setTimeout(()=>{
    //         window.scrollTo(0, 0)
    //       },2000)
    //     }
    //   })

  }
}

import { Component, OnInit } from '@angular/core';
import {SearchService} from './search.service';
import { CommonService } from '../common.service';
import * as scripts from './../../assets/js/scripts.js';
declare var slider_init: any;


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  // carousel_slider: any;
  selectedLang=1
  sliced_tabs=[]
  sliders=[]
  offers=[]
  loading=true
  tabs=[]
  brands=[]
  tabsv2=[]
  prods=[]
  php_url = ""
  search={category:0,search:""}
  constructor(
    private hService:SearchService,
    private cService:CommonService
  ) { }

  ngOnInit(): void {

   

    this.cService.search.subscribe((search)=>{
      this.search = search;
    setTimeout(()=>{


       // this.cService.fire_first_shot();
    this.selectedLang=this.cService.selectedLang;
    // this.getHome(this.selectedLang);
    this.php_url = this.cService.apiUrlPhp;
      this.getHome(this.selectedLang);
    },100);
    })
    
    
    
  }
  getHome(lang_id:number)
  {
    // this.search.lang_id = this.selectedLang;
    this.hService.getHome(this.search,lang_id).subscribe((data:any)=>{
      console.log(data);
      if(data.action=="success")
      {
       
        this.tabsv2 = data.data.tabsv2;
        this.loading=false;
        
        // console.log(this.sliced_tabs);
        // setTimeout(() => {
        //   slider_init();
        // }, (2000));
      }
      else{
        console.log("Coudn't load data");
      }
    })
  }
  addso(i)
  {
    return (i+100);
  }
  

}

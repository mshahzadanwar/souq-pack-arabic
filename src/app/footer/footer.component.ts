import { Component, OnInit } from '@angular/core';
import { CommonService } from '../common.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  copy="© 2020 All Rights Reserved by SouqPack"
  butAll:any={}
  imp:any={}
  footer_about:String=""
  footer_about_ar:String=""
  hide_footer:boolean=false

  footers = [
    {title:"",body:""},
    {title:"",body:""},
    {title:"",body:""}
  ]
  selectedLang=1
  logged_in=true
  constructor(private cService:CommonService) { }

  ngOnInit(): void {
    setTimeout(()=>{
      this.selectedLang =this.cService.selectedLang;
      if(this.selectedLang==1)
      {
        this.copy = "© 2020 جميع الحقوق محفوظة بواسطة SouqPack"
      }
      var data = localStorage.getItem("imp_data");
      var dataa = JSON.parse(data);
      this.butAll = dataa;
      this.copy = dataa.copy_right;
      this.cService.getItem("login_data").then((data:any)=>{
        if(data!=null)
        {
          var data2 = JSON.parse(data);
          if(data2.is_guest==1)
          {
            this.logged_in=false
          }
          
        }
        else{
          this.logged_in=false
        }

      });
      this.cService.imp.subscribe((d:any)=>{
        if(!d.footers) return;
        //console.log("-----");
        //console.log(d);

        this.footers = d.footers;
      })

      this.cService.token.subscribe(()=>{
        this.cService.getItem("login_data").then((data:any)=>{
          if(data!=null)
          {
            var data2 = JSON.parse(data);
            if(data2.is_guest==1)
            {
              this.logged_in=false
            }
            
          }
          else{
            this.logged_in=false
          }
  
        });
      })

      this.cService.imp.subscribe((dataa)=>{
        this.imp = dataa;
      })

      this.cService.is_cust_screen_after.subscribe((d)=>{
        this.hide_footer=d
      })
      
    },800);
   
  }

}

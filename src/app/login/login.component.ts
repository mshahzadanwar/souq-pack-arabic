
import { Component, OnInit,Input,Inject,HostBinding } from '@angular/core';
import { Title,Meta }     from '@angular/platform-browser';
import { CommonService } from './../common.service';
import {Login,logged} from './../_models/commonModel';
import {LoginSerivceService} from './login-serivce.service';
import {AlertComponent} from './../_directives/alert.component';
import {home_type} from './../_models/commonModel';

import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";

import { ActivatedRoute,Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @HostBinding('style.display')   display = 'block';
  // @HostBinding('style.position')  position = 'absolute';
  // @Input() login:Login;
  login:any = {};
  logged:logged;
  site_page:home_type;
  user: SocialUser;
  loggedIn: boolean;
  selectedLang=1
  
  constructor(
    private common: CommonService,
    private title: Title,
    private loginService:LoginSerivceService,
    @Inject('Window') private window: Window,
    private router:Router,
    private route:ActivatedRoute,
    private meta:Meta,
    private authService: SocialAuthService

  ) { }
  invalid_login=false;
  ngOnInit() {

    setTimeout(()=>{
      this.selectedLang = this.common.selectedLang;
      this.authService.authState.subscribe((user) => {
        this.user = user;
        console.log(user);
        
        this.loggedIn = (user != null);
        if(this.loggedIn)
        {
          this.log_me_now(user.firstName,user.lastName,user.email,"FB",user.id,"");
        }
      });
  
      // this.common.take_care_of_metas('login');
   
  
      this.login.username="";
      this.login.pass="";
    },800);
    
    
     
  }

  log_me_now(first_name,last_name,email,signup_type,fb_id="",g_id="")
  {
    this.loginService.socialLoggin({
      first_name,
      last_name,
      email,
      signup_type,
      fb_id,
      g_id
    }).subscribe((data:any)=>{
      if(data.action=="success")
      {
        this.common.removeGuest();
        // console.log(data);

        this.common.setItem("login_data",JSON.stringify(data.data)).then(()=>{
          console.log("I come here");
          this.common.update_token(data.data.token);
          
          this.complete_login();
          // this.router.navigate(['/']);
        })
        
        // localStorage.setItem('User',JSON.stringify(data.logged));
        // localStorage.setItem('tok',JSON.stringify(data.norm));
        // this.common.update_token(JSON.stringify(data.norm));
        
        
        // this.window.location.href = this.app_url+"dashboard";
      }
      else{
        this.common.notify(true,"Network error",true,false,false);
        return false;
      }
    });
  }

  php_url = this.common.apiUrlPhp;
  app_url = this.common.apiUrl;
  onSubmit(form)
  {
    var new_form = {email:this.login.username,password:this.login.pass,hash:localStorage.getItem('dev_guid')};
    this.loginService.doLoggin(new_form).subscribe((data:any)=>{
      //  console.log();return;
      if(data.action=="success")
      {
        this.common.removeGuest();
        // console.log(data);

        this.common.setItem("login_data",JSON.stringify(data.data)).then(()=>{
          console.log("I come here");
          this.common.update_token(data.data.token);
          // this.router.navigate(['/']);
          this.complete_login();
        })
        
        // localStorage.setItem('User',JSON.stringify(data.logged));
        // localStorage.setItem('tok',JSON.stringify(data.norm));
        // this.common.update_token(JSON.stringify(data.norm));
        
        
        // this.window.location.href = this.app_url+"dashboard";
      }
      else{
        this.invalid_login = true;
        return false;
      }

     
      // console.log(data);
      
    });
  }
  signInWithGoogle(): void {
    try{
      this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
    }
    catch(e)
    {
      console.log(e);
    }
    
  }
 
  signInWithFB(): void {
    try{
      this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }
    catch(e)
    {
      console.log(e);
    }
  }
 
  signOut(): void {
    this.authService.signOut();
  }
  complete_login()
  {
    setTimeout(()=>{
      this.common.getItem("login_for").then((d)=>{
        if(d && d!=null)
        {
          this.loginService.setOrders(d).subscribe((data:any)=>{
            if(data.action=="success")
            {
              this.common.notify(true,"Your order has been received, and you will be notified once its processed",false,false,false);
              this.router.navigate(["/view-custom-order",data.id]);
            }
            else{
              // this.router.navigate(['/']);
              window.location.href=this.common.webURL+"profile";
            }
          });
        }
        else{
          // this.router.navigate(['/']);
          window.location.href=this.common.webURL+"profile";
        }
      });
    },1500);
  }
}

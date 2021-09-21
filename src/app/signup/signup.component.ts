import { Component, OnInit,Input,Inject,HostBinding } from '@angular/core';
import { Title }     from '@angular/platform-browser';
import { CommonService } from './../common.service';
import {signup,logged} from './../_models/commonModel';
import {SignupServiceService} from './signup-service.service';
import {AlertComponent} from './../_directives/alert.component';


import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";


import { ActivatedRoute,Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  @HostBinding('style.display')   display = 'block';
  signup = {email:'',
    password:'',
    firstname:'',
    lastname:'',
    code_country:"966",
    phone_number:"",
    terms_conditions:0,
  };
  code_picker = []
  user: SocialUser;
  loggedIn: boolean;
  selectedLang=1
  logged:logged;
  constructor(
    private common: CommonService,
    private titleService: Title,
    private signupService:SignupServiceService,
    @Inject('Window') private window: Window,
    private router:Router,
    private authService: SocialAuthService,
    private route:ActivatedRoute
  ) {}
  invalid_signup=false;
  ngOnInit() {
    this.get_countries_list();
    setTimeout(()=>{
      this.selectedLang=this.common.selectedLang;
      this.authService.authState.subscribe((user) => {
        
        this.user = user;
        console.log(user);
        
        this.loggedIn = (user != null);
        if(this.loggedIn)
        {
          this.log_me_now(user.firstName,user.lastName,user.email,"FB",user.id,"");
        }
      
      });
    },800);
    

      // this.common.take_care_of_metas('signup');
  }
  log_me_now(first_name,last_name,email,signup_type,fb_id="",g_id="")
  {
    this.signupService.socialLoggin({
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
        })
        
        // localStorage.setItem('User',JSON.stringify(data.logged));
        // localStorage.setItem('tok',JSON.stringify(data.norm));
        // this.common.update_token(JSON.stringify(data.norm));
        
        
        // this.window.location.href = this.app_url+"dashboard";
      }
      else{
        // this.invalid_login = true;
        this.common.notify(true,"Network error",true,false,false);
        return false;
      }
    });
  }

  php_url = this.common.apiUrlPhp;
  app_url = this.common.apiUrl;


  get_countries_list(){
    this.signupService.get_phone_pickerss(this.signup).subscribe((data:any)=>{
      if(data.action=="success")
      {
        this.code_picker = data.data;
      }
      else{
        this.common.notify(true,data.error,false,true,false);
        return false;
      }
    });
  }

  onSubmit(form)
  { 
    // if(this.signup.terms_conditions == 0){
    //   alert(this.signup.terms_conditions);
    //   return;
    // }
    this.signupService.doSignup(this.signup).subscribe((data:any)=>{
      if(data.action=="success")
      {
        console.log(data);
        this.common.notify(true,'Your account has been setup.... Please wait, while we\'re redirecting to Dashboard.',false,false,false);
        setTimeout(() => {
          this.common.removeGuest();
          this.common.setItem("login_data",JSON.stringify(data.data)).then(()=>{
            this.common.update_token(data.data.token);
            this.complete_login();
          })
        },3000);
      }
      else{
        this.common.notify(true,data.error,false,true,false);
        return false;
      }
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
          this.signupService.setOrders(d).subscribe((data:any)=>{
            if(data.action=="success")
            {
              this.common.notify(true,"Your order has been received, and you will be notified once its processed",false,false,false);
              this.router.navigate(["/view-custom-order",data.id]);
            }
            else{
              this.router.navigate(['/']);
            }
          });
        }
        else{
          this.router.navigate(['/']);
        }
      });
    },1500);
  }
}
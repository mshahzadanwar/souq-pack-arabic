import { Component, OnInit,Input,Inject,HostBinding } from '@angular/core';
import { Title }     from '@angular/platform-browser';
import { CommonService } from './../common.service';
import {signup,logged} from './../_models/commonModel';
import {ForgotPasswordServiceService} from './forgot-password-service.service';
import {AlertComponent} from './../_directives/alert.component';
import { ActivatedRoute,Router } from '@angular/router';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  @HostBinding('style.display')   display = 'block';
  signup = {email:'',username:''};
  token = {token:''};
  logged:logged;
  selectedLang=1
  constructor(
    private common: CommonService,
    private titleService: Title,
    private signupService:ForgotPasswordServiceService,
    @Inject('Window') private window: Window,
    private router:Router,
    private route:ActivatedRoute,
  ) 
  { }
  email_sent = false;
  invalid_signup=false;
  ngOnInit() {
      // this.common.take_care_of_metas('forgot-password');
  }
  php_url = this.common.apiUrlPhp;
  app_url = this.common.apiUrl;
  onSubmit(form)
  {
    this.signupService.doReset(this.signup).subscribe((data:any)=>{
      console.log(data);
      if(data.action=="success")
      {
        this.common.notify(true,data.error,false,false,false);
        this.router.navigate(['/login']);
      }
      else{
        this.common.notify(true,data.error,false,true,false);
        return false;
      }


      // if(data.logged==1)
      // {
      //   this.common.notify(true,'Please check your email address for temporary Password!',false,true,false);
      //   setTimeout(() => {
      //   this.common.notify(true,'Redirecting You back to Login page.',true,false,false);
      //   },3000);
      //   setTimeout(() => {
      //     this.router.navigate(['/login']);
      //   },3000);
      // }
      // else{
      //   this.common.notify(true,'Oopsss... Unable to sent email.... Email Address not Exist!',false,true,false);
      //   this.invalid_signup = true;
      //   this.email_sent = false;
      //   return false;
      // }
    });
  }
}
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpClientModule,HttpClient } from '@angular/common/http';
// for HttpClient import:
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';

import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
  AmazonLoginProvider,
} from 'angularx-social-login';

// for Router import:
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

// for Core import:
import { LoadingBarModule } from '@ngx-loading-bar/core'; 


import { LoginComponent } from './login/login.component';
import { LoginSerivceService } from './login/login-serivce.service';

import { SignupComponent } from './signup/signup.component';
import { SignupServiceService } from './signup/signup-service.service';

import { NotificationAlertsComponent } from './common-pages/notification-alerts/notification-alerts.component';




import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PdetailsComponent } from './pdetails/pdetails.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './_guards';
import { AuthenticationService } from './_services';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import { ForgotPasswordServiceService } from './forgot-password/forgot-password-service.service';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CategoryComponent } from './category/category.component';
import { PaynowComponent } from './paynow/paynow.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { SearchComponent } from './search/search.component';
import { OffersComponent } from './offers/offers.component';
import { CustomizerComponent } from './customizer/customizer.component';
import { ScreenblockerComponent } from './common-pages/screenblocker/screenblocker.component';
import { VcustomizerComponent } from './vcustomizer/vcustomizer.component';
import { ThankyouComponent } from './thankyou/thankyou.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    PdetailsComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    NotificationAlertsComponent,
    ForgotPasswordComponent,
    CartComponent,
    CheckoutComponent,
    CategoryComponent,
    PaynowComponent,
    AboutUsComponent,
    ContactUsComponent,
    WishlistComponent,
    SearchComponent,
    OffersComponent,
    CustomizerComponent,
    ScreenblockerComponent,
    VcustomizerComponent,
    ThankyouComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    LoadingBarHttpClientModule,
    SocialLoginModule,

    // for Router use:
    LoadingBarRouterModule,

    // for Core use:
    LoadingBarModule,
    NgxPayPalModule
  ],
  providers: [
    HttpClientModule,
    AuthGuard,
    LoginSerivceService,
    SignupServiceService,
    AuthenticationService,
    ForgotPasswordServiceService,
    { provide: 'Window',  useValue: window },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '265444509919-qu1sstl33vkkt6gorvm73ee4b086dfl8.apps.googleusercontent.com'
            ),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('2667541856839235'),
          }
        ],
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

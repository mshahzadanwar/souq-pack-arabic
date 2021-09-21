import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PdetailsComponent } from './pdetails/pdetails.component';
import { AuthGuard } from './_guards/index';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CategoryComponent } from './category/category.component';
import { PaynowComponent } from './paynow/paynow.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { SearchComponent } from './search/search.component';
import { OffersComponent } from './offers/offers.component';
import { CustomizerComponent } from './customizer/customizer.component';
import { VcustomizerComponent } from './vcustomizer/vcustomizer.component';
import { ThankyouComponent } from './thankyou/thankyou.component';

const routes: Routes = [
  {path:"",component:HomeComponent,pathMatch:"full"},
  {path:"product/:slug",component:PdetailsComponent},
  {path:"category/:slug",component:CategoryComponent},
  {path:"offer/:slug",component:OffersComponent},
  {path:'login',component:LoginComponent},
  {path:'signup',component:SignupComponent},
  {path:"forgot-password",component:ForgotPasswordComponent},
  {path:"cart",component:CartComponent},
  {path:"page/:slug",component:AboutUsComponent},
  {path:"contact-us",component:ContactUsComponent},
  {path:"search",component:SearchComponent},
  {path:"customizer/:slug",component:CustomizerComponent},
  {path:"thank-you",component:ThankyouComponent},
  

  // login protected
  {path:'profile',component:ProfileComponent,canActivate:[AuthGuard]},
  {path:"checkout",component:CheckoutComponent,canActivate:[AuthGuard]},
  {path:"pay/:oid",component:PaynowComponent,canActivate:[AuthGuard]},
  {path:"wishlist",component:WishlistComponent,canActivate:[AuthGuard]},
  {path:"view-custom-order/:id",component:VcustomizerComponent},
  {path:"view-order/:id",component:VcustomizerComponent},




];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false,scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

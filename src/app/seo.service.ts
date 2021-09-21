import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
 
@Injectable({
   providedIn: 'root'
})
export class SEOService { 
  constructor(@Inject(DOCUMENT) private dom) { 
      
    
  }
    
  updateCanonicalUrl(val=""){
    // console.log("DOCYENT");
    // console.log(document.location.href);
    const head = this.dom.getElementsByTagName('head')[0];
    var element: HTMLLinkElement= this.dom.querySelector(`link[rel='canonical']`) || null
    if (element==null) {
      element= this.dom.createElement('link') as HTMLLinkElement;
      head.appendChild(element);
    }
    element.setAttribute('rel','canonical');
    if(val != ""){
      console.log("SLUGGGGGG");
      console.log(document.location);
      element.setAttribute('href',document.location.host+"/"+val);
    } else{
      element.setAttribute('href',document.location.href);
    }
    
  }
}  
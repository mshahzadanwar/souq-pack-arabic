import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CommonService } from '../common.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router,private cService:CommonService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        var data = localStorage.getItem('login_data');
        var data2=JSON.parse(data);
        if (data && data2.is_guest==0) {
            // logged in so return true
            return true;
        }
        else{
            
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}
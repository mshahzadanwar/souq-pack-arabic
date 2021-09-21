import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../common.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';


@Injectable()
export class AuthenticationService {
    constructor(
        private authService: SocialAuthService,
        private http: HttpClient,private cServie:CommonService,private router:Router) { }

    login(username: string, password: string) {
        return this.http.post<any>(this.cServie.apiUrl+'/login', { username: username, password: password })
            .subscribe(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('login_data', JSON.stringify(user));
                }

                return user;
            });
    }

    logout() {
        // remove user from local storage to log user out
        this.authService.signOut();
        this.cServie.setItem('login_data',null).then(()=>{
            this.cServie.install_guest();
            this.router.navigate(['/login']);
        });
       
    }
}
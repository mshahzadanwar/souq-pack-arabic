import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../common.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Injectable()
export class UserService {
    constructor(private http: HttpClient,private cServie:CommonService,private router:Router) { }

    // do_wish(id) {
    //     this.cServie.token.subscribe((v)=>{
    //         if(v)
    //         {
    //             this.http.post(this.cServie.apiUrl+"")
    //         }
    //     })
    // }
}
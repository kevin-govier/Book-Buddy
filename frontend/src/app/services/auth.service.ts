import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';
import { first, tap, catchError } from 'rxjs/operators';

import { User } from '../models/User';
import { ErrorHandlerService } from './error-handler.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService{

  private url = "http://localhost:3000/auth";

  isUserLoggedIn$ = new BehaviorSubject<boolean>(this.checkLoginStatus());
  userId: number;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" })
  }

  constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService, private router: Router){ 
    if(this.checkLoginStatus() == true){      
      this.userId = parseInt(localStorage.getItem("userId"));
    }
    else{
      this.userId = undefined;
    }
  }

  signup(user: Omit<User, "id">): Observable<User> {
    return this.http.post<User>(`${this.url}/signup`, user, this.httpOptions).pipe(
      first(), 
      catchError(this.errorHandlerService.handleError<User>("signup"))
    );
  }

  login(email: Pick<User, "email">, password: Pick<User, "password">): Observable<{token:string; userId:Pick<User, "id">}> {
    return this.http.post(`${this.url}/login`, {email, password}, this.httpOptions).pipe(
      first(),
      tap((tokenObject: {token: string; userId: Pick<User, "id">}) => {
        this.userId = parseInt(tokenObject.userId.toString());
        console.log('(AUTH SERVICE) user ID:' + this.userId);
        localStorage.setItem("token", tokenObject.token);        
        localStorage.setItem("userId", tokenObject.userId.toString());
        localStorage.setItem('loginStatus', '1');
        
        this.isUserLoggedIn$.next(true);
        
        console.log('(AUTH SERVICE) isUserLoggedIn$:', this.isUserLoggedIn$.value);
        this.router.navigate([""]);
      }), 
      catchError(this.errorHandlerService.handleError<{token:string; userId:Pick<User, "id">}>("login"))
    );
  }

  checkLoginStatus(): boolean {
    var loginStatus = localStorage.getItem("loginStatus");
    if(loginStatus == "1"){
      return true;
    }
    return false;
  }
}
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { DialogueService } from './dialogue.service';
import { catchError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private router: Router, private authService: AuthService, private dialogueService: DialogueService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error.status === 401) {
          this.logout();
        } else if (error.status >= 500) {
          this.handleError(error);
        }
        return throwError(error);
      })
    );
  }
  
  private handleError(error: HttpErrorResponse): void {
    console.error('Server Error:', error.message);
  }

  private logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    
    localStorage.setItem('loginStatus', '0');
    this.authService.isUserLoggedIn$.next(false);
    this.router.navigate(['login']);
    this.dialogueService.openDialog('Session expired.');
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }
}
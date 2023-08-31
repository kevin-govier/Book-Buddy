import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    console.log('(AUTH GUARD) isUserLoggedIn$:', this.authService.isUserLoggedIn$.value);
    if (this.authService.isUserLoggedIn$.value) {
      return true; // Allows access if the user is logged in
    } else {
      this.router.navigate(['/login']); // Sends the user to login page if they aren't logged in
      return false;
    }
  }
}
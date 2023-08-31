import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Book Bro';
  isAuthenticated = false;
  
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isUserLoggedIn$.subscribe((isLoggedIn) => {
      this.isAuthenticated = isLoggedIn;
    })
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.setItem('loginStatus', '0');
    this.authService.isUserLoggedIn$.next(false);
    this.router.navigate(["login"]);
  }
}
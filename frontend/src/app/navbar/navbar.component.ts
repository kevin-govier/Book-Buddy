import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DialogueService } from '../services/dialogue.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isAuthenticated = false;
  isNavActive = false;

  constructor(private authService: AuthService, private router: Router, private dialogueService: DialogueService) { }

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
    this.dialogueService.openDialog('Logout Successful!');
  }
}

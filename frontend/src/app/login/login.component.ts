import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../services/auth.service';
import { DialogueService } from '../services/dialogue.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  userId: number;
  
  constructor(private authService: AuthService, private dialogueService: DialogueService) {}

  ngOnInit(): void {
    this.loginForm = this.createFormGroup();
    this.userId = this.authService.userId;
    console.log("(LOGIN) user ID: " +this.userId);
  }

  createFormGroup(): FormGroup{
    return new FormGroup({
        email: new FormControl("", [Validators.required, Validators.email]),
        password: new FormControl("", [Validators.required, Validators.minLength(7)])
    }); 
  }

  login(): void {
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(
      () => {
        if (this.authService.checkLoginStatus() === true) {
          setTimeout(() => {
            window.location.reload();
          }, 1);
        } else {
          this.dialogueService.openDialog('Login Unsuccessful!');
        }
      }
    );
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password'); 
  }
}
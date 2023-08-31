import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../services/auth.service';
import { DialogueService } from '../services/dialogue.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit{
  signupForm: FormGroup;

  constructor(private authService: AuthService, private dialogueService: DialogueService, private router: Router) {}

  ngOnInit(): void {
    this.signupForm = this.createFormGroup();
  }

  createFormGroup(): FormGroup{
    return new FormGroup({
        name: new FormControl("", [Validators.required, Validators.minLength(2)]),
        email: new FormControl("", [Validators.required, Validators.email]),
        password: new FormControl("", [Validators.required, Validators.minLength(7)])
    });
  }

  signup(): void {
    this.authService.signup(this.signupForm.value).subscribe(
      () => {
        this.router.navigate(['/login']);
        this.dialogueService.openDialog('Signup Successful!');
      }
    );
  }

  get email() {
    return this.signupForm.get('email');
  }
  get password() {
    return this.signupForm.get('password');
  }
  get name() {
    return this.signupForm.get('name');
  }
}
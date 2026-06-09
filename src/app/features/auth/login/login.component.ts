import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthStore } from '../../../core/store/auth.store';
import { Location } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    RouterLink,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  authStore = inject(AuthStore);
  fb = inject(FormBuilder);
  router = inject(Router);
  location = inject(Location);
  
  hidePassword = true;

  loginForm = this.fb.group({
    usernameOrEmail: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  ngOnInit(): void {
    if (this.authStore.isLoggedIn()) {
      this.router.navigateByUrl('/');
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authStore.login(this.loginForm.getRawValue() as any);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  ngOnDestroy() {}

  closeModal() {
    this.location.back();
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthStore } from '../../../core/store/auth.store';

// Custom Validator: Passwords match
const passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  return password && confirmPassword && password.value !== confirmPassword.value ? { passwordMismatch: true } : null;
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  authStore = inject(AuthStore);
  fb = inject(FormBuilder);
  
  hidePassword = true;
  hideConfirm = true;
  showConfirmModal = false;

  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    fullName: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    captchaResponse: ['', [Validators.required]]
  }, { validators: passwordsMatchValidator });

  ngOnInit(): void {
    this.reloadCaptcha();
  }

  reloadCaptcha(): void {
    this.authStore.loadCaptcha();
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.showConfirmModal = true;
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  confirmRegistration(): void {
    this.showConfirmModal = false;
    const formValue = this.registerForm.getRawValue();
    
    // Map frontend fields to backend DTO
    const names = formValue.fullName!.trim().split(' ');
    const firstName = names[0];
    const lastName = names.length > 1 ? names.slice(1).join(' ') : firstName;

    const reqPayload = {
      username: formValue.username,
      email: formValue.email,
      password: formValue.password,
      firstName: firstName,
      lastName: lastName,
      phone: formValue.mobile,
      dateOfBirth: '2000-01-01',
      gender: 1, // Male
      captchaId: this.authStore.captchaId(),
      captchaResponse: formValue.captchaResponse
    };

    this.authStore.register(reqPayload as any);
  }
}

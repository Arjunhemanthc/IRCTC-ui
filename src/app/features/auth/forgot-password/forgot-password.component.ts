import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthApiService } from '../../../core/services/auth-api.service';

const passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('newPassword');
  const confirmPassword = control.get('confirmPassword');
  return password && confirmPassword && password.value !== confirmPassword.value ? { passwordMismatch: true } : null;
};

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink
  ],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  authApi = inject(AuthApiService);
  router = inject(Router);
  fb = inject(FormBuilder);

  step = signal<1 | 2>(1);
  isLoading = signal(false);
  errorMsg = signal<string | null>(null);
  successMsg = signal<string | null>(null);

  hidePassword = true;
  hideConfirm = true;

  emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  resetForm = this.fb.group({
    otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: passwordsMatchValidator });

  requestOtp() {
    if (this.emailForm.invalid) return;
    this.isLoading.set(true);
    this.errorMsg.set(null);
    
    const email = this.emailForm.value.email!;
    this.authApi.forgotPassword(email).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.step.set(2);
        this.successMsg.set('OTP sent to your email.');
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMsg.set(err?.error?.detail || 'Failed to send OTP.');
      }
    });
  }

  resetPassword() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.errorMsg.set(null);
    this.successMsg.set(null);

    const payload = {
      email: this.emailForm.value.email,
      otp: this.resetForm.value.otp,
      newPassword: this.resetForm.value.newPassword
    };

    this.authApi.resetPassword(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMsg.set('Password reset successful! Redirecting to login...');
        setTimeout(() => this.router.navigateByUrl('/auth/login'), 2000);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMsg.set(err?.error?.detail || 'Failed to reset password.');
      }
    });
  }
}

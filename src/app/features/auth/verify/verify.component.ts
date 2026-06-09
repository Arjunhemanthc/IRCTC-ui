import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthStore } from '../../../core/store/auth.store';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {
  authStore = inject(AuthStore);
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);

  email: string = '';

  verifyForm = this.fb.group({
    otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email = params['email'];
      }
    });
  }

  onSubmit(): void {
    if (this.verifyForm.valid && this.email) {
      this.authStore.verifyEmail(this.email, this.verifyForm.value.otp!);
    } else {
      this.verifyForm.markAllAsTouched();
    }
  }

  resendOtp(): void {
    if (this.email) {
      this.authStore.resendOtp(this.email);
    }
  }
}

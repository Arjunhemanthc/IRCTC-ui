import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
    title: 'Login - IRCTC Clone'
  },
  { 
    path: 'register', 
    loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent),
    title: 'Register - IRCTC Clone'
  },
  { 
    path: 'forgot-password', 
    loadComponent: () => import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    title: 'Forgot Password - IRCTC Clone'
  },
  { 
    path: 'verify', 
    loadComponent: () => import('./verify/verify.component').then(m => m.VerifyComponent),
    title: 'Verify OTP - IRCTC Clone'
  }
];

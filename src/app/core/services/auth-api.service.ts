import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  LoginRequest, 
  RegisterRequest, 
  TokenResponse, 
  User,
  CaptchaResponse
} from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  login(req: LoginRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/login`, req);
  }

  register(req: RegisterRequest): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/register`, req);
  }

  getCaptcha(): Observable<CaptchaResponse> {
    return this.http.get<CaptchaResponse>(`${this.apiUrl}/captcha`);
  }

  verifyEmail(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-email`, { email, otp });
  }

  resendVerification(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/resend-verification`, { email });
  }

  refreshToken(token: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/refresh`, { refreshToken: token });
  }

  logout(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, { refreshToken: token });
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  updateProfile(req: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/me`, req);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(req: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, req);
  }
}

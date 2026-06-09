import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { AuthApiService } from '../services/auth-api.service';
import { User, LoginRequest, RegisterRequest } from '../../shared/models/user.model';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  captchaId: string | null;
  captchaText: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
  captchaId: null,
  captchaText: null
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed(state => ({
    isLoggedIn: computed(() => !!state.user()),
    isAdmin: computed(() => ['SuperAdmin','TrainManager','FareAdmin','SupportAdmin','StationMaster'].includes(state.user()?.role ?? '')),
    isSuperAdmin: computed(() => state.user()?.role === 'SuperAdmin'),
    canManageTrains: computed(() => ['SuperAdmin','TrainManager'].includes(state.user()?.role ?? '')),
    isStationMaster: computed(() => state.user()?.role === 'StationMaster'),
    userInitials: computed(() => { const u = state.user(); return u ? (u.firstName[0] + u.lastName[0]).toUpperCase() : ''; }),
    monthlyBookingLimit: computed(() => state.user()?.isAadhaarVerified ? 12 : 6),
  })),

  withMethods((store, authApi = inject(AuthApiService), router = inject(Router)) => ({
    async login(req: LoginRequest): Promise<void> {
      patchState(store, { isLoading: true, error: null });
      try {
        const res = await firstValueFrom(authApi.login(req));
        localStorage.setItem('access_token', res.accessToken);
        localStorage.setItem('refresh_token', res.refreshToken);
        
        // Fetch user profile immediately after getting tokens
        const user = await firstValueFrom(authApi.getMe());

        patchState(store, { user: user, accessToken: res.accessToken, refreshToken: res.refreshToken, isLoading: false });
        
        const returnUrl = router.parseUrl(router.url).queryParams['returnUrl'];
        const role = user.role;
        if (role === 'User') {
          if (!user.address || !user.city || !user.state || !user.pincode) {
            alert('Please complete your profile to continue booking tickets.');
            router.navigateByUrl('/account/update-profile');
          } else {
            router.navigateByUrl(returnUrl ?? '/');
          }
        } else {
          // Temporarily route admins to home page until admin dashboard is built
          router.navigateByUrl(returnUrl ?? '/');
        }
      } catch (err: any) {
        patchState(store, { error: err?.error?.detail ?? err?.error?.message ?? 'Invalid credentials', isLoading: false });
      }
    },

    async loadCaptcha(): Promise<void> {
      try {
        const res = await firstValueFrom(authApi.getCaptcha());
        patchState(store, { captchaId: res.captchaId, captchaText: res.captchaText });
      } catch (err) {
        patchState(store, { error: 'Failed to load Captcha' });
      }
    },

    async register(req: RegisterRequest): Promise<void> {
      patchState(store, { isLoading: true, error: null });
      try {
        await firstValueFrom(authApi.register(req));
        patchState(store, { isLoading: false });
        router.navigate(['/auth/verify'], { queryParams: { email: req.email } });
      } catch (err: any) {
        const errors = err?.error?.errors;
        const message = errors ? Object.values(errors).flat().join('. ') : (err?.error?.detail ?? 'Registration failed');
        patchState(store, { error: message, isLoading: false });
      }
    },

    async verifyEmail(email: string, otp: string): Promise<void> {
      patchState(store, { isLoading: true, error: null });
      try {
        await firstValueFrom(authApi.verifyEmail(email, otp));
        patchState(store, { isLoading: false });
        alert("Verification Successful! Your account is now active. Please log in.");
        router.navigateByUrl('/auth/login');
      } catch (err: any) {
        patchState(store, { error: err?.error?.detail ?? err?.error?.message ?? 'Verification failed', isLoading: false });
      }
    },

    async resendOtp(email: string): Promise<void> {
      patchState(store, { isLoading: true, error: null });
      try {
        await firstValueFrom(authApi.resendVerification(email));
        patchState(store, { isLoading: false });
      } catch (err: any) {
        patchState(store, { error: err?.error?.detail ?? 'Failed to resend OTP', isLoading: false });
      }
    },

    async updateProfile(req: any): Promise<void> {
      patchState(store, { isLoading: true, error: null });
      try {
        await firstValueFrom(authApi.updateProfile(req));
        const updatedUser = await firstValueFrom(authApi.getMe());
        patchState(store, { user: updatedUser, isLoading: false });
        alert('Profile updated successfully!');
        router.navigateByUrl('/');
      } catch (err: any) {
        patchState(store, { error: err?.error?.detail ?? 'Failed to update profile', isLoading: false });
      }
    },

    async logout(): Promise<void> {
      const token = store.refreshToken();
      if (token) { authApi.logout(token).subscribe(); }
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      patchState(store, { user: null, accessToken: null, refreshToken: null });
      router.navigateByUrl('/');
    },

    async refreshTokens(): Promise<string | null> {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) return null;
      try {
        const res = await firstValueFrom(authApi.refreshToken(refreshToken));
        localStorage.setItem('access_token', res.accessToken);
        localStorage.setItem('refresh_token', res.refreshToken);
        patchState(store, { user: res.user, accessToken: res.accessToken, refreshToken: res.refreshToken });
        return res.accessToken;
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        patchState(store, { user: null, accessToken: null, refreshToken: null });
        return null;
      }
    },

    async loadFromStorage(): Promise<void> {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      try {
        const user = await firstValueFrom(authApi.getMe());
        patchState(store, { user, accessToken: token, refreshToken: localStorage.getItem('refresh_token') });
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    }
  }))
);

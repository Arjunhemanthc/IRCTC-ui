import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError, BehaviorSubject, from } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthStore } from '../store/auth.store';

let isRefreshing = false;
const tokenRefreshed$ = new BehaviorSubject<string | null>(null);

export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const injector = inject(Injector);
  const router = inject(Router);

  // Skip adding token for auth routes except /me
  if (req.url.includes('/api/auth/login') || 
      req.url.includes('/api/auth/register') || 
      req.url.includes('/api/auth/refresh') ||
      req.url.includes('/api/pnr/')) {
    return next(req);
  }

  // Read token from localStorage directly to break circular dependency
  const token = localStorage.getItem('access_token');
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/api/auth/refresh')) {
        const authStore = injector.get(AuthStore);
        return handle401Error(authReq, next, authStore, router);
      }
      return throwError(() => error);
    })
  );
};

function handle401Error(req: HttpRequest<any>, next: HttpHandlerFn, authStore: any, router: Router): Observable<HttpEvent<any>> {
  if (!isRefreshing) {
    isRefreshing = true;
    tokenRefreshed$.next(null);

    return from(authStore.refreshTokens()).pipe(
      switchMap((newToken: any) => {
        isRefreshing = false;
        if (newToken) {
          tokenRefreshed$.next(newToken);
          return next(req.clone({
            setHeaders: { Authorization: `Bearer ${newToken}` }
          }));
        }
        
        authStore.logout();
        router.navigateByUrl('/auth/login');
        return throwError(() => new Error('Refresh failed'));
      }),
      catchError((err) => {
        isRefreshing = false;
        authStore.logout();
        router.navigateByUrl('/auth/login');
        return throwError(() => err);
      })
    );
  } else {
    // Wait for the new token
    return tokenRefreshed$.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        return next(req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        }));
      })
    );
  }
}

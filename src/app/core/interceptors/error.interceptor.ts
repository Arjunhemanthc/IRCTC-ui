import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred.';

      if (error.status === 400) {
        if (error.error?.errors) {
          // Flatten FluentValidation errors
          errorMessage = Object.values(error.error.errors).flat().join('. ');
        } else if (error.error?.detail) {
          errorMessage = error.error.detail;
        } else {
          errorMessage = 'Bad request. Please check your input.';
        }
        snackBar.open(errorMessage, 'Close', { duration: 4000 });
      } 
      else if (error.status === 401) {
        // Handled by JWT interceptor
      } 
      else if (error.status === 403) {
        snackBar.open('Access denied', 'Close', { duration: 4000 });
      } 
      else if (error.status === 404) {
        snackBar.open('Resource not found', 'Close', { duration: 4000 });
      } 
      else if (error.status === 500) {
        snackBar.open('Server error. Please try again.', 'Retry', { duration: 5000 });
      }

      return throwError(() => error);
    })
  );
};

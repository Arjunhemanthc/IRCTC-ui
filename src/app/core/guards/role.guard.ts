import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '../store/auth.store';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthStore);
  const router = inject(Router);
  
  const allowed = (route.data?.['roles'] as string[]) ?? [];
  const role = auth.user()?.role;
  
  if (role && allowed.includes(role)) return true;
  
  return router.createUrlTree(['/']);
};

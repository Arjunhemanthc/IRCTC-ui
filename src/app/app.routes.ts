import { Routes } from '@angular/router';

// Temporarily disabling guards since they are not implemented yet
// import { authGuard } from './core/guards/auth.guard';
// import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // Commenting out components that aren't implemented yet to prevent build errors
  { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent), title: 'IRCTC Clone — Book Train Tickets' },
  { path: 'booking', loadComponent: () => import('./features/booking/booking-wizard/booking-wizard').then(m => m.BookingWizardComponent), title: 'Book Ticket' },
  { path: 'booking/success', loadComponent: () => import('./features/booking/booking-success/booking-success').then(m => m.BookingSuccessComponent), title: 'Booking Confirmed' },
  // { path: 'pnr', loadComponent: () => import('./features/pnr/pnr-lookup.component').then(m => m.PnrLookupComponent), title: 'Check PNR Status' },
  // { path: 'pnr/:pnr', loadComponent: () => import('./features/pnr/pnr-status.component').then(m => m.PnrStatusComponent), title: 'PNR Status' },
  // { path: 'tracking', loadComponent: () => import('./features/tracking/train-tracking.component').then(m => m.TrainTrackingComponent), title: 'Live Train Tracking' },
  { path: 'admin', loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes) },
  { path: 'account', loadChildren: () => import('./features/account/account.routes').then(m => m.accountRoutes) },
  { path: 'trains', loadChildren: () => import('./features/trains/trains.routes').then(m => m.trainsRoutes) },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes) },
  { path: '**', loadComponent: () => import('./component/not-found/not-found').then(m => m.NotFoundComponent) }
];

import { Routes } from '@angular/router';

export const accountRoutes: Routes = [
  { 
    path: 'update', 
    loadComponent: () => import('./update-profile/update-profile.component').then(m => m.UpdateProfileComponent),
    title: 'Update Profile - IRCTC Clone'
  },
  { 
    path: 'my-bookings', 
    loadComponent: () => import('./my-bookings/my-bookings').then(m => m.MyBookingsComponent),
    title: 'My Bookings - IRCTC Clone'
  },
  { 
    path: 'last-transaction', 
    loadComponent: () => import('./last-transaction/last-transaction').then(m => m.LastTransactionComponent),
    title: 'Last Transaction - IRCTC Clone'
  }
];

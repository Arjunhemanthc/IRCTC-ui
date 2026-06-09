import { Routes } from '@angular/router';

// Temporary components until implemented
export const adminRoutes: Routes = [
  { 
    path: 'dashboard', 
    loadComponent: () => import('./admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent),
    title: 'Admin Dashboard'
  },
  { 
    path: 'tariff', 
    loadComponent: () => import('./admin-tariff/admin-tariff').then(m => m.AdminTariffComponent),
    title: 'Tariff Generation'
  },
  { 
    path: 'stations', 
    loadComponent: () => import('./admin-station/admin-station').then(m => m.AdminStationComponent),
    title: 'Manage Stations'
  },
  { 
    path: 'trains', 
    loadComponent: () => import('./admin-train/admin-train').then(m => m.AdminTrainComponent),
    title: 'Manage Trains'
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

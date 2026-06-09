import { Routes } from '@angular/router';

export const trainsRoutes: Routes = [
  { 
    path: 'search', 
    loadComponent: () => import('./train-list/train-list.component').then(m => m.TrainListComponent),
    title: 'Train Search Results - IRCTC Clone'
  }
];

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AdminApiService, AdminDashboardDto } from '../../../core/services/admin-api.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  private adminApi = inject(AdminApiService);
  
  stats: AdminDashboardDto | null = null;
  isLoading = true;

  ngOnInit() {
    this.adminApi.getDashboardStats().subscribe({
      next: (res) => {
        this.stats = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading stats', err);
        this.isLoading = false;
      }
    });
  }
}

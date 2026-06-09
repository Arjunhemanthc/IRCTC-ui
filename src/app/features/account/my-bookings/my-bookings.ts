import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BookingApiService } from '../../../core/services/booking-api.service';
import { getStatusName } from '../../../core/utils/status.utils';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule, MatButtonModule, MatIconModule],
  templateUrl: './my-bookings.html',
  styleUrls: ['./my-bookings.css']
})
export class MyBookingsComponent implements OnInit {
  private bookingApi = inject(BookingApiService);

  bookings: any[] = [];
  isLoading = true;
  error = '';

  ngOnInit() {
    this.bookingApi.getBookingHistory(1, 50).subscribe({
      next: (res) => {
        this.bookings = res || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load bookings.';
        this.isLoading = false;
      }
    });
  }
  
  getStatusName(status: number): string {
    return getStatusName(status);
  }
}

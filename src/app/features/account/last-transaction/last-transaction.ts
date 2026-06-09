import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BookingApiService } from '../../../core/services/booking-api.service';

@Component({
  selector: 'app-last-transaction',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule],
  templateUrl: './last-transaction.html',
  styleUrls: ['./last-transaction.css']
})
export class LastTransactionComponent implements OnInit {
  bookingApi = inject(BookingApiService);

  bookings: any[] = [];
  isLoading = true;
  error = '';

  ngOnInit() {
    this.bookingApi.getBookingHistory(1, 1).subscribe({
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
    const statuses = [
      'Initiated',
      'Payment Pending',
      'Confirmed',
      'RAC',
      'Waitlisted',
      'Cancelled',
      'Completed'
    ];
    return statuses[status] || 'Unknown';
  }
}

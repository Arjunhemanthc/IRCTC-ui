import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-booking-success',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './booking-success.html',
  styleUrls: ['./booking-success.css']
})
export class BookingSuccessComponent {
  pnr: string = '';
  message: string = '';
  private router = inject(Router);
  private location = inject(Location);

  constructor() {
    const state = this.router.getCurrentNavigation()?.extras.state as any;
    if (state && state.pnr) {
      this.pnr = state.pnr;
      this.message = state.message || 'Your ticket has been booked successfully!';
    } else {
      this.location.back();
    }
  }
}

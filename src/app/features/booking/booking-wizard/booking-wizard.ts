import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BookingApiService, BookingRequestDto } from '../../../core/services/booking-api.service';
import { AuthStore } from '../../../core/store/auth.store';

declare var Razorpay: any;

@Component({
  selector: 'app-booking-wizard',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, MatCardModule, 
    MatFormFieldModule, MatInputModule, MatSelectModule, 
    MatButtonModule, MatIconModule, MatRadioModule, MatProgressSpinnerModule
  ],
  templateUrl: './booking-wizard.html',
  styleUrls: ['./booking-wizard.css']
})
export class BookingWizardComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public location = inject(Location);
  private bookingApi = inject(BookingApiService);
  public authStore = inject(AuthStore);

  train: any;
  coachType!: number;
  baseFare!: number;
  searchParams: any;

  bookingForm!: FormGroup;
  currentStep = 1;
  isLoading = false;
  paymentMode = 'razorpay';
  
  captchaText = '';
  captchaInput = '';
  captchaError = false;

  constructor() {
    const state = this.router.getCurrentNavigation()?.extras.state as any;
    if (state && state.train) {
      this.train = state.train;
      this.coachType = state.coachType;
      this.baseFare = state.baseFare;
      this.searchParams = state.searchParams;
    } else {
      this.location.back();
    }
  }

  ngOnInit(): void {
    const user = this.authStore.user();
    
    this.bookingForm = this.fb.group({
      passengers: this.fb.array([]),
      contact: this.fb.group({
        mobile: [user?.phone || '', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        email: [user?.email || '', [Validators.required, Validators.email]]
      })
    });
    
    this.addPassenger(); // Add one empty passenger by default
    this.generateCaptcha();
  }

  get passengers(): FormArray {
    return this.bookingForm.get('passengers') as FormArray;
  }

  addPassenger() {
    if (this.passengers.length >= 6) {
      alert('Maximum 6 passengers allowed per ticket.');
      return;
    }
    const passengerGroup = this.fb.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1), Validators.max(120)]],
      gender: ['', Validators.required],
      berthPreference: ['5'], // 5 = NoPreference
      concessionType: ['0'] // 0 = None
    });
    this.passengers.push(passengerGroup);
  }

  removePassenger(index: number) {
    if (this.passengers.length > 1) {
      this.passengers.removeAt(index);
    }
  }

  generateCaptcha() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    this.captchaText = '';
    for (let i = 0; i < 5; i++) {
      this.captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }

  getTotalFare(): number {
    return this.baseFare * this.passengers.length;
  }

  getGenderName(val: string): string {
    return val === '0' ? 'Male' : val === '1' ? 'Female' : 'Other';
  }
  
  getBerthName(val: string): string {
    const map: any = { '0': 'Lower', '1': 'Middle', '2': 'Upper', '3': 'Side Lower', '4': 'Side Upper', '5': 'No Preference' };
    return map[val] || 'No Preference';
  }

  getCoachName(): string {
    const names: { [key: number]: string } = {
      0: 'Sleeper (SL)',
      1: 'AC 3 Tier (3A)',
      2: 'AC 2 Tier (2A)',
      3: 'AC First Class (1A)',
      4: 'Second Sitting (2S)',
      5: 'AC Chair car (CC)',
      6: 'Exec. Chair Car (EC)'
    };
    return names[this.coachType] || this.coachType.toString();
  }

  nextStep() {
    if (this.currentStep === 1) {
      if (this.bookingForm.invalid) {
        this.bookingForm.markAllAsTouched();
        return;
      }
      this.currentStep = 2;
    } else if (this.currentStep === 2) {
      if (this.captchaInput !== this.captchaText) {
        this.captchaError = true;
        this.generateCaptcha();
        this.captchaInput = '';
        return;
      }
      this.captchaError = false;
      this.currentStep = 3;
    }
  }

  prevStep() {
    this.currentStep--;
  }

  initiatePayment() {
    this.isLoading = true;
    
    // Determine quotaType
    let qType = 0; // General
    if (this.searchParams?.quota === 'TATKAL') qType = 1;
    if (this.searchParams?.quota === 'PREMIUM_TATKAL') qType = 2;
    if (this.searchParams?.quota === 'LADIES') qType = 3;

    const req: BookingRequestDto = {
      scheduleId: this.train.scheduleId,
      boardingStationId: this.train.fromStationId,
      destinationStationId: this.train.toStationId,
      coachType: this.coachType,
      quotaType: qType,
      passengers: this.passengers.value.map((p: any) => ({
        name: p.name,
        age: parseInt(p.age),
        gender: parseInt(p.gender),
        berthPreference: parseInt(p.berthPreference),
        concessionType: parseInt(p.concessionType)
      }))
    };

    this.bookingApi.initiateBooking(req).subscribe({
      next: (res) => {
        this.openRazorpay(res.gatewayOrderId);
      },
      error: (err) => {
        alert(err?.error?.detail || 'Failed to initiate booking.');
        this.isLoading = false;
      }
    });
  }

  private openRazorpay(orderId: string) {
    const options = {
      key: 'rzp_test_SydmNcXnvyFUxp', // Hardcoded for demo/test
      amount: this.getTotalFare() * 100, // Amount is in currency subunits.
      currency: 'INR',
      name: 'IRCTC Clone',
      description: 'Train Ticket Booking',
      order_id: orderId,
      handler: (response: any) => {
        this.verifyPayment(response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature);
      },
      prefill: {
        name: this.authStore.user()?.firstName || '',
        email: this.bookingForm.value.contact.email,
        contact: this.bookingForm.value.contact.mobile
      },
      theme: {
        color: '#213d77' // IRCTC blue
      }
    };
    
    const rzp = new Razorpay(options);
    rzp.on('payment.failed', (response: any) => {
      alert('Payment Failed! ' + response.error.description);
      this.isLoading = false;
    });
    rzp.open();
  }

  private verifyPayment(orderId: string, paymentId: string, signature: string) {
    this.bookingApi.verifyPayment({
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.router.navigate(['/booking/success'], { state: { pnr: res.pnr, message: res.message } });
      },
      error: (err) => {
        this.isLoading = false;
        alert('Payment verification failed.');
      }
    });
  }
}

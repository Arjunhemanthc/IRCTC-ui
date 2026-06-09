import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PassengerRequestDto {
  name: string;
  age: number;
  gender: number;
  berthPreference: number;
  concessionType: number;
}

export interface BookingRequestDto {
  scheduleId: string;
  boardingStationId: string;
  destinationStationId: string;
  coachType: number;
  quotaType: number;
  passengers: PassengerRequestDto[];
}

export interface BookingResponseDto {
  pnr: string;
  status: number;
  totalAmount: number;
  gatewayOrderId: string;
  passengers: any[];
}

export interface PaymentVerificationRequestDto {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  initiateBooking(req: BookingRequestDto): Observable<BookingResponseDto> {
    return this.http.post<BookingResponseDto>(`${this.apiUrl}/bookings`, req);
  }

  verifyPayment(req: PaymentVerificationRequestDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/payments/verify`, req);
  }

  getBookingHistory(page: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/bookings?page=${page}&pageSize=${pageSize}`);
  }

  getBookingByPnr(pnr: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/bookings/${pnr}`);
  }
}

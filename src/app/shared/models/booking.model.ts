import { CoachType, QuotaType, BerthType, StationInfo, FareBreakdown } from './train.model';

export interface PassengerInput { 
  name: string; 
  age: number; 
  gender: 'Male'|'Female'|'Other'; 
  berthPreference: BerthType; 
  concessionType: ConcessionType; 
}

export type ConcessionType = 'None' | 'SeniorMale' | 'SeniorFemale' | 'Student' | 'PH';

export interface InitiateBookingRequest { 
  scheduleId: string; 
  boardingStationId: string; 
  destinationStationId: string; 
  coachType: CoachType; 
  quotaType: QuotaType; 
  passengers: PassengerInput[]; 
}

export interface InitiateBookingResponse { 
  pnr: string; 
  bookingStatus: string; 
  waitlistNumber?: number; 
  passengers: BookedPassenger[]; 
  totalFare: number; 
  fareBreakdown: FareBreakdown; 
  paymentDeadline: string; 
  scheduleId: string; 
}

export interface BookedPassenger { 
  name: string; 
  age: number; 
  status: string; 
  assignedCoach?: string; 
  assignedBerth?: number; 
  berthType?: string; 
  waitlistNumber?: number; 
}

export interface BookingListItem { 
  id: string; 
  pnr: string; 
  trainNumber: string; 
  trainName: string; 
  journeyDate: string; 
  fromStation: StationInfo; 
  toStation: StationInfo; 
  coachType: CoachType; 
  bookingStatus: string; 
  totalFare: number; 
  bookedAt: string; 
  passengerCount: number; 
}

export interface CancellationPreview { 
  pnr: string; 
  passengers: CancellationPassenger[]; 
  totalRefund: number; 
  refundMethod: string; 
  expectedCreditDays: number; 
}

export interface CancellationPassenger { 
  passengerId: string; 
  name: string; 
  currentStatus: string; 
  farePaid: number; 
  refundAmount: number; 
  cancellationCharge: number; 
}

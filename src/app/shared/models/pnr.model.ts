import { StationInfo } from './train.model';

export interface PNRStatus { 
  pnr: string; 
  bookingStatus: string; 
  trainNumber: string; 
  trainName: string; 
  journeyDate: string; 
  boardingStation: StationInfo; 
  destinationStation: StationInfo; 
  departureDateTime: string; 
  arrivalDateTime: string; 
  passengers: PNRPassenger[]; 
  farePaid: number; 
  refundAmount?: number; 
  paymentStatus: string; 
  isChartPrepared: boolean; 
  canCancelOnline: boolean; 
  statusHistory: StatusChange[]; 
}

export interface PNRPassenger { 
  name: string; 
  age: number; 
  gender: string; 
  status: string; 
  assignedCoach?: string; 
  assignedBerth?: number; 
  berthType?: string; 
}

export interface StatusChange { 
  changedAt: string; 
  fromStatus?: string; 
  toStatus: string; 
  reason?: string; 
}

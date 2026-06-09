export interface Station { 
  id: string; 
  stationCode: string; 
  stationName: string; 
  city: string; 
  state: string; 
}

export interface TrainSearchRequest { 
  fromStationCode: string; 
  toStationCode: string; 
  journeyDate: string; 
  coachType?: CoachType; 
  quotaType: QuotaType; 
  passengerCount: number; 
}

export interface TrainSearchResult { 
  trainNumber: string; 
  trainName: string; 
  trainType: string; 
  departureStation: StationInfo; 
  arrivalStation: StationInfo; 
  departureTime: string; 
  arrivalTime: string; 
  durationMinutes: number; 
  distanceKm: number; 
  availabilityByClass: Record<string, ClassAvailability>; 
  runOnDays: string; 
}

export interface ClassAvailability { 
  coachType: CoachType; 
  availableCount: number; 
  status: string; 
  fareBreakdown: FareBreakdown; 
}

export interface FareBreakdown { 
  baseFare: number; 
  tatkalCharge: number; 
  convenienceFee: number; 
  gst: number; 
  totalFare: number; 
  perPassengerFare: number; 
}

export interface StationInfo { 
  code: string; 
  name: string; 
  city: string; 
}

export type CoachType = 'GeneralUnreserved' | 'Sleeper' | 'AC3Tier' | 'AC3Economy' | 'AC2Tier' | 'AC1' | 'ChairCar' | 'ExecutiveChair';
export type QuotaType = 'General' | 'Tatkal' | 'PremiumTatkal' | 'Ladies' | 'LowerBerth';

export interface SeatMap { 
  coachConfigId: string; 
  coachNumber: string; 
  coachType: CoachType; 
  compartments: Compartment[]; 
}

export interface Compartment { 
  compartmentNumber: number; 
  seats: Seat[]; 
}

export interface Seat { 
  seatId: string; 
  seatNumber: number; 
  berthType: BerthType; 
  status: 'Available' | 'Booked' | 'RAC' | 'Blocked'; 
  maskedPassengerName?: string; 
}

export type BerthType = 'Lower' | 'Middle' | 'Upper' | 'SideLower' | 'SideUpper' | 'NoPreference';

export interface RouteStop { 
  stationCode: string; 
  stationName: string; 
  city: string; 
  sequenceOrder: number; 
  scheduledArrival?: string; 
  scheduledDeparture?: string; 
  dayOffset: number; 
  distanceFromOriginKm: number; 
  haltMinutes: number; 
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdminDashboardDto {
  totalUsers: number;
  totalTrains: number;
  totalBookingsToday: number;
  totalRevenueToday: number;
}

export interface TariffConfigDto {
  coachType: number;
  baseFarePerKm: number;
  minimumFare: number;
  reservationCharge: number;
  superfastSurcharge: number;
  tatkalSurcharge: number;
}

export interface AddStationDto {
  stationCode: string;
  stationName: string;
  city: string;
  state: string;
}

export interface AddTrainDto {
  trainNumber: string;
  trainName: string;
  trainType: number;
  sourceStationId: string;
  destinationStationId: string;
  runsOnDays: string;
  coachComposition: {
    coachType: number;
    count: number;
  }[];
}

export interface ScheduleTrainDto {
  trainId: string;
  startDate: string;
  endDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin`;

  // Dashboard
  getDashboardStats(): Observable<AdminDashboardDto> {
    return this.http.get<AdminDashboardDto>(`${this.apiUrl}/bookings/dashboard`);
  }

  // Tariff Config
  getTariffConfigs(): Observable<TariffConfigDto[]> {
    return this.http.get<TariffConfigDto[]>(`${this.apiUrl}/tariff`);
  }

  updateTariffConfig(config: TariffConfigDto): Observable<TariffConfigDto> {
    return this.http.put<TariffConfigDto>(`${this.apiUrl}/tariff`, config);
  }

  // Stations
  addStation(station: AddStationDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/trains/stations`, station);
  }

  // Trains
  getTrains(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/trains`);
  }

  addTrain(train: AddTrainDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/trains`, train);
  }

  addRoute(trainId: string, routes: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/trains/${trainId}/routes`, routes);
  }

  scheduleTrain(schedule: ScheduleTrainDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/trains/schedule`, schedule);
  }
}

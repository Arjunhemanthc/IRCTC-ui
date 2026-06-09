import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface StationAutocompleteDto {
  id: string;
  code: string;
  name: string;
  city: string;
}

export interface TrainClassAvailability {
  coachType: number;
  availableSeats: number;
  baseFare: number;
}

export interface SearchTrainResponse {
  trainId: string;
  scheduleId: string;
  fromStationId: string;
  toStationId: string;
  trainNumber: string;
  trainName: string;
  fromStation: string;
  toStation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  distance: number;
  isTatkalOpen: boolean;
  availability: TrainClassAvailability[];
}

@Injectable({
  providedIn: 'root'
})
export class TrainApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`;

  searchStations(query: string): Observable<StationAutocompleteDto[]> {
    return this.http.get<StationAutocompleteDto[]>(`${this.apiUrl}/stations/autocomplete`, {
      params: { q: query }
    });
  }

  searchTrains(from: string, to: string, date: string, classType: string, quota: string): Observable<SearchTrainResponse[]> {
    let params = new HttpParams()
      .set('from', from)
      .set('to', to)
      .set('date', date)
      .set('quota', quota);

    if (classType && classType !== 'All Classes') {
      const typeMatch = classType.match(/\(([^)]+)\)/);
      if (typeMatch && typeMatch[1]) {
        // Map shortcodes to CoachType enum integers
        const classMap: { [key: string]: number } = {
          '1A': 5, // AC1
          '2A': 4, // AC2Tier
          '3A': 2, // AC3Tier
          'SL': 1, // Sleeper
          '2S': 0, // GeneralUnreserved
          'CC': 3, // AC3Economy (Closest match)
          'EC': 6  // Vistadome (Closest match)
        };
        const intVal = classMap[typeMatch[1]];
        if (intVal !== undefined) {
          params = params.set('class', intVal.toString());
        } else {
          params = params.set('class', typeMatch[1]);
        }
      }
    }

    return this.http.get<SearchTrainResponse[]>(`${this.apiUrl}/trains/search`, { params });
  }
}

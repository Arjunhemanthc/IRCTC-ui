import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, UpperCasePipe } from '@angular/common';
import { SearchTrainResponse, TrainApiService } from '../../../core/services/train-api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-train-list',
  standalone: true,
  imports: [DatePipe, UpperCasePipe, MatButtonModule, MatIconModule, MatTabsModule],
  templateUrl: './train-list.component.html',
  styleUrls: ['./train-list.component.css']
})
export class TrainListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private trainApi = inject(TrainApiService);

  trains: SearchTrainResponse[] = [];
  isLoading = true;
  error: string | null = null;

  searchParams = {
    from: '',
    to: '',
    date: '',
    class: '',
    quota: ''
  };

  selectedClassMap: { [trainId: string]: number } = {};

  // CoachType enum mapping
  classCodes: { [key: number]: string } = {
    0: 'SL',
    1: '3A',
    2: '2A',
    3: '1A',
    4: '2S',
    5: 'CC',
    6: 'EC'
  };

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchParams.from = params['from'] || '';
      this.searchParams.to = params['to'] || '';
      this.searchParams.date = params['date'] || '';
      this.searchParams.class = params['class'] || '';
      this.searchParams.quota = params['quota'] || 'GENERAL';
      this.fetchTrains();
    });
  }

  fetchTrains() {
    this.isLoading = true;
    this.error = null;
    this.trainApi.searchTrains(
      this.searchParams.from,
      this.searchParams.to,
      this.searchParams.date,
      this.searchParams.class,
      this.searchParams.quota
    ).subscribe({
      next: (res) => {
        this.trains = res;
        this.trains.forEach(t => {
          if (t.availability && t.availability.length > 0) {
            // Default select the first class type
            this.selectedClassMap[t.trainId] = t.availability[0].coachType;
          }
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to fetch train results. Please try again.';
        this.isLoading = false;
      }
    });
  }

  getCoachName(coachType: number): string {
    const names: { [key: number]: string } = {
      0: 'Sleeper (SL)',
      1: 'AC 3 Tier (3A)',
      2: 'AC 2 Tier (2A)',
      3: 'AC First Class (1A)',
      4: 'Second Sitting (2S)',
      5: 'AC Chair car (CC)',
      6: 'Exec. Chair Car (EC)'
    };
    return names[coachType] || coachType.toString();
  }

  getAvailableAvailability(train: SearchTrainResponse): any {
    return train.availability.find((a: any) => a.coachType === this.selectedClassMap[train.trainId]);
  }

  selectClass(trainId: string, coachType: number) {
    this.selectedClassMap[trainId] = coachType;
  }

  bookNow(train: any) {
    const selectedAvail = this.getAvailableAvailability(train);
    if (!selectedAvail) return;
    
    // Navigate to booking page with journey details
    this.router.navigate(['/booking'], {
      state: {
        train: train,
        coachType: selectedAvail.coachType,
        baseFare: selectedAvail.baseFare,
        searchParams: this.searchParams
      }
    });
  }
}

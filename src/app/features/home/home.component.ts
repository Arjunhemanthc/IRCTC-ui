import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe, NgIf, NgFor, DatePipe } from '@angular/common';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, map } from 'rxjs/operators';
import { TrainApiService, StationAutocompleteDto } from '../../core/services/train-api.service';
import { BookingApiService } from '../../core/services/booking-api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    AsyncPipe,
    NgIf,
    NgFor,
    DatePipe
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  fb = inject(FormBuilder);

  searchForm = this.fb.group({
    fromStation: [''],
    toStation: [''],
    date: [new Date()],
    classType: ['All Classes'],
    quota: ['GENERAL'],
    disabilityConcession: [false],
    flexibleDate: [false],
    passConcession: [false]
  });

  classes = ['All Classes', 'AC First Class (1A)', 'Exec. Chair Car (EC)', 'AC 2 Tier (2A)', 'First Class (FC)', 'AC 3 Tier (3A)', 'AC Chair car (CC)', 'Sleeper (SL)', 'Second Sitting (2S)'];
  quotas = ['GENERAL', 'LADIES', 'LOWER BERTH/SR.CITIZEN', 'PERSON WITH DISABILITY', 'TATKAL', 'PREMIUM TATKAL'];

  trainApi = inject(TrainApiService);
  bookingApi = inject(BookingApiService);
  router = inject(Router);

  filteredFromStations$!: Observable<StationAutocompleteDto[]>;
  filteredToStations$!: Observable<StationAutocompleteDto[]>;

  activeTab: 'book' | 'pnr' = 'book';
  pnrSearch = new FormControl('');
  pnrStatusResult: any = null;
  pnrError: string | null = null;

  ngOnInit() {
    this.filteredFromStations$ = this.searchForm.get('fromStation')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this._filterStations(value || ''))
    );

    this.filteredToStations$ = this.searchForm.get('toStation')!.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this._filterStations(value || ''))
    );
  }

  private _filterStations(value: string | StationAutocompleteDto): Observable<StationAutocompleteDto[]> {
    const filterValue = typeof value === 'string' ? value : value.code;
    if (!filterValue || filterValue.length < 2) {
      return of([]);
    }
    return this.trainApi.searchStations(filterValue).pipe(
      catchError(() => of([]))
    );
  }

  displayStation(station: StationAutocompleteDto): string {
    return station ? `${station.name} (${station.code})` : '';
  }

  swapStations() {
    const from = this.searchForm.get('fromStation')?.value;
    const to = this.searchForm.get('toStation')?.value;
    this.searchForm.patchValue({
      fromStation: to,
      toStation: from
    });
  }

  searchTrains() {
    console.log('Search payload:', this.searchForm.value);
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    const formVal = this.searchForm.getRawValue();
    const fromCode = (formVal.fromStation as any)?.code;
    const toCode = (formVal.toStation as any)?.code;

    if (!fromCode || !toCode) return;

    let dateStr = '';
    if (formVal.date) {
      const d = new Date(formVal.date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      dateStr = `${year}-${month}-${day}`;
    }

    this.router.navigate(['/trains/search'], {
      queryParams: {
        from: fromCode,
        to: toCode,
        date: dateStr,
        class: formVal.classType,
        quota: formVal.quota
      }
    });
  }

  searchPnr() {
    if (!this.pnrSearch.value) return;
    this.pnrError = null;
    this.pnrStatusResult = null;
    
    this.bookingApi.getBookingByPnr(this.pnrSearch.value).subscribe({
      next: (res) => {
        this.pnrStatusResult = res;
      },
      error: (err) => {
        this.pnrError = err.error?.message || 'PNR not found or you are not authorized to view it.';
      }
    });
  }
}

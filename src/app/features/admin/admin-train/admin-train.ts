import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { TrainApiService } from '../../../core/services/train-api.service';

@Component({
  selector: 'app-admin-train',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCheckboxModule
  ],
  templateUrl: './admin-train.html',
  styleUrls: ['./admin-train.css']
})
export class AdminTrainComponent implements OnInit {
  private adminApi = inject(AdminApiService);
  private trainApi = inject(TrainApiService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  trainForm: FormGroup;
  scheduleForm: FormGroup;
  routeForm: FormGroup;
  
  stations: any[] = [];
  allTrains: any[] = [];
  isSavingTrain = false;
  isSavingRoute = false;
  isSavingSchedule = false;

  trainTypes = [
    { value: 0, label: 'Express' },
    { value: 1, label: 'Rajdhani' },
    { value: 2, label: 'Shatabdi' },
    { value: 3, label: 'Duronto' },
    { value: 4, label: 'Vande Bharat' }
  ];

  coachTypes = [
    { value: 0, label: 'General Unreserved' },
    { value: 1, label: 'Sleeper' },
    { value: 2, label: 'AC 3-Tier' },
    { value: 3, label: 'AC 2-Tier' },
    { value: 4, label: 'AC 1st Class' },
    { value: 5, label: 'Executive Chair Car' },
    { value: 6, label: 'AC Chair Car' }
  ];

  weekDays = [
    { key: 'M', label: 'Mon' },
    { key: 'T', label: 'Tue' },
    { key: 'W', label: 'Wed' },
    { key: 'T', label: 'Thu' },
    { key: 'F', label: 'Fri' },
    { key: 'S', label: 'Sat' },
    { key: 'S', label: 'Sun' }
  ];

  constructor() {
    this.trainForm = this.fb.group({
      trainNumber: ['', Validators.required],
      trainName: ['', Validators.required],
      trainType: [0, Validators.required],
      sourceStationId: ['', Validators.required],
      destinationStationId: ['', Validators.required],
      runDays: this.fb.array([true, true, true, true, true, true, true]),
      coachComposition: this.fb.array([])
    });

    this.scheduleForm = this.fb.group({
      trainId: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });

    this.routeForm = this.fb.group({
      trainId: ['', Validators.required],
      routeStations: this.fb.array([])
    });
  }

  ngOnInit() {
    this.loadStations();
    this.loadTrains();
    // Start with 1 coach by default
    this.addCoach();
    // Start with 2 route stops by default
    this.addRouteStation();
    this.addRouteStation();
  }

  loadTrains() {
    this.adminApi.getTrains().subscribe(res => {
      this.allTrains = res;
    });
  }

  loadStations() {
    this.trainApi.searchStations('').subscribe((res: any[]) => {
      this.stations = res;
    });
  }

  get coachComposition() {
    return this.trainForm.get('coachComposition') as FormArray;
  }

  addCoach() {
    this.coachComposition.push(this.fb.group({
      coachType: [1, Validators.required],
      count: [1, [Validators.required, Validators.min(1)]]
    }));
  }

  removeCoach(index: number) {
    this.coachComposition.removeAt(index);
  }

  get routeStations() {
    return this.routeForm.get('routeStations') as FormArray;
  }

  addRouteStation() {
    this.routeStations.push(this.fb.group({
      stationId: ['', Validators.required],
      sequenceOrder: [this.routeStations.length + 1, Validators.required],
      distanceFromOriginKm: [0, [Validators.required, Validators.min(0)]],
      scheduledArrival: [''],
      scheduledDeparture: [''],
      haltDurationMinutes: [0, [Validators.required, Validators.min(0)]],
      dayOffset: [0, [Validators.required, Validators.min(0)]]
    }));
  }

  removeRouteStation(index: number) {
    this.routeStations.removeAt(index);
    // Update sequence numbers
    this.routeStations.controls.forEach((ctrl, i) => {
      ctrl.get('sequenceOrder')?.setValue(i + 1);
    });
  }

  get runDays() {
    return this.trainForm.get('runDays') as FormArray;
  }

  addTrain() {
    if (this.trainForm.invalid) return;

    this.isSavingTrain = true;
    
    // Convert boolean array to "MTWTFSS" format
    const daysArr = this.runDays.value as boolean[];
    const daysStr = daysArr.map((isSelected, i) => isSelected ? this.weekDays[i].key : '-').join('');
    
    const payload = {
      ...this.trainForm.value,
      runsOnDays: daysStr
    };
    delete payload.runDays;

    this.adminApi.addTrain(payload).subscribe({
      next: () => {
        this.snackBar.open('Train added successfully!', 'Close', { duration: 3000 });
        this.trainForm.reset({ trainType: 0 });
        this.runDays.controls.forEach(c => c.setValue(true));
        this.coachComposition.clear();
        this.addCoach();
        this.loadTrains(); // Reload trains so it appears in dropdowns
        this.isSavingTrain = false;
      },
      error: (err) => {
        this.snackBar.open('Failed to add train: ' + (err.error?.detail || err.error?.message || 'Error'), 'Close', { duration: 4000 });
        this.isSavingTrain = false;
      }
    });
  }

  saveRoute() {
    if (this.routeForm.invalid) return;

    this.isSavingRoute = true;
    const formValue = this.routeForm.value;
    
    // Format times for backend (from "HH:mm" to TimeSpan string "HH:mm:ss")
    const formattedRoutes = formValue.routeStations.map((rs: any) => ({
      ...rs,
      scheduledArrival: rs.scheduledArrival ? rs.scheduledArrival + ':00' : null,
      scheduledDeparture: rs.scheduledDeparture ? rs.scheduledDeparture + ':00' : null,
    }));

    this.adminApi.addRoute(formValue.trainId, formattedRoutes).subscribe({
      next: () => {
        this.snackBar.open('Route saved successfully!', 'Close', { duration: 3000 });
        this.routeForm.reset();
        this.routeStations.clear();
        this.addRouteStation();
        this.addRouteStation();
        this.isSavingRoute = false;
      },
      error: (err) => {
        this.snackBar.open('Failed to save route: ' + (err.error?.detail || err.error?.message || 'Error'), 'Close', { duration: 4000 });
        this.isSavingRoute = false;
      }
    });
  }

  scheduleTrain() {
    if (this.scheduleForm.invalid) return;

    this.isSavingSchedule = true;
    this.adminApi.scheduleTrain(this.scheduleForm.value).subscribe({
      next: () => {
        this.snackBar.open('Train scheduled successfully!', 'Close', { duration: 3000 });
        this.scheduleForm.reset();
        this.isSavingSchedule = false;
      },
      error: (err) => {
        this.snackBar.open('Failed to schedule train: ' + (err.error?.detail || err.error?.message || 'Error'), 'Close', { duration: 4000 });
        this.isSavingSchedule = false;
      }
    });
  }
}

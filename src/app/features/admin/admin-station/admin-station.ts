import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminApiService } from '../../../core/services/admin-api.service';

@Component({
  selector: 'app-admin-station',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './admin-station.html',
  styleUrls: ['./admin-station.css']
})
export class AdminStationComponent {
  private adminApi = inject(AdminApiService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  stationForm: FormGroup;
  isSaving = false;

  constructor() {
    this.stationForm = this.fb.group({
      stationCode: ['', [Validators.required, Validators.maxLength(10)]],
      stationName: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required]
    });
  }

  addStation() {
    if (this.stationForm.invalid) return;

    this.isSaving = true;
    this.adminApi.addStation(this.stationForm.value).subscribe({
      next: () => {
        this.snackBar.open('Station added successfully!', 'Close', { duration: 3000 });
        this.stationForm.reset();
        this.Object.keys(this.stationForm.controls).forEach(key => {
          this.stationForm.controls[key].setErrors(null);
        });
        this.isSaving = false;
      },
      error: (err) => {
        this.snackBar.open('Failed to add station: ' + (err.error?.detail || err.error?.message || 'Unknown error'), 'Close', { duration: 4000 });
        this.isSaving = false;
      }
    });
  }
  
  get Object() { return Object; }
}

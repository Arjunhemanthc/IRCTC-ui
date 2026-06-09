import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AdminApiService, TariffConfigDto } from '../../../core/services/admin-api.service';

@Component({
  selector: 'app-admin-tariff',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './admin-tariff.html',
  styleUrls: ['./admin-tariff.css']
})
export class AdminTariffComponent implements OnInit {
  private adminApi = inject(AdminApiService);
  private snackBar = inject(MatSnackBar);

  tariffs: TariffConfigDto[] = [];
  isLoading = true;
  isSaving = false;

  coachTypeNames: { [key: number]: string } = {
    0: 'General Unreserved',
    1: 'Sleeper',
    2: 'AC 3-Tier',
    3: 'AC 2-Tier',
    4: 'AC 1st Class',
    5: 'Executive Chair Car',
    6: 'AC Chair Car'
  };

  ngOnInit() {
    this.loadTariffs();
  }

  loadTariffs() {
    this.isLoading = true;
    this.adminApi.getTariffConfigs().subscribe({
      next: (res) => {
        this.tariffs = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.snackBar.open('Failed to load tariff configurations', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  getCoachName(coachType: number): string {
    return this.coachTypeNames[coachType] || `Type ${coachType}`;
  }

  saveConfig(config: TariffConfigDto) {
    this.isSaving = true;
    this.adminApi.updateTariffConfig(config).subscribe({
      next: (res) => {
        this.snackBar.open(`${this.getCoachName(config.coachType)} rates confirmed successfully!`, 'Close', { duration: 3000 });
        this.isSaving = false;
      },
      error: (err) => {
        this.snackBar.open(`Failed to update ${this.getCoachName(config.coachType)}`, 'Close', { duration: 3000 });
        this.isSaving = false;
      }
    });
  }
}

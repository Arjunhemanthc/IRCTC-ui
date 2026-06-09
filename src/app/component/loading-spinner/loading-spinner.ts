import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading-spinner.html',
  styleUrls: ['./loading-spinner.css']
})
export class LoadingSpinnerComponent {
  @Input() diameter = 40;
}

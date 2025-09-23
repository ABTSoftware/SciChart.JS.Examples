import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScichartAngularComponent } from 'scichart-angular';

@Component({
  selector: 'app-basic-chart-config',
  standalone: true,
  imports: [CommonModule, FormsModule, ScichartAngularComponent],
  templateUrl: './basic-chart-config.component.html',
  styleUrl: './basic-chart-config.component.css'
})
export class BasicChartConfigComponent {
  config = {
    // ...
  };
}
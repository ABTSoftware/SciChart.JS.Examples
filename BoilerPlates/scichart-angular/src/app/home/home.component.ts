import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirstChartGroupComponent } from '../first-chart-group/first-chart-group.component';
import { SecondChartGroupComponent } from '../second-chart-group/second-chart-group.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FirstChartGroupComponent, SecondChartGroupComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  
}
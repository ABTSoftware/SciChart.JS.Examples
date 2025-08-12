import { Component, signal } from '@angular/core';
import { MyChart } from './my-chart/my-chart';

@Component({
  selector: 'app-root',
  imports: [MyChart],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('angular-scichart-boilerplate');
}

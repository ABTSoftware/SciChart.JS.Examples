import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BasicChartInitComponent } from './basic-chart-init/basic-chart-init.component';
import { BasicChartConfigComponent } from './basic-chart-config/basic-chart-config.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'basic-chart-init', component: BasicChartInitComponent },
  { path: 'basic-chart-config', component: BasicChartConfigComponent }
];

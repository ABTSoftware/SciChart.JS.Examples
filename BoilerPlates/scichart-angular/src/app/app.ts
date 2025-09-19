import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MemoryUsageHelper, SciChart3DSurface, SciChartSurface } from 'scichart';
import { FirstChartGroupComponent } from './first-chart-group/first-chart-group.component';
import { SecondChartGroupComponent } from './second-chart-group/second-chart-group.component';

// // fetch WASM dependencies from CDN
// SciChartSurface.loadWasmFromCDN()
// SciChart3DSurface.loadWasmFromCDN()

// or

// Use local WASM files instead of CDN
SciChartSurface.loadWasmLocal()
SciChart3DSurface.loadWasmLocal()

// For debug purposes only in dev mode
SciChartSurface.autoDisposeWasmContext = true;
SciChart3DSurface.autoDisposeWasmContext = true;
MemoryUsageHelper.isMemoryUsageDebugEnabled = true;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FirstChartGroupComponent, SecondChartGroupComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('scichart-angular');
}

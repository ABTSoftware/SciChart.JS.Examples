import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MemoryUsageHelper, SciChart3DSurface, SciChartSurface } from 'scichart';
import { ScichartAngularComponent } from 'scichart-angular';
import { drawExample2D } from '../drawExample2D';
import { drawExample3D } from '../drawExample3D';

@Component({
  selector: 'app-first-chart-group',
  standalone: true,
  imports: [CommonModule, FormsModule, ScichartAngularComponent],
  templateUrl: './first-chart-group.component.html',
  styleUrl: './first-chart-group.component.css'
})
export class FirstChartGroupComponent {
  showCharts = true;

  public drawChart2D = drawExample2D;
  public drawChart3D = drawExample3D;

  onInit2DHandler = (
    initResult: Awaited<ReturnType<typeof drawExample2D>>
  ) => {
    console.log('onInit2DHandler', initResult);
  };

  onDelete2DHandler = (
    initResult: Awaited<ReturnType<typeof drawExample2D>>
  ) => {
    console.log('onDelete2DHandler', initResult);
  };

  onInit3DHandler = (
    initResult: Awaited<ReturnType<typeof drawExample3D>>
  ) => {
    console.log('onInit3DHandler', initResult);
  };

  onDelete3DHandler = (
    initResult: Awaited<ReturnType<typeof drawExample3D>>
  ) => {
    console.log('onDelete3DHandler', initResult);
  };

  public logDebugInfo() {
    // try forcing garbage collection (if it has been enabled in Chromium)
    window.gc?.();

    // some delay may be required here

    // output info about SciChart-related deletable object to console
    MemoryUsageHelper.objectRegistry.log();
  }
}
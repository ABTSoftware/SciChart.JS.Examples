import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MemoryUsageHelper, SciChart3DSurface, SciChartSurface } from 'scichart';
import { ScichartAngularComponent } from 'scichart-angular';
import { drawExample2D } from './drawExample2D';
import { drawExample3D } from './drawExample3D';

// fetch WASM dependencies from CDN
SciChartSurface.loadWasmFromCDN()
SciChart3DSurface.loadWasmFromCDN()

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, FormsModule, ScichartAngularComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('scichart-angular');

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

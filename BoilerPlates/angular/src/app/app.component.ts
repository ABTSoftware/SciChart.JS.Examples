import { Component } from '@angular/core';
import {
    SciChartSurface,
    SciChart3DSurface,
    MemoryUsageHelper,
} from 'scichart';
import { drawExample2D } from './drawExample2D';
import { drawExample3D } from './drawExample3D';

/// LICENSING
// Apply community license. Description at https://www.scichart.com/community-licensing/
SciChartSurface.UseCommunityLicense();
// Commercial licenses set your license code here
// Purchased license keys can be viewed at https://www.scichart.com/profile
// How-to steps at https://www.scichart.com/licensing-scichart-js/
// Apply commercial license
// SciChartSurface.setRuntimeLicenseKey("YOUR_RUNTIME_KEY");
///

/// WASM Fetching
// Specify to fetch WASM dependencies from external CDN server
// SciChartSurface.loadWasmFromCDN();
// SciChart3DSurface.loadWasmFromCDN();

// or from a custom/self-hosted location
SciChartSurface.configure({
    wasmUrl: '/scichart2d.wasm',
});

SciChart3DSurface.configure({
    wasmUrl: '/scichart3d.wasm',
});
///

/// Memory Debug Setup
// An optional testing setup for finding potential memory leaks
MemoryUsageHelper.isMemoryUsageDebugEnabled = true;
SciChartSurface.autoDisposeWasmContext = true;
SciChart3DSurface.autoDisposeWasmContext = true;
///

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    title = 'SciChartAngular Boilerplate';

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

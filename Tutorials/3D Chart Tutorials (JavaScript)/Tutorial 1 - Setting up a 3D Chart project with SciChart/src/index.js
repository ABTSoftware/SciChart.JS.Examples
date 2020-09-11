import {SciChart3DSurface} from "scichart3d/charting/Visuals/SciChart3DSurface";
import {Numeric3DAxis} from "scichart3d/charting/Visuals/Axis/NumericAxis3D";

async function initSciChart() {
    // Create the SciChart3DSurface in the div 'scichart-root'
    // The SciChart3DSurface, and webassembly context 'wasmContext' are paired. This wasmContext
    // instance must be passed to other types that exist on the same surface.
    const {sciChart3DSurface, wasmContext} = await SciChart3DSurface.create("scichart-root");

    // Create an X,Y,Z Axis and add to the chart    
    
    sciChart3DSurface.xAxis = new Numeric3DAxis(wasmContext);
    sciChart3DSurface.yAxis = new Numeric3DAxis(wasmContext);
    sciChart3DSurface.zAxis = new Numeric3DAxis(wasmContext);    

    // That's it! You just created your first SciChart3DSurface!
}

initSciChart();

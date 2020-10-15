import {SciChart3DSurface} from "scichart/charting3d/Visuals/SciChart3DSurface";
import {NumericAxis3D} from "scichart/charting3d/Visuals/Axis/NumericAxis3D";
import { CameraController } from "scichart/charting3d/CameraController";
import { Vector3 } from "scichart/charting3d/Vector3";

async function initSciChart() {
    // Create the SciChart3DSurface in the div 'scichart-root'
    // The SciChart3DSurface, and webassembly context 'wasmContext' are paired. This wasmContext
    // instance must be passed to other types that exist on the same surface.
    const {sciChart3DSurface, wasmContext} = await SciChart3DSurface.create("scichart-root");

    sciChart3DSurface.camera = new CameraController(wasmContext, {
        position: new Vector3(300,200,300),
        target: new Vector3(0,50,0)
    });
    // Create an X,Y,Z Axis and add to the chart    
    
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext)
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext);
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext);    

    // That's it! You just created your first SciChart3DSurface!
}

initSciChart();

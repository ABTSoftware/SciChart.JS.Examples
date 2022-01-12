import {SciChartSurface} from "scichart";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import { CameraController } from "scichart/Charting3D/CameraController";
import { MouseWheelZoomModifier3D } from "scichart/Charting3D/ChartModifiers/MouseWheelZoomModifier3D";
import { OrbitModifier3D } from "scichart/Charting3D/ChartModifiers/OrbitModifier3D";
import { XyzDataSeries3D } from "scichart/Charting3D/Model/DataSeries/XyzDataSeries3D";
import { Vector3 } from "scichart/Charting3D/Vector3";
import { NumericAxis3D } from "scichart/Charting3D/Visuals/Axis/NumericAxis3D";
import { SpherePointMarker3D } from "scichart/Charting3D/Visuals/PointMarkers/DefaultPointMarkers";
import { ScatterRenderableSeries3D } from "scichart/Charting3D/Visuals/RenderableSeries/ScatterRenderableSeries3D";
import { SciChart3DSurface } from "scichart/Charting3D/Visuals/SciChart3DSurface";
import { TSciChart3D } from "scichart/types/TSciChart3D";

async function initSciChart(divElement) {
    // const { sciChartSurface, wasmContext } = await SciChartSurface.createSingle(divElement.id);
    const { sciChartSurface, wasmContext } = await SciChartSurface.createSingle(divElement);

    const xAxis = new NumericAxis( wasmContext );
    sciChartSurface.xAxes.add( xAxis );
    
    const yAxis = new NumericAxis( wasmContext );
    sciChartSurface.yAxes.add( yAxis );

    // const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.createSingle(divElement);
    // sciChart3DSurface.camera = new CameraController(wasmContext, {
    //     position: new Vector3(300, 300, 300),
    //     target: new Vector3(0, 50, 0)
    // });

    // sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "X Axis" });
    // sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Y Axis" });
    // sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Z Axis" });
}

class SciChartWrapper extends HTMLElement {
    constructor() {
        super();

        // Create a shadow root
        this.attachShadow( { mode: 'open' } );

        // create scichart root element
        const wrapper = document.createElement( 'div' );
        wrapper.id = "scichart-root"
        wrapper.style.width = "800px"
        wrapper.style.height = "600px"

        // attach the created element to the shadow root
        this.shadowRoot.append( wrapper );
    }

    connectedCallback() {
        const chartRootElement = this.shadowRoot.getElementById( "scichart-root" );
        initSciChart( chartRootElement );
    }
}

customElements.define( 'scichart-wrapper', SciChartWrapper );

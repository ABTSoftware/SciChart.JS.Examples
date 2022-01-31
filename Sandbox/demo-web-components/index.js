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
import { EPieType, SciChartPieSurface } from "scichart/Charting/Visuals/SciChartPieSurface/SciChartPieSurface";
import { PieSegment } from "scichart/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment";
import { GradientParams } from "scichart/Core/GradientParams";
import { Point } from "scichart/Core/Point";
import { ELegendOrientation, ELegendPlacement } from "scichart/Charting/Visuals/Legend/SciChartLegendBase";

async function initSciChart(divElement, external) {
    // const { sciChartSurface, wasmContext } = await SciChartSurface.createSingle(divElement.id);
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElement);

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


    // const sciChartPieSurface = await SciChartPieSurface.create(divElement, external);
    // sciChartPieSurface.pieType = EPieType.Pie;
    // sciChartPieSurface.holeRadius = 0.6;
    // sciChartPieSurface.animate = true;
    // sciChartPieSurface.legend.showLegend = true;
    // sciChartPieSurface.legend.showCheckboxes = true;
    // sciChartPieSurface.legend.animate = true;
    // sciChartPieSurface.legend.placement = ELegendPlacement.TopRight;
    // sciChartPieSurface.legend.orientation = ELegendOrientation.Vertical;
    // sciChartPieSurface.legend.placementDivId = external;
    // const pieSegment1 = new PieSegment({
    //     color: "#228B22",
    //     value: 40,
    //     text: "Green",
    //     colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
    //         { color: "#1D976C", offset: 0 },
    //         { color: "#93F9B9", offset: 1 }
    //     ])
    // });
    // const pieSegment2 = new PieSegment({
    //     value: 10,
    //     text: "Red",
    //     colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
    //         { color: "#DD5E89", offset: 0 },
    //         { color: "#F7BB97", offset: 1 }
    //     ])
    // });
    // const pieSegment3 = new PieSegment({
    //     value: 20,
    //     text: "Blue",
    //     colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
    //         { color: "#1FA2FF", offset: 0 },
    //         { color: "#12D8FA", offset: 0.5 },
    //         { color: "#A6FFCB", offset: 1 }
    //     ])
    // });
    // const pieSegment4 = new PieSegment({
    //     value: 15,
    //     text: "Yellow",
    //     colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
    //         { color: "#F09819", offset: 0 },
    //         { color: "#EDDE5D", offset: 1 }
    //     ])
    // });
    // sciChartPieSurface.pieSegments.add(pieSegment1, pieSegment2, pieSegment3, pieSegment4);
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
        const external = document.createElement( 'div' );
        external.id = "external-legend"
        external.style.width = "800px"
        external.style.height = "600px"

        // attach the created element to the shadow root
        this.shadowRoot.append( wrapper );
        this.shadowRoot.append( external );
    }

    connectedCallback() {
        const chartRootElement = this.shadowRoot.getElementById( "scichart-root" );
        const external = this.shadowRoot.getElementById( "external-legend" );
        initSciChart( chartRootElement, external );
    }
}

customElements.define( 'scichart-wrapper', SciChartWrapper );

import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { SciChartDefaults } from "scichart/Charting/Visuals/SciChartDefaults";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { CategoryAxis } from "scichart/Charting/Visuals/Axis/CategoryAxis";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { FastColumnRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries";
import { NumberRange } from "scichart/Core/NumberRange";
import { chartBuilder } from "scichart/Builder/chartBuilder";
import { ESeriesType } from "scichart/types/SeriesType";
import { EPointMarkerType } from "scichart/types/PointMarkerType";
import { EAxisType } from "scichart/types/AxisType";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { Thickness } from "scichart/Core/Thickness";
import { ELabelAlignment } from "scichart/types/LabelAlignment";
import { TextLabelProvider } from "scichart/Charting/Visuals/Axis/LabelProvider/TextLabelProvider";
import { AxisMarkerAnnotation } from "scichart/Charting/Visuals/Annotations/AxisMarkerAnnotation";

export async function axisLabelsExample() {
  // Use Native text for all axes by default
  SciChartDefaults.useNativeText = true;

  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    "scichart-div-id"
  );

  // Enable native text for a specific axis
  sciChartSurface.xAxes.add(
    new NumericAxis(wasmContext, {
      useNativeText: true,
      // Most style options are supported
      // fontStyle and FontWeight are not supported for native text
      labelStyle: { fontFamily: "arial", fontSize: "12", color: "white", padding: new Thickness(0,0,0,0), alignment: ELabelAlignment.Auto },
      axisTitle: "Native X"
    }),
    new NumericAxis(wasmContext, {
        // Disable native text for a specfic axis
        useNativeText: false,
        axisAlignment: EAxisAlignment.Top,
        // Same style for comparison
        labelStyle: { fontFamily: "arial", fontSize: "12", color: "white", padding: new Thickness(0,0,0,0), alignment: ELabelAlignment.Auto },
        axisTitle: "Normal X"
      })
  );
  sciChartSurface.yAxes.add(
    // Native text with default values
    new NumericAxis(wasmContext, { axisTitle: "Native Y" }),
    // Normal text with default values
    new NumericAxis(wasmContext, { useNativeText: false, axisAlignment: EAxisAlignment.Left, axisTitle: "Normal Y" }),
  );
}

export async function axisLabelsBuilderAPIExample(divElementId) {
  // Use Native text for all axes by default
  SciChartDefaults.useNativeText = true;
  const { sciChartSurface, wasmContext } = await chartBuilder.buildChart(
    divElementId,
    {
      xAxes: {
        type: EAxisType.NumericAxis,
        options: {       
            useNativeText: true,
            // Most style options are supported
            // fontStyle and FontWeight are not supported for native text
            labelStyle: { fontFamily: "arial", fontSize: "12", color: "white", padding: new Thickness(0,0,0,0), alignment: ELabelAlignment.Auto }, 
            axisTitle: "Native X"
        },
      },
      yAxes: {
        type: EAxisType.NumericAxis,
        options: { useNativeText: false,
            labelStyle: { fontFamily: "arial", fontSize: "12", color: "white", padding: new Thickness(0,0,0,0), alignment: ELabelAlignment.Auto }
        },
      },
      series: {
        type: ESeriesType.LineSeries,
        xyData: {
          xValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          yValues: [4.3, 5.3, 6, 6.3, 6, 5.2, 4.5, 4.6, 5, 6, 7, 8],
        },
        options: {
          stroke: "SteelBlue",
          strokeThickness: 3
        }
      },
    }
  );
}

export async function axisLabelsRotationExample(divElementId) { 
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(
        divElementId
    );
  
    const labels = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
        "Hey look\nMultiline"
    ];
    sciChartSurface.xAxes.add(new CategoryAxis(wasmContext, { 
        axisAlignment: EAxisAlignment.Top,
        labelProvider: new TextLabelProvider({ labels, rotation: 90 }),
        visibleRange: new NumberRange(0,12), 
        autoTicks: false, 
        majorDelta: 1 })
    );
    sciChartSurface.xAxes.add(new CategoryAxis(wasmContext, { 
        labelProvider: new TextLabelProvider({ labels, rotation: 45 }),
        visibleRange: new NumberRange(0,12), 
        autoTicks: false, 
        hideOverlappingLabels: false,
        majorDelta: 1 })
    );
    sciChartSurface.xAxes.add(new CategoryAxis(wasmContext, { 
        labelProvider: new TextLabelProvider({ labels, rotation: -90 }),
        visibleRange: new NumberRange(0,12), 
        autoTicks: false, 
        majorDelta: 1 })
    );

    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext)
      );
    // To enable native text after the axis is created, set it on the labelProvider
    sciChartSurface.yAxes.get(0).labelProvider.useNativeText = true;  
  }
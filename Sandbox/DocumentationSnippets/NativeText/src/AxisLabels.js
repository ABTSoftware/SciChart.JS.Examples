import { chartBuilder } from "scichart/Builder/chartBuilder";
import { CategoryAxis } from "scichart/Charting/Visuals/Axis/CategoryAxis";
import { TextLabelProvider } from "scichart/Charting/Visuals/Axis/LabelProvider/TextLabelProvider";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { SciChartDefaults } from "scichart/Charting/Visuals/SciChartDefaults";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumberRange } from "scichart/Core/NumberRange";
import { Thickness } from "scichart/Core/Thickness";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { EAxisType } from "scichart/types/AxisType";
import { ELabelAlignment } from "scichart/types/LabelAlignment";
import { ESeriesType } from "scichart/types/SeriesType";

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
      labelStyle: {
        fontFamily: "arial",
        fontSize: "12",
        color: "white",
        padding: new Thickness(0, 0, 0, 0),
        alignment: ELabelAlignment.Auto,
      },
      axisTitle: "Native X",
    }),
    new NumericAxis(wasmContext, {
      // Disable native text for a specfic axis
      useNativeText: false,
      axisAlignment: EAxisAlignment.Top,
      // Same style for comparison
      labelStyle: {
        fontFamily: "arial",
        fontSize: "12",
        color: "white",
        padding: new Thickness(0, 0, 0, 0),
        alignment: ELabelAlignment.Auto,
      },
      axisTitle: "Normal X",
    })
  );
  sciChartSurface.yAxes.add(
    // Native text with default values
    new NumericAxis(wasmContext, { axisTitle: "Native Y" }),
    // Normal text with default values
    new NumericAxis(wasmContext, {
      useNativeText: false,
      axisAlignment: EAxisAlignment.Left,
      axisTitle: "Normal Y",
    })
  );
}

export async function axisLabelsBuilderAPIExample(divElementId) {
  // Use Native text for all axes by default
  SciChartDefaults.useNativeText = true;
  const { sciChartSurface, wasmContext } = await chartBuilder.buildChart(
    divElementId,
    {
      xAxes: [
        {
          type: EAxisType.NumericAxis,
          options: {
            useNativeText: true,
            // Most style options are supported
            // fontStyle and FontWeight are not supported for native text
            labelStyle: {
              fontFamily: "arial",
              fontSize: "12",
              color: "white",
              padding: new Thickness(0, 0, 0, 0),
              alignment: ELabelAlignment.Auto,
            },
            axisTitle: "Native X",
          },
        },
        {
          type: EAxisType.NumericAxis,
          options: {
            // Disable native text for a specfic axis
            useNativeText: false,
            axisAlignment: EAxisAlignment.Top,
            // Same style for comparison
            labelStyle: {
              fontFamily: "arial",
              fontSize: "12",
              color: "white",
              padding: new Thickness(0, 0, 0, 0),
              alignment: ELabelAlignment.Auto,
            },
            axisTitle: "Normal X",
          },
        },
      ],
      yAxes: [
        {
          // Native text with default values
          type: EAxisType.NumericAxis,
          options: { axisTitle: "Native Y" },
        },
        {
          type: EAxisType.NumericAxis,
          // Normal text with default values
          options: {
            useNativeText: false,
            axisAlignment: EAxisAlignment.Left,
            axisTitle: "Normal Y",
          },
        },
      ],
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
    "Multiple\nLine\nText",
  ];
  sciChartSurface.xAxes.add(
    new CategoryAxis(wasmContext, {
      axisAlignment: EAxisAlignment.Top,
      labelStyle: { alignment: ELabelAlignment.Right },
      labelProvider: new TextLabelProvider({ labels, rotation: 90 }),
      visibleRange: new NumberRange(0, 12),
      autoTicks: false,
      majorDelta: 1,
    })
  );
  sciChartSurface.xAxes.add(
    new CategoryAxis(wasmContext, {
      labelStyle: { alignment: ELabelAlignment.Center },
      labelProvider: new TextLabelProvider({ labels, rotation: 45, lineSpacing: 2 }),
      visibleRange: new NumberRange(0, 12),
      autoTicks: false,
      hideOverlappingLabels: false,
      majorDelta: 1,
    })
  );
  sciChartSurface.xAxes.add(
    new CategoryAxis(wasmContext, {
      labelProvider: new TextLabelProvider({ labels, rotation: -90 }),
      visibleRange: new NumberRange(0, 12),
      autoTicks: false,
      majorDelta: 1,
    })
  );

  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
  // To enable native text after the axis is created, set it on the labelProvider
  sciChartSurface.yAxes.get(0).labelProvider.useNativeText = true;
}

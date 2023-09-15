async function tooltipSvgCursorModifier(divElementId) {

  const {
    SciChartSurface,
    NumericAxis,
    FastLineRenderableSeries,
    XyDataSeries,
    SciChartJsNavyTheme,
    CursorModifier,
    TextAnnotation,
    EHorizontalAnchorPoint,
    ECoordinateMode,
    EllipsePointMarker,
    EDataSeriesType,
    DpiHelper
  } = SciChart;

  // or for npm import { SciChartSurface, ... } from "scichart"


  // Create a chart surface
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
    theme: new SciChartJsNavyTheme(),
    titleStyle: { fontSize: 16 }
  });

  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  // Some helper functions used in the tooltipSvgTemplate below
  const translateToNotScaled = (value) => value / DpiHelper.PIXEL_RATIO;

  const calcTooltipWidth = (textLength = 20, padding = 20, fontSize = 13) => {
    return textLength * 8 + padding;
  };
  const calcTooltipHeight = (lines = 2, padding = 16, fontSize = 13) => {
    return 17 * lines + padding;
  }

  // A default tooltip DataTemplate which handles all series types
  const defaultTooltipDataTemplate = (seriesInfos, tooltipTitle) => {
    const valuesWithLabels = [];
    if (tooltipTitle) {
      valuesWithLabels.push(tooltipTitle);
    }

    seriesInfos.forEach((si, index) => {
      if (si.isHit) {
        if (si.seriesName) {
          valuesWithLabels.push(si.seriesName);
        } else if (seriesInfos.length > 1) {
          valuesWithLabels.push(`Series #${index + 1}`);
        }
        if (si.dataSeriesType === EDataSeriesType.Ohlc) {
          valuesWithLabels.push(`X: ${si.formattedXValue}`);
          valuesWithLabels.push(`Open: ${si.formattedOpenValue}`);
          valuesWithLabels.push(`Highest: ${si.formattedHighValue}`);
          valuesWithLabels.push(`Lowest: ${si.formattedLowValue}`);
          valuesWithLabels.push(`Close: ${si.formattedCloseValue}`);
        } else if (si.dataSeriesType === EDataSeriesType.Xyy) {
          // Band Series
          valuesWithLabels.push(`X: ${si.formattedXValue}`);
          valuesWithLabels.push(`Y: ${si.formattedYValue}`);
          valuesWithLabels.push(`Y1: ${si.formattedY1Value}`);
        } else if (si.dataSeriesType === EDataSeriesType.Xyz) {
          // Bubble Series
          valuesWithLabels.push(`X: ${si.formattedXValue}`);
          valuesWithLabels.push(`Y: ${si.formattedYValue}`);
          valuesWithLabels.push(`Z: ${si.formattedZValue}`);
        } else if (si.dataSeriesType === EDataSeriesType.HeatmapUniform) {
          // Heatmap Series
          valuesWithLabels.push(`X: ${si.formattedXValue}`);
          valuesWithLabels.push(`Y: ${si.formattedYValue}`);
          if (si.zValue !== null && si.zValue !== undefined) {
            valuesWithLabels.push(`Z: ${si.formattedZValue}`);
          }
        } else {
          valuesWithLabels.push(`X: ${si.formattedXValue} Y: ${si.formattedYValue}`);
        }
      }
    });
    return valuesWithLabels;
  }

  // Full customisation of the tooltip SVG template and content
  const tooltipSvgTemplate = (seriesInfos, svgAnnotation) => {
    const id = `id_${Date.now()}`;

    const tooltipData = defaultTooltipDataTemplate(seriesInfos, svgAnnotation.title);

    if (tooltipData.rows.length === 0) {
      return "<svg></svg>";
    }

    const widthForTitle = calcTooltipWidth(tooltipData.title.length);
    const lengthForValues = tooltipData.rows.reduce(
      (prev, cur) => (cur.value.length > prev ? cur.value.length : prev),
      0
    );
    const lengthForDesc = tooltipData.rows.reduce(
      (prev, cur) => (cur.description.length > prev ? cur.description.length : prev),
      0
    );
    const lengthAdditional = 3;
    const lengthForTable = lengthForValues + lengthForDesc + lengthAdditional;
    const widthForTable = calcTooltipWidth(lengthForTable);
    const widthMax = Math.max(widthForTitle, widthForTable);
    const widthForValues = (widthForTable * lengthForValues) / lengthForTable;

    // tooltip height
    const height = calcTooltipHeight(tooltipData.rows.length + 1);

    // Positioning the tooltip
    const { seriesViewRect } = svgAnnotation.parentSurface;
    const xCoord = svgAnnotation.x1;
    const yCoord = svgAnnotation.y1;
    const xCoordShift = translateToNotScaled(seriesViewRect.width) - xCoord < widthMax ? -widthMax : 5;
    const yCoordShift = translateToNotScaled(seriesViewRect.height) - yCoord < height ? -height : 5;
    svgAnnotation.xCoordShift = xCoordShift;
    svgAnnotation.yCoordShift = yCoordShift;

    let valuesBlock1 = "";
    let valuesBlock2 = "";
    tooltipData.rows.forEach(({ color, value, description }, index) => {
      valuesBlock1 += `<tspan x="${widthForValues}" dy="1.2em" fill="${color}">${value}</tspan>`;
      valuesBlock2 += `<tspan x="${8 + widthForValues}" dy="1.2em" fill="${color}">${description}</tspan>`;
    });

    const tooltipFill = svgAnnotation.containerBackground;
    const tooltipStroke = svgAnnotation.textStroke;
    return `<svg class="scichart__smartmouse-tooltip" width="${widthMax}" height="${height}">
        <defs>
            <filter id="${id}" x="0" y="0" width="200%" height="200%">
                <feOffset result="offOut" in="SourceAlpha" dx="3" dy="3" />
                <feGaussianBlur result="blurOut" in="offOut" stdDeviation="3" />
                <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
            </filter>
        </defs>
        <rect rx="4" ry="4" width="95%" height="90%" fill="${tooltipFill}" filter="url(#${id})" />
        <svg width="100%">
            <text font-size="13" font-family="Verdana"><tspan x="8" dy="1.3em" fill="white">${
      tooltipData.title
    }</tspan></text>
            <text text-anchor="end" y="1.5em" font-size="13" font-family="Verdana" fill="${tooltipStroke}">${valuesBlock1}</text>
            <text x="${
      8 + widthForValues
    }" y="1.5em" font-size="13" font-family="Verdana" fill="${tooltipStroke}">${valuesBlock2}</text>
        </svg>
    </svg>`;
  };

  // Add a CursorModifier to the chart
  const cursorModifier = new CursorModifier({
    showTooltip: true,
    showAxisLabels: true,
    tooltipSvgTemplate
  });
  sciChartSurface.chartModifiers.add(cursorModifier);
  // #endregion

  // Add some series to inspect
  const xValues = [];
  const yValues = [];
  const yValues2 = [];
  for(let i = 0; i < 50; i++) {
    xValues.push(i);
    yValues.push(0.2 * Math.sin(i*0.25) - Math.cos(i * 0.02));
    yValues2.push(0.5 * Math.cos(i*0.18) - Math.sin(i * 0.025));
  }

  const pointMarker = new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: "white", strokeThickness: 0 } );

  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    stroke: "#FF6600",
    strokeThickness: 5,
    dataSeries: new XyDataSeries(wasmContext, {
      xValues,
      yValues,
      dataSeriesName: "Sinewave 1",
    }),
    pointMarker
  }));

  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    stroke: "#50C7E0",
    strokeThickness: 5,
    dataSeries: new XyDataSeries(wasmContext, {
      xValues,
      yValues: yValues2,
      dataSeriesName: "Sinewave 2",
    }),
    pointMarker
  }));

  // Add some instructions to the user
  const options = {
    xCoordinateMode: ECoordinateMode.Relative,
    yCoordinateMode: ECoordinateMode.Relative,
    x1: 0.5,
    y1: 0.0,
    horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
    opacity: 0.33,
    textColor: "White",
  };
  sciChartSurface.annotations.add(new TextAnnotation({
    text: "CursorModifier Formatting",
    fontSize: 36,
    yCoordShift: 25,
    ... options,
  }));
  sciChartSurface.annotations.add(new TextAnnotation({
    text: "Move the mouse over the chart to see cursor & tooltip",
    fontSize: 20,
    yCoordShift: 75,
    ... options,
  }));
}

tooltipSvgCursorModifier("scichart-root");




async function builderExample(divElementId) {
  // Demonstrates how to configure the PinchZoomModifier in SciChart.js using the Builder API
  const {
    chartBuilder,
    EThemeProviderType,
    EAxisType,
    EChart2DModifierType,
    ENumericFormat
  } = SciChart;

  // or, for npm, import { chartBuilder, ... } from "scichart"

  // #region ExampleB
  const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
    surface: { theme: { type: EThemeProviderType.Dark } },
    xAxes: {
      type: EAxisType.NumericAxis,
      options: {
        // label format options applied to the X-Axis
        labelPrecision: 2,
        labelFormat: ENumericFormat.Decimal,
        // label format options applied to cursors & tooltips
        cursorLabelPrecision: 4,
        cursorLabelFormat: ENumericFormat.Decimal
      }
    },
    yAxes: {
      type: EAxisType.NumericAxis,
      options: {
        // label format options applied to the X-Axis
        labelPrecision: 2,
        labelFormat: ENumericFormat.Decimal,
        // label format options applied to cursors & tooltips
        cursorLabelPrecision: 4,
        cursorLabelFormat: ENumericFormat.Decimal
      }
    },
    modifiers: [{
      type: EChart2DModifierType.Cursor,
      options: {
        showTooltip: true,
        showAxisLabels: true,
        hitTestRadius: 10,
      }
    }]
  });
  // #endregion

  const xValues = [];
  const yValues = [];
  const yValues2 = [];
  for(let i = 0; i < 50; i++) {
    xValues.push(i);
    yValues.push(0.2 * Math.sin(i*0.25) - Math.cos(i * 0.02));
    yValues2.push(0.5 * Math.cos(i*0.18) - Math.sin(i * 0.025));
  }

  const { EllipsePointMarker, FastLineRenderableSeries, XyDataSeries } = SciChart;
  const pointMarker = new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: "white", strokeThickness: 0 } );

  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    stroke: "#FF6600",
    strokeThickness: 5,
    dataSeries: new XyDataSeries(wasmContext, {
      xValues,
      yValues,
    }),
    pointMarker
  }));

  sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
    stroke: "#50C7E0",
    strokeThickness: 5,
    dataSeries: new XyDataSeries(wasmContext, {
      xValues,
      yValues: yValues2,
    }),
    pointMarker
  }));
};



if (location.search.includes("builder=1"))
  builderExample("scichart-root");





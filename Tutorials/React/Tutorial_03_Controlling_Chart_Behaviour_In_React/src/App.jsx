// #region ExampleA
import {
  SciChartJsNavyTheme,
  SciChartSurface,
  NumericAxis,
  SplineMountainRenderableSeries,
  CursorModifier,
  XyDataSeries,
} from "scichart";
import React, { useContext } from "react";
import { SciChartReact, SciChartSurfaceContext } from "scichart-react";

const initChart = async (rootElement) => {
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    rootElement,
    {
      theme: new SciChartJsNavyTheme(),
    }
  );

  console.log(`scichartsurface is ${sciChartSurface}`);

  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const yValues = [1, 4, 7, 3, 7, 6, 7, 4, 2, 5];

  const mountainSeries = new SplineMountainRenderableSeries(wasmContext, {
    dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
    fill: "SteelBlue",
    stroke: "White",
    strokeThickness: 4,
    opacity: 0.4,
  });

  sciChartSurface.renderableSeries.add(mountainSeries);

  const cursor = new CursorModifier({
    showTooltip: true,
    showYLine: true,
    showXLine: true,
    showAxisLabels: true,
    crosshairStroke: "White",
    crosshairStrokeDashArray: [5, 5],
  });
  cursor.isEnabled = false;
  sciChartSurface.chartModifiers.add(cursor);

  const addData = () => {
    console.log(`Adding data`);
    const x = xValues.length;
    const y = Math.random() * 10;
    xValues.push(x);
    yValues.push(y);
    mountainSeries.dataSeries.append(x, y);

    sciChartSurface.zoomExtents(500);
  };

  const enableTooltip = (enable) => {
    console.log(`cursorEnabled: ${enable}`);
    cursor.isEnabled = enable;
  };

  const getTooltipEnabled = () => {
    return cursor.isEnabled;
  };

  return { sciChartSurface, addData, enableTooltip, getTooltipEnabled };
};
// #endregion

// #region ExampleB
const AddDataButton = () => {
  const initResult = useContext(SciChartSurfaceContext);
  const handleClick = () => {
    initResult.addData();
  };
  return <input type="button" onClick={handleClick} value="Add Data"></input>;
};

const EnableTooltipButton = () => {
  const initResult = useContext(SciChartSurfaceContext);
  const handleClick = () => {
    const tooltipEnabled = initResult.getTooltipEnabled();
    initResult.enableTooltip(!tooltipEnabled);
  };
  return (
    <input type="button" onClick={handleClick} value="Toggle Tooltip"></input>
  );
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>&lt;SciChartReact/&gt; with custom chart controls</h1>
      </header>
      <SciChartReact
        initChart={initChart}
        style={{ maxWidth: 900, height: 600 }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <AddDataButton />
          <EnableTooltipButton />
        </div>
      </SciChartReact>
    </div>
  );
}

export default App;
// #endregion

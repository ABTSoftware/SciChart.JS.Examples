import React from "react";
import { chartBuilder } from "scichart/Builder/chartBuilder";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import Chart from "./Chart";
import Chart2 from "./Chart2";

function App() {
  const [chart1, setChart] = React.useState<boolean>(true);

  const switchChart = () => {
    setChart(!chart1);
  }

  return (
    <div>
      <input type="button" onClick={switchChart} value="Switch" />
      {chart1 ? <Chart /> : <Chart2 />}
    </div>
  );
}

export default App;

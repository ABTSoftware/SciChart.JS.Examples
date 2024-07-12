import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";

async function initSciChart() {
  // LICENSING //
  // Set your client license code here
  SciChartSurface.setRuntimeLicenseKey("client key here");
  //
  // To instead fetch the client license from the server (useful if you have the same deployment to different domains requiring different licenses)
  // use fetch, then pass the test response to setRuntimeLicenseKey. Don't worry if this happenes before or after the SciChartSurface is created - charts will automatically update when the license is set.
  // fetch("/api/getclientlicense").then(r => r.text()).then(key => SciChartSurface.setRuntimeLicenseKey(key));
  //
  // When using a server key, scichart needs to call back to the server to validate the client license.
  // The default endpoint is /api/license.  If you just need to use a different endpoint you can change this using
  // SciChartSurface.setServerLicenseEndpoint("/custom/endpoint")
  //
  // If fetching from the server requires additional code, eg authorization headers, then you can supply your own callback like this
  // SciChartSurface.setLicenseCallback((queryString) => fetch("/custom?"+queryString, { headers: { authorization: <whatever is needed here > }));
  // Make sure you include the querystring parameter in the server request.  You can add additional parameters to the qerystring if need be.

  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    "scichart-root"
  );

  // Create an X,Y Axis and add to the chart
  const xAxis = new NumericAxis(wasmContext);
  const yAxis = new NumericAxis(wasmContext);

  sciChartSurface.xAxes.add(xAxis);
  sciChartSurface.yAxes.add(yAxis);

  // That's it! You just created your first SciChartSurface!
}

initSciChart();

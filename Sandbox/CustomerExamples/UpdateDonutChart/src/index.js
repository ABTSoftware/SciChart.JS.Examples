import {EPieType, SciChartPieSurface} from "scichart/Charting/Visuals/SciChartPieSurface/SciChartPieSurface";
import {SciChartJSLightTheme} from "scichart/Charting/Themes/SciChartJSLightTheme";
import {PieSegment} from "scichart/Charting/Visuals/SciChartPieSurface/PieSegment/PieSegment";
import {GradientParams} from "scichart/Core/GradientParams";
import {Point} from "scichart/Core/Point";

async function initSciChart() {
  const sciChartPieSurface = await SciChartPieSurface.create("scichart-root");

  let value = 40

  const theme = { ...new SciChartJSLightTheme() }
  theme.sciChartBackground = 'Transparent'
  sciChartPieSurface.applyTheme(theme)
  sciChartPieSurface.background = '#FFFFFF33'
  sciChartPieSurface.pieType = EPieType.Donut
  sciChartPieSurface.holeRadius = 0.6
  sciChartPieSurface.legend.showLegend = false

  // Set animate pie segments
  sciChartPieSurface.animate = true;

  const pieSegment1 = new PieSegment({
    color: '#228B22',
    value,
    colorLinearGradient: new GradientParams(
        new Point(0, 0),
        new Point(0, 1),
        [
          { color: '#DD5E89', offset: 0 },
          { color: '#F7BB97', offset: 1 },
        ]
    ),
  })
  const pieSegment2 = new PieSegment({
    value: 100 - value,
    colorLinearGradient: new GradientParams(
        new Point(0, 0),
        new Point(0, 1),
        [
          { color: '#2b2828', offset: 0 },
          { color: '#656565', offset: 1 },
        ]
    ),
  })
  sciChartPieSurface.pieSegments.add(pieSegment1, pieSegment2);

  const updateFunc = () => {
    value += 2;
    pieSegment1.value = value;
    pieSegment2.value = 100 - value;
    console.log(`Updating! ${value}%`);

    if (value > 98)
      return;
    setTimeout(updateFunc, 1000);
  };

  setTimeout(updateFunc, 1000);
}

initSciChart();

import * as SciChart from "scichart";

const animateInOut = async divElementId => {
    const {
        SciChartSurface,
        NumericAxis,
        makeIncArray,
        XyDataSeries,
        AUTO_COLOR,
        ScaleAnimation,
        ZoomExtentsModifier,
        ZoomPanModifier,
        MouseWheelZoomModifier,
        SplineLineRenderableSeries,
        SciChartJsNavyTheme
    } = SciChart;

    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    // Create an xAxis, yAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    //#region LoopExample
    const DURATION = 700;
    const inOutAnimation = (series, delay) =>
        new ScaleAnimation({
            duration: DURATION,
            delay,
            onCompleted: () => {
                series.runAnimation(
                    new ScaleAnimation({
                        duration: DURATION,
                        reverse: true,
                        onCompleted: () => {
                            // Hide the series
                            series.isVisible = false;
                            // Restore the data to the original values (before the animate out) so it can be animated in again.
                            // This only works in an onComplete
                            series.dataSeries.revertAnimationVectors();
                        }
                    })
                );
                // Restart this animation after the others have run
                setTimeout(() => {
                    series.isVisible = true;
                    series.runAnimation(inOutAnimation(series, 0));
                }, 4 * DURATION);
            }
        });
    // #endregion

    // Create a Line Series
    const xValues = makeIncArray(15);
    for (let i = 0; i < 5; i++) {
        const yValues = xValues.map(() => Math.random() * 10);
        const lineSeries = new SplineLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
            stroke: AUTO_COLOR,
            strokeThickness: 4
        });

        sciChartSurface.renderableSeries.add(lineSeries);
        if (i === 0) {
            //#region InOutExample
            lineSeries.animation = new ScaleAnimation({
                duration: 700,
                delay: i * 700,
                fadeEffect: true,
                onCompleted: () => {
                    lineSeries.runAnimation(
                        new ScaleAnimation({
                            duration: 700,
                            reverse: true,
                            fadeEffect: true
                        })
                    );
                }
            });
            // #endregion
        } else {
            lineSeries.animation = inOutAnimation(lineSeries, i * DURATION);
        }
    }

    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();
};

animateInOut("scichart-root");

async function builderExample(divElementId) {}

if (location.search.includes("builder=1")) builderExample("scichart-root");

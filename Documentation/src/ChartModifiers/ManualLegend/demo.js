import * as SciChart from "scichart";

/**
 * @import {BoxAnnotation} from "scichart"
 */

async function manualLegend(divElementId) {
    const { SciChartSurface, NumericAxis, BoxAnnotation, SciChartJsNavyTheme, ManualLegend } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const text1 = new BoxAnnotation({
        id: "Manual Legends use an items array you create",
        fill: "#87ceeb",
        x1: 1,
        y1: 7,
        x2: 4,
        y2: 6
    });
    const text2 = new BoxAnnotation({
        id: "So they are not dependant on renderable series",
        fill: "#98fb98",
        x1: 6,
        y1: 7,
        x2: 9,
        y2: 6
    });
    const text3 = new BoxAnnotation({
        id: "You can still respond to checkbox changes",
        fill: "#f0e68c",
        x1: 6,
        y1: 5,
        x2: 9,
        y2: 4
    });
    const text4 = new BoxAnnotation({
        id: "Here they control the visibility of the BoxAnnotations",
        fill: "#dda0dd",
        x1: 1,
        y1: 5,
        x2: 4,
        y2: 4
    });
    sciChartSurface.annotations.add(text1, text2, text3, text4);

    // #region ExampleA
    // Create Legend items.  Here we create one per annotation
    const legendItems = /** @type {BoxAnnotation[]} */ (sciChartSurface.annotations.asArray()).map(a => ({
        name: a.id,
        color: a.fill,
        id: a.id,
        checked: true,
        showMarker: true
    }));
    // Create the legend.  It is automatically attached to the surface passed as the second parameter.
    // You can also create it without the surface and later call ml.attachTo
    const ml = new ManualLegend(
        {
            showCheckboxes: true,
            items: legendItems,
            isCheckedChangedCallback: (item, checked) => {
                sciChartSurface.annotations.getById(item.id).isHidden = !checked;
            }
        },
        sciChartSurface
    );
    // #endregion
}

manualLegend("scichart-root");

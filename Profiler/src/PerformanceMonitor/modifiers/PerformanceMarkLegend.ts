import { ELegendOrientation, IManualLegendOptions, ManualLegend, SciChartSurface } from "scichart";
import { TLegendItem } from "scichart";
import { TMarkType } from "../data/typeAliases";
import { performanceMarkColorMap, getSeriesColor } from "../PerformanceMarkColors";
import { standardMarkTypeCategories } from "../data/markTypeCategories";

const groups = Object.entries(performanceMarkColorMap).map((entry, index) => {
    return { id: `${index}`, name: entry[0].split("End")[0], color: entry[1], checked: true };
});

const getManualLegendOptions = (items: TLegendItem[]): IManualLegendOptions => {
    return {
        orientation: ELegendOrientation.Vertical,
        showCheckboxes: true,
        margin: 0,
        items,
        isCheckedChangedCallback: (item: TLegendItem, checked: boolean, legend: ManualLegend) => {
            const key = item.name;
            const mainProfilerSurface = legend.parentSurface as SciChartSurface;
            const allSeries = mainProfilerSurface.subCharts.flatMap(sc => sc.renderableSeries.asArray());
            const seriesInGroup = allSeries.filter(rs => rs.id.startsWith(key));
            seriesInGroup.forEach(rs => {
                rs.isVisible = checked;
            });
        }
    };
};

const getMarkCategoriesLegendOptions = (items: TLegendItem[]): IManualLegendOptions => {
    return {
        orientation: ELegendOrientation.Vertical,
        showCheckboxes: true,
        showSeriesMarkers: false,
        margin: 0,
        items,
        isCheckedChangedCallback: (item: TLegendItem, checked: boolean, legend: ManualLegend) => {
            const key = item.name;
            const targetMarkTypes = standardMarkTypeCategories[key];
            const mainProfilerSurface = legend.parentSurface as SciChartSurface;
            const allSeries = mainProfilerSurface.subCharts.flatMap(sc => sc.renderableSeries.asArray());
            const seriesInGroup = allSeries.filter(rs => targetMarkTypes.some(markType => rs.id.startsWith(markType)));
            seriesInGroup.forEach(rs => {
                rs.isVisible = checked;
            });
        }
    };
};

export function addLegend(
    sciChartSurface: SciChartSurface,
    operationEndMarkTypes: TMarkType[],
    eventMarkTypes: TMarkType[]
) {
    const operationLegendItems = operationEndMarkTypes.map((markType, index) => {
        return {
            id: `${index}`,
            name: markType.split("End").shift(),
            color: getSeriesColor(markType),
            checked: true
        };
    });
    const eventLegendItems = eventMarkTypes.map((markType, index) => {
        return { id: `${index}`, name: markType, color: getSeriesColor(markType), checked: true };
    });
    const markGroupsLegendItems = Object.keys(standardMarkTypeCategories).map((categoryName, index) => {
        return { id: `${index}`, name: categoryName, color: undefined, checked: true };
    });

    const legend1 = new ManualLegend(
        {
            placementDivId: "manualLegendContainer1",
            ...getManualLegendOptions(operationLegendItems)
        },
        sciChartSurface
    );
    const legend2 = new ManualLegend(
        {
            placementDivId: "manualLegendContainer2",
            ...getManualLegendOptions(eventLegendItems)
        },
        sciChartSurface
    );
    const legend3 = new ManualLegend(
        {
            placementDivId: "manualLegendContainer3",
            ...getMarkCategoriesLegendOptions(markGroupsLegendItems)
        },
        sciChartSurface
    );
    sciChartSurface.addDeletable({ delete: () => legend1.detach() });
    sciChartSurface.addDeletable({ delete: () => legend2.detach() });
    sciChartSurface.addDeletable({ delete: () => legend3.detach() });
    sciChartSurface.invalidateElement();
}

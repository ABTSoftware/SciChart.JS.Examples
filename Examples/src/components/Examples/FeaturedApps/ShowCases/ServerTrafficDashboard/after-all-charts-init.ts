import { NumberRange, easing } from "scichart";
import { IInitResult } from "scichart-react";
import { getData, TDataEntry } from "./data-generation";
import { VisibleRangeSynchronizationManager } from "./VisibleRangeSynchronizationManager";
import type { TInitResults } from "./chart-types";

export const afterAllChartsInit =
    (axisSyncManager: VisibleRangeSynchronizationManager) => (initResults: IInitResult[]) => {
        const [mainChart, pageStatisticChart, serverLoadChart, locationStatisticChart, pieChart] =
            initResults as TInitResults;

        const currentData = getData();

        axisSyncManager.sync(
            ...[mainChart.sciChartSurface, pageStatisticChart.sciChartSurface, serverLoadChart.sciChartSurface]
        );

        const mainSurface = mainChart.sciChartSurface;
        const mainXAxis = mainSurface.xAxes.get(0);

        // initial animation of visible range
        const visibleRangeDiff = mainXAxis.visibleRange.diff;
        const newInitialVisibleRange = new NumberRange(
            mainXAxis.visibleRange.min + visibleRangeDiff * 0.2,
            mainXAxis.visibleRange.max - visibleRangeDiff * 0.2
        );

        const unCheckedServers = new Set<string>();
        const selectedLocations = new Set<string>();

        const locationFilter = (entry: TDataEntry) =>
            selectedLocations.size ? selectedLocations.has(entry.location) : true;
        const serverFilter = (entry: TDataEntry) => !unCheckedServers.has(entry.server);

        const updateLocationStats = () => {
            const currentRange = mainXAxis.visibleRange;

            const dataFilteredByTime = currentData.filter(
                (entry) => entry.timestamp >= currentRange.min && entry.timestamp <= currentRange.max
            );
            const dataFilteredForLocationStats = dataFilteredByTime.filter(serverFilter);
            locationStatisticChart.updateData(dataFilteredForLocationStats);
            pieChart.updateData(dataFilteredForLocationStats);
        };

        const updateChartData = () => {
            const commonData = currentData.filter(serverFilter).filter(locationFilter);

            const dataFilteredForServerStats = currentData.filter(locationFilter);

            mainChart.updateData(commonData);
            pageStatisticChart.updateData(
                currentData.map((entry: TDataEntry) =>
                    serverFilter(entry) && locationFilter(entry) ? entry : { ...entry, page: null }
                )
            );
            // server series should be just hidden
            serverLoadChart.updateData(dataFilteredForServerStats);
            updateLocationStats();
        };

        // filter location stats by visible range
        mainXAxis.visibleRangeChanged.subscribe(updateLocationStats);

        mainXAxis.animateVisibleRange(newInitialVisibleRange, 2000, easing.inOutQuint, () => {
            // filter data by server accordingly to visible series
            serverLoadChart.subscribeToServerSelection((server: string, isChecked: boolean) => {
                if (isChecked) {
                    unCheckedServers.delete(server);
                } else {
                    unCheckedServers.add(server);
                }

                updateChartData();
            });

            // filter data  by location
            locationStatisticChart.subscribeToLocationSelection((location) => {
                selectedLocations.clear();
                if (location) {
                    selectedLocations.add(location);
                }
                updateChartData();
            });
        });
    };

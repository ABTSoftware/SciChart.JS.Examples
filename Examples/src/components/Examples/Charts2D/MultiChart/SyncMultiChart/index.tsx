import { useState, useRef } from "react";
import { NumberRange, SciChartSurface, SciChartVerticalGroup } from "scichart";
import { SciChartReact } from "scichart-react";
import { AxisSynchroniser } from "./AxisSynchroniser";
import { DeleteSweepIcon, LinkIcon, LinkOffIcon } from "../../../icons";
import { MAX_CHARTS, addToOverview, createChart, createOverview, removeFromOverview } from "./drawExample";

export default function SyncMultiChart() {
    const [chartPanes, setChartPanes] = useState(() =>
        Array.from({ length: 3 }, (_, index) => ({ id: index + 1, isSynced: true }))
    );
    const [overview, setOverview] = useState<SciChartSurface>();
    const [{ verticalGroup, axisSynchroniser }] = useState(() => ({
        verticalGroup: new SciChartVerticalGroup(),
        axisSynchroniser: new AxisSynchroniser(new NumberRange(200, 500)),
    }));
    const surfaces = useRef(new Map<number, SciChartSurface>());
    const nextId = useRef(4);

    return (
        <SciChartReact
            className="sc-chart-wrapper flex flex-col h-full"
            innerContainerProps={{ style: { height: 100, flex: "none" } }}
            initChart={(root) => createOverview(root, axisSynchroniser)}
            onInit={({ sciChartSurface }) => {
                verticalGroup.addSurfaceToGroup(sciChartSurface);
                setOverview(sciChartSurface);
                return () => {
                    axisSynchroniser.clear();
                    verticalGroup.removeSurface(sciChartSurface);
                };
            }}
        >
            <div className="flex flex-none justify-between items-center p-2 pl-4">
                <span><strong>Click & drag</strong> or <strong>Mousewheel</strong> to zoom/pan the charts.</span>
                <button
                    type="button"
                    className="sc-button sc-button-outline"
                    disabled={chartPanes.length >= MAX_CHARTS}
                    onClick={() => {
                        const id = nextId.current++;
                        setChartPanes((panes) =>
                            panes.length < MAX_CHARTS ? [...panes, { id, isSynced: true }] : panes
                        );
                    }}
                >
                    Add Chart
                </button>
            </div>

            <div className="flex flex-col flex-1 overflow-hidden">
                {chartPanes.map((pane) => (
                    <SciChartReact
                        key={pane.id}
                        className="relative flex-1 h-full overflow-hidden"
                        initChart={(root) => createChart(root, pane.id)}
                        onInit={({ sciChartSurface }) => {
                            surfaces.current.set(pane.id, sciChartSurface);
                            verticalGroup.addSurfaceToGroup(sciChartSurface);
                            axisSynchroniser.addAxis(sciChartSurface.xAxes.get(0));
                            addToOverview(sciChartSurface.renderableSeries.get(0), overview);
                            return () => {
                                if (!overview.isDeleted) {
                                    removeFromOverview(sciChartSurface.renderableSeries.get(0), overview);
                                }
                                axisSynchroniser.removeAxis(sciChartSurface.xAxes.get(0));
                                verticalGroup.removeSurface(sciChartSurface);
                                surfaces.current.delete(pane.id);
                            };
                        }}
                    >
                        {/* Overlay Controls: */}
                        <div className="absolute top-0 right-0 flex items-center gap-1 m-2">
                            <button
                                type="button"
                                className="sc-button sc-button-icon"
                                title={pane.isSynced ? "Unsync chart" : "Sync chart"}
                                aria-label="Sync chart"
                                aria-pressed={pane.isSynced}
                                onClick={() => {
                                    const axis = surfaces.current.get(pane.id).xAxes.get(0);
                                    if (pane.isSynced) {
                                        axisSynchroniser.removeAxis(axis);
                                    } else {
                                        axisSynchroniser.addAxis(axis);
                                    }
                                    setChartPanes((panes) =>
                                        panes.map((item) =>
                                            item.id === pane.id ? { ...item, isSynced: !item.isSynced } : item
                                        )
                                    );
                                }}
                            >
                                {pane.isSynced ? <LinkIcon /> : <LinkOffIcon />}
                            </button>

                            <button
                                type="button"
                                className="sc-button sc-button-icon sc-button-danger"
                                title="Remove chart"
                                aria-label="Remove chart"
                                onClick={() => setChartPanes((panes) => panes.filter(({ id }) => id !== pane.id))}
                            >
                                <DeleteSweepIcon />
                            </button>
                        </div>
                    </SciChartReact>
                ))}
            </div>
        </SciChartReact>
    );
}

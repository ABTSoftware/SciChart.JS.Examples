import {
    CameraController,
    ECameraProjectionMode,
    EAutoRange,
    EAxisAlignment,
    ELegendOrientation,
    FastLineRenderableSeries,
    FastMountainRenderableSeries,
    GradientParams,
    LegendModifier,
    MouseWheelZoomModifier3D,
    NumberRange,
    NumericAxis,
    NumericAxis3D,
    OrbitModifier3D,
    Point,
    PointLineRenderableSeries3D,
    ResetCamera3DModifier,
    SciChart3DSurface,
    SciChartJsNavyTheme,
    SciChartSurface,
    SeriesSelectionModifier3D,
    TLegendItem,
    Thickness,
    Vector3,
    XyDataSeries,
    XyzDataSeries3D,
    XyzSeriesInfo3D,
} from "scichart";
import { Radix2FFT } from "../../../FeaturedApps/ScientificCharts/AudioAnalyzer/Radix2FFT";
import { appTheme } from "../../../theme";

export const divMainChart3DId = "sciChart1_3d";
export const divCrossSection1 = "sciChart2";
export const divCrossSection2 = "sciChart3";

const SERIES_COUNT = 50;
const DEFAULT_SERIES_POSITION = 0.68;
const DEFAULT_SLICE_POSITION = 0.72;

const createSpectralData = (n: number) => {
    const spectraSize = 1024;
    const timeData = new Array(spectraSize);

    for (let i = 0; i < spectraSize; i++) {
        timeData[i] =
            2.0 * Math.sin((2 * Math.PI * i) / (20 + n * 0.2)) +
            5 * Math.sin((2 * Math.PI * i) / (10 + n * 0.01)) +
            10 * Math.sin((2 * Math.PI * i) / (5 + n * -0.002)) +
            2.0 * Math.random();
    }

    const transform = new Radix2FFT(spectraSize);
    const yValues = transform.run(timeData).slice(0, 300);

    for (let i = 0; i < yValues.length; i++) {
        yValues[i] =
            yValues[i] < -30 || yValues[i] > -5 ? (yValues[i] < -30 ? -30 : Math.random() * 9 - 6) : yValues[i];
    }
    yValues[0] = -30;

    const xValues = yValues.map((_, index) => index);
    return { xValues, yValues };
};

const parseSeriesIndex = (series: { id?: string } | undefined): number | undefined => {
    const rawId = series?.id;
    if (!rawId || rawId.length < 2 || rawId[0] !== "S") {
        return undefined;
    }

    const parsed = Number(rawId.substring(1));
    return Number.isInteger(parsed) ? parsed : undefined;
};

const resolve3DDataIndex = (hitTestInfo: XyzSeriesInfo3D | undefined) => {
    if (!hitTestInfo?.isHit || !Number.isInteger(hitTestInfo.dataSeriesIndex) || hitTestInfo.dataSeriesIndex < 0) {
        return undefined;
    }
    return hitTestInfo.dataSeriesIndex;
};

// This function returns methods for initializing the example
export const getChartsInitializationAPI = () => {
    const theme = new SciChartJsNavyTheme();
    const spectralData = Array.from({ length: SERIES_COUNT }, (_, i) => createSpectralData(i));
    const defaultSelectedSeriesIndex = Math.min(
        SERIES_COUNT - 1,
        Math.max(0, Math.floor(SERIES_COUNT * DEFAULT_SERIES_POSITION))
    );
    const defaultSelectedSliceIndex = Math.min(
        spectralData[0].xValues.length - 1,
        Math.max(0, Math.floor(spectralData[0].xValues.length * DEFAULT_SLICE_POSITION))
    );

    let selectedSeriesIndex: number | undefined = defaultSelectedSeriesIndex;
    let hoveredSeriesIndex: number | undefined;
    let selectedDataIndex: number | undefined = defaultSelectedSliceIndex;

    let mainChart3DSurface: SciChart3DSurface;
    const mainChart3DSeries: PointLineRenderableSeries3D[] = [];
    let mainChartSelectionModifier3D: SeriesSelectionModifier3D;

    let crossSectionSelectedDataSeries: XyDataSeries;
    let crossSectionHoveredDataSeries: XyDataSeries;
    let crossSectionSliceSeries: XyDataSeries;
    let crossSectionLegendModifier: LegendModifier;

    const updateCrossSectionSelectedSeries = () => {
        crossSectionSelectedDataSeries?.clear();
        if (selectedSeriesIndex === undefined) {
            return;
        }

        const selected = spectralData[selectedSeriesIndex];
        crossSectionSelectedDataSeries.appendRange(selected.xValues, selected.yValues);
    };

    const updateCrossSectionHoveredSeries = () => {
        crossSectionHoveredDataSeries?.clear();
        if (hoveredSeriesIndex === undefined) {
            return;
        }

        const hovered = spectralData[hoveredSeriesIndex];
        crossSectionHoveredDataSeries.appendRange(hovered.xValues, hovered.yValues);
    };

    const updateCrossSectionSlice = () => {
        crossSectionSliceSeries?.clear();
        if (selectedDataIndex === undefined) {
            return;
        }

        const maxIndex = spectralData[0].yValues.length - 1;
        const safeIndex = Math.max(0, Math.min(maxIndex, selectedDataIndex));

        for (let i = 0; i < spectralData.length; i++) {
            crossSectionSliceSeries.append(i, spectralData[i].yValues[safeIndex]);
        }
    };

    const update3DSeriesStyles = () => {
        for (let i = 0; i < mainChart3DSeries.length; i++) {
            const isSelected = i === selectedSeriesIndex;
            const isHovered = i === hoveredSeriesIndex;
            const series = mainChart3DSeries[i];
            series.opacity = isSelected ? 1 : isHovered ? 0.8 : 0.1;
            series.strokeThickness = isSelected ? 6 : isHovered ? 5 : 4;
            series.stroke = isSelected ? "#FFFFFF" : isHovered ? "#FFBE93" : "#64BAE4";
        }
    };

    const syncSharedState = () => {
        update3DSeriesStyles();
        updateCrossSectionSelectedSeries();
        updateCrossSectionHoveredSeries();
        updateCrossSectionSlice();
        crossSectionLegendModifier?.sciChartLegend?.invalidateLegend();
    };

    const initMainChart3D = async (rootElement: string | HTMLDivElement) => {
        const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(rootElement, {
            theme,
        });

        mainChart3DSurface = sciChart3DSurface;
        mainChart3DSurface.worldDimensions = new Vector3(300, 100, 150);
        mainChart3DSurface.camera = new CameraController(wasmContext, {
            position: new Vector3(-50, 175, 210),
            target: new Vector3(0, 50, 0),
            projectionMode: ECameraProjectionMode.Orthogonal,
            orthoWidth: 450,
            orthoHeight: 330,
        });

        mainChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
            axisTitle: "Frequency (Hz)",
            drawMinorGridLines: false,
            drawMajorGridLines: false,
            labelPrecision: 0,
            titleOffset: 10,
        });

        mainChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
            axisTitle: "Power (dB)",
            drawMinorGridLines: false,
            drawMajorGridLines: false,
            labelPrecision: 0,
            titleOffset: 30,
        });

        mainChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
            axisTitle: "Time (s)",
            drawMinorGridLines: false,
            drawMajorGridLines: false,
            labelPrecision: 0,
            titleOffset: 30,
        });

        for (let i = 0; i < SERIES_COUNT; i++) {
            const { xValues, yValues } = spectralData[i];
            const zValues = new Array(xValues.length).fill(i);

            const dataSeries = new XyzDataSeries3D(wasmContext, {
                xValues,
                yValues,
                zValues,
                dataSeriesName: `Spectra ${i}`,
            });

            const lineSeries = new PointLineRenderableSeries3D(wasmContext, {
                id: `S${i}`,
                dataSeries,
                stroke: "#64BAE4",
                strokeThickness: 4,
                opacity: 0.1,
                isLineStrip: true,
                isAntiAliased: true,
            });

            mainChart3DSeries.push(lineSeries);
            mainChart3DSurface.renderableSeries.add(lineSeries);
        }

        mainChartSelectionModifier3D = new SeriesSelectionModifier3D({
            enableHover: true,
            enableSelection: true,
            hitTestRadius: 6,
            prioritizeClosestToCamera: true,
            onSelectionChanged: args => {
                selectedSeriesIndex = parseSeriesIndex(args.selectedSeries[0]);
                const dataIndex = resolve3DDataIndex(args.hitTestInfo as XyzSeriesInfo3D);
                if (dataIndex !== undefined) {
                    selectedDataIndex = dataIndex;
                }
                syncSharedState();
            },
            onHoverChanged: args => {
                hoveredSeriesIndex = parseSeriesIndex(args.hoveredSeries[0]);
                const dataIndex = resolve3DDataIndex(args.hitTestInfo as XyzSeriesInfo3D);
                if (dataIndex !== undefined) {
                    selectedDataIndex = dataIndex;
                }
                syncSharedState();
            },
        });

        mainChart3DSurface.chartModifiers.add(
            new MouseWheelZoomModifier3D(),
            new OrbitModifier3D(),
            new ResetCamera3DModifier(),
            mainChartSelectionModifier3D
        );

        return { sciChartSurface: sciChart3DSurface, wasmContext };
    };

    const initCrossSectionLeft = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
            disableAspect: true,
            theme,
        });

        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, {
                autoRange: EAutoRange.Always,
                drawMinorGridLines: false,
            })
        );
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                autoRange: EAutoRange.Never,
                axisAlignment: EAxisAlignment.Left,
                visibleRange: new NumberRange(-30, 10),
                drawMinorGridLines: false,
            })
        );

        crossSectionSelectedDataSeries = new XyDataSeries(wasmContext, { dataSeriesName: "Selected Spectrum" });
        sciChartSurface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                stroke: "#ff6600",
                strokeThickness: 3,
                dataSeries: crossSectionSelectedDataSeries,
            })
        );

        crossSectionHoveredDataSeries = new XyDataSeries(wasmContext, { dataSeriesName: "Hovered Spectrum" });
        sciChartSurface.renderableSeries.add(
            new FastMountainRenderableSeries(wasmContext, {
                stroke: "#64BAE477",
                strokeThickness: 3,
                strokeDashArray: [2, 2],
                fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                    { color: "#64BAE455", offset: 0 },
                    { color: "#64BAE400", offset: 1 },
                ]),
                dataSeries: crossSectionHoveredDataSeries,
                zeroLineY: -999,
            })
        );

        crossSectionLegendModifier = new LegendModifier({
            showCheckboxes: false,
            orientation: ELegendOrientation.Horizontal,
        });
        crossSectionLegendModifier.sciChartLegend.getLegendItemHTML = (
            orientation: ELegendOrientation,
            showCheckboxes: boolean,
            showSeriesMarkers: boolean,
            item: TLegendItem
        ): string => {
            const display = orientation === ELegendOrientation.Vertical ? "flex" : "inline-flex";
            let str = `<span class=\"scichart__legend-item\" style=\"display:${display};align-items:center;margin-right:4px;padding:0 4px 0 5px;white-space:nowrap;gap:6px\">`;

            if (showCheckboxes) {
                const checked = item.checked ? "checked" : "";
                str += `<input ${checked} type=\"checkbox\" id=\"${item.id}\">`;
            }

            if (showSeriesMarkers) {
                const isHoveredLegend = item.name === "Hovered Spectrum";
                const dashAttr = isHoveredLegend ? `stroke-dasharray=\"2,2\"` : "";
                str += `<svg xmlns=\"http://www.w3.org/2000/svg\" for=\"${item.id}\" style=\"width:18px;height:12px\" viewBox=\"0 0 18 12\"><line x1=\"1\" y1=\"6\" x2=\"17\" y2=\"6\" stroke=\"${item.color}\" stroke-width=\"2\" ${dashAttr} /></svg>`;
            }

            str += `<label for=\"${item.id}\">${item.name}</label>`;
            str += `</span>`;
            return str;
        };
        crossSectionLegendModifier.isEnabled = false;
        sciChartSurface.chartModifiers.add(crossSectionLegendModifier);

        return { sciChartSurface, wasmContext };
    };

    const initCrossSectionRight = async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
            disableAspect: true,
            theme,
            title: "Cross Section Slice",
            titleStyle: {
                fontSize: 13,
                padding: Thickness.fromNumber(10),
            },
        });

        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, {
                autoRange: EAutoRange.Always,
                drawMinorGridLines: false,
            })
        );
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                autoRange: EAutoRange.Never,
                axisAlignment: EAxisAlignment.Left,
                visibleRange: new NumberRange(-30, 5),
                drawMinorGridLines: false,
            })
        );

        crossSectionSliceSeries = new XyDataSeries(wasmContext);
        sciChartSurface.renderableSeries.add(
            new FastMountainRenderableSeries(wasmContext, {
                stroke: "#64BAE4",
                strokeThickness: 3,
                strokeDashArray: [2, 2],
                fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                    { color: "#64BAE477", offset: 0 },
                    { color: "#64BAE433", offset: 1 },
                ]),
                dataSeries: crossSectionSliceSeries,
                zeroLineY: -999,
            })
        );

        return { sciChartSurface, wasmContext };
    };

    const configureAfterInit = () => {
        crossSectionLegendModifier.isEnabled = true;
        syncSharedState();
    };

    return {
        initMainChart3D,
        initCrossSectionLeft,
        initCrossSectionRight,
        configureAfterInit,
    };
};

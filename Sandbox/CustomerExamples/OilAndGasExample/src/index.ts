import initGrChart from "./charts/gr";
import initRhdbChart from "./charts/rhdb";
import { SciChartVerticalGroup } from "scichart/Charting/LayoutManager/SciChartVerticalGroup";
import initNphiChart from "./charts/nphi";
import initDtChart from "./charts/dt";
import initLldChart from "./charts/lld";
import initVshChart from "./charts/vsh";
import { NumberRange } from "scichart/Core/NumberRange";

({
    charts: {
        gr: "scichart-gr",
        rhdb: "scichart-rhdb",
        nphi: "scichart-nphi",
        dt: "scichart-dt",
        lld: "scichart-lld",
        vsh: "scichart-vsh",
    },
    chartGroup: new SciChartVerticalGroup(),
    pointsCount: 10000,
    visibleRange: new NumberRange(0.0, 1.0),
    init() {
        this.buildCharts();
    },
    buildCharts() {
        initGrChart(this.charts.gr, this.chartGroup, this.pointsCount, this.visibleRange);
        initRhdbChart(this.charts.rhdb, this.chartGroup, this.pointsCount, this.visibleRange);
        initNphiChart(this.charts.nphi, this.chartGroup, this.pointsCount, this.visibleRange);
        initDtChart(this.charts.dt, this.chartGroup, this.pointsCount, this.visibleRange);
        initLldChart(this.charts.lld, this.chartGroup, this.pointsCount, this.visibleRange);
        initVshChart(this.charts.vsh, this.chartGroup, this.pointsCount, this.visibleRange);
    }
}).init();
import initGrChart from "./charts/gr";
import initRhdbChart from "./charts/rhdb";
import { SciChartVerticalGroup } from "scichart/Charting/LayoutManager/SciChartVerticalGroup";
import initNphiChart from "./charts/nphi";
import initDtChart from "./charts/dt";
import initLldChart from "./charts/lld";
import initVshChart from "./charts/vsh";
import { NumberRange } from "scichart/Core/NumberRange";
import init3dChart from "./charts/3d";
import init2dFirstChart from "./charts/2dcharts/first";
import init2dSecondChart from "./charts/2dcharts/second";
import init2dThirdChart from "./charts/2dcharts/third";
import init2dFourthChart from "./charts/2dcharts/fourth";
import init2dFifthChart from "./charts/2dcharts/fifth";
import init2dSixthChart from "./charts/2dcharts/sixth";
import init2dSeventhChart from "./charts/2dcharts/seventh";
import init2dEighthChart from "./charts/2dcharts/eighth";
import init2dNinthChart from "./charts/2dcharts/ninth";
import { initVerticalCharts } from "./charts/VerticalCharts/initVerticalCharts";

({
    charts: {
        gr: "scichart-gr",
        rhdb: "scichart-rhdb",
        nphi: "scichart-nphi",
        dt: "scichart-dt",
        lld: "scichart-lld",
        vsh: "scichart-vsh",
        '3d': "scichart-3d",
        '2dFirst': "scichart-2d-first",
        '2dSecond': "scichart-2d-second",
        '2dThird': "scichart-2d-third",
        '2dFourth': "scichart-2d-fourth",
        '2dFifth': "scichart-2d-fifth",
        '2dSixth': "scichart-2d-sixth",
        '2dSeventh': "scichart-2d-seventh",
        '2dEighth': "scichart-2d-eighth",
        '2dNinth': "scichart-2d-ninth",
    },
    chartGroup: new SciChartVerticalGroup(),
    pointsCount: 10000,
    visibleRange: new NumberRange(0.0, 1.0),
    init() {
        this.buildCharts();
    },
    buildCharts() {
        init2dFirstChart(this.charts["2dFirst"]);
        init2dSecondChart(this.charts["2dSecond"]);
        init2dThirdChart(this.charts["2dThird"]);
        init2dFourthChart(this.charts["2dFourth"]);
        init2dFifthChart(this.charts["2dFifth"]);
        init2dSixthChart(this.charts["2dSixth"]);
        init2dSeventhChart(this.charts["2dSeventh"]);
        init2dEighthChart(this.charts["2dEighth"]);
        init2dNinthChart(this.charts["2dNinth"]);
        init3dChart(this.charts["3d"]);
        initVerticalCharts();
    }
}).init();
"use client";
import { useEffect, useState } from "react";
import {
    divElementId,
    divOverviewId,
    divElementId1,
    divOverviewId1,
    drawExample,
    drawExample1,
    drawExample2,
    drawExample3,
    divOverviewId2,
    divElementId2,
    divElementId3,
    divOverviewId3,
} from "./drawExample1";

import { appTheme } from "../../../theme";

import { drawWafer, waferId } from "./drawExample";

import { drawBoxPlot, boxPlotId } from "./boxPlot";

import { drawScatterPlot, scatterPlotId } from "./scatterPlot";

import { calculateBoxplotValues } from "./helpers";

import useDataStore from "./store";

const Charts = () => {
    const [MRsFilter, setMRsFilter] = useState<[number, number]>([null, null]);
    const [HRsFilter, setHRsFilter] = useState<[number, number]>([null, null]);
    const [HDIsFilter, setHDIsFilter] = useState<[number, number]>([null, null]);
    const [MR2sFilter, setMR2sFilter] = useState<[number, number]>([null, null]);

    const { dies, MR, MRs, HR, HRs, HDI, HDIs, MR2, MR2s } = useDataStore();

    if (MRsFilter[0] !== null && MRsFilter[1] !== null) {
        MR!.filter(MRsFilter);
    }

    if (HRsFilter[0] !== null && HRsFilter[1] !== null) {
        HR!.filter(HRsFilter);
    }

    if (HDIsFilter[0] !== null && HDIsFilter[1] !== null) {
        HDI!.filter(HDIsFilter);
    }

    if (MR2sFilter[0] !== null && MR2sFilter[1] !== null) {
        MR2!.filter(MR2sFilter);
    }

    useEffect(() => {
        const MRs = dies.all().map((d) => {
            return d.MR;
        });

        const HRs = dies.all().map((d) => {
            return d.HR;
        });

        const HDIs = dies.all().map((d) => {
            return d.HDI;
        });

        const MR2s = dies.all().map((d) => {
            return d.MR2;
        });

        console.log(calculateBoxplotValues(MRs));

        const values = {
            MR: calculateBoxplotValues(MRs),
            HR: calculateBoxplotValues(HRs),
            HDI: calculateBoxplotValues(HDIs),
            MR2: calculateBoxplotValues(MR2s),
        };

        drawBoxPlot(values);
        
    }, []);

    useEffect(() => {
        drawWafer(dies.allFiltered());
        drawScatterPlot(dies.allFiltered());
    }, [dies.allFiltered()]);

    useEffect(() => {
        const MRsX = MRs!.all().map((d) => d.key);
        const MRsY = MRs!.all().map((d) => d.value!) as number[];

        const HRsX = HRs!.all().map((d) => d.key);
        const HRsY = HRs!.all().map((d) => d.value!) as number[];

        const HDIsX = HDIs!.all().map((d) => d.key);
        const HDIsY = HDIs!.all().map((d) => d.value!) as number[];

        const MR2sX = MR2s!.all().map((d) => d.key);
        const MR2sY = MR2s!.all().map((d) => d.value!) as number[];

        const chartsPromise = Promise.all([
            drawExample(MRsX, MRsY, setMRsFilter),
            drawExample1(HRsX, HRsY, setHRsFilter),
            drawExample2(HDIsX, HDIsY, setHDIsFilter),
            drawExample3(MR2sX, MR2sY, setMR2sFilter),
        ]);

        return () => {
            chartsPromise.then((charts) => charts.forEach((chart) => chart?.sciChartSurface?.delete()));
        };
    }, []);

    return (
        <div className="" style={{ display: "flex", flexDirection: "row", backgroundColor: appTheme.DarkIndigo }}>
            <div className="">
                <div id={waferId} style={{ height: 400, width: 420 }} />
                <div id={boxPlotId} style={{ height: 200, width: 420 }} />
            </div>

            <div className="" style={{ width: 510 }}>
                <div id={scatterPlotId} style={{ height: 300, width: "100%" }} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <h5 style={{ color: appTheme.MutedSkyBlue, paddingLeft: 10 }}>
                        MR values - between {MRsFilter[0]} and {MRsFilter[1]}
                    </h5>
                    <div id={divElementId} style={{ flexBasis: 80, flexGrow: 1, flexShrink: 1 }} />
                    <div id={divOverviewId} style={{ flexBasis: 50, flexGrow: 1, flexShrink: 1 }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <h5 style={{ color: appTheme.MutedSkyBlue, paddingLeft: 10 }}>
                        HR values - between {HRsFilter[0]} and {HRsFilter[1]}
                    </h5>
                    <div id={divElementId1} style={{ flexBasis: 80, flexGrow: 1, flexShrink: 1 }} />
                    <div id={divOverviewId1} style={{ flexBasis: 50, flexGrow: 1, flexShrink: 1 }} />
                </div>
                {/* <div style={{ display: "flex", flexDirection: "column" }}>
                    <h5 style={{ color: appTheme.MutedSkyBlue, paddingLeft: 10 }}>
                        HDI values - between {HDIsFilter[0]} and {HDIsFilter[1]}
                    </h5>
                    <div id={divElementId2} style={{ flexBasis: 80, flexGrow: 1, flexShrink: 1 }} />
                    <div id={divOverviewId2} style={{ flexBasis: 50, flexGrow: 1, flexShrink: 1 }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <h5 style={{ color: appTheme.MutedSkyBlue, paddingLeft: 10 }}>
                        MR2 values - between {MR2sFilter[0]} and {MR2sFilter[1]}
                    </h5>
                    <div id={divElementId3} style={{ flexBasis: 80, flexGrow: 1, flexShrink: 1 }} />
                    <div id={divOverviewId3} style={{ flexBasis: 50, flexGrow: 1, flexShrink: 1 }} />
                </div> */}
            </div>
        </div>
    );
};

export default Charts;

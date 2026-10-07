import { useState } from "react";
import { appTheme } from "../../../theme";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";
import "./styles.css";

export default function VitalSignsMonitorDemo() {
    const [infoEcg, setInfoEcg] = useState<number>(0);
    const [infoBloodPressure1, setInfoBloodPressure1] = useState<number>(0);
    const [infoBloodPressure2, setInfoBloodPressure2] = useState<number>(0);
    const [infoBloodVolume, setInfoBloodVolume] = useState<number>(0);
    const [infoBloodOxygenation, setInfoBloodOxygenation] = useState<number>(0);

    return (
        <div className="sc-chart-wrapper flex">
            <SciChartReact
                className="w-full"
                initChart={drawExample}
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    initResult.subscribeToDataUpdates((info) => {
                        setInfoEcg(info.ecg);
                        setInfoBloodPressure1(info.bloodPressure1);
                        setInfoBloodPressure2(info.bloodPressure2);
                        setInfoBloodVolume(info.bloodVolume);
                        setInfoBloodOxygenation(info.bloodOxygenation);
                    });

                    initResult.controls.startUpdate();

                    return () => {
                        initResult.controls.stopUpdate();
                    };
                }}
            />
            <div className="sc-vitals-cards">
                <div className="sc-vitals-card" style={{ color: appTheme.VividOrange }}>
                    <div className="flex flex-1">
                        <div className="sc-vitals-title">ECG</div>
                        <div className="sc-vitals-value">{infoEcg}</div>
                    </div>
                    <div className="flex items-end">
                        <div className="sc-vitals-details">
                            <div>
                                V1 - 1.4MM
                                <br />
                                ST | +0.6 || +0.9
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sc-vitals-card" style={{ color: appTheme.VividSkyBlue }}>
                    <div className="flex flex-1">
                        <div className="sc-vitals-title">NIBP</div>
                        <div className="sc-vitals-meta">
                            AUTO
                            <br />
                            145/95
                        </div>
                    </div>
                    <div className="flex items-end">
                        <div className="sc-vitals-value">
                            <div>
                                {infoBloodPressure1}/{infoBloodPressure2}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="sc-vitals-card" style={{ color: appTheme.VividPink }}>
                    <div className="flex flex-1">
                        <div className="sc-vitals-title">SV</div>
                        <div className="sc-vitals-meta">
                            ML 100
                            <br />
                            %**** 55
                        </div>
                    </div>
                    <div className="flex items-end">
                        <div className="sc-vitals-value">
                            <div>{infoBloodVolume.toFixed(1)}</div>
                        </div>
                    </div>
                </div>
                <div className="sc-vitals-card" style={{ color: appTheme.VividTeal }}>
                    <div className="flex flex-1">
                        <div className="sc-vitals-title">
                            SPO<span>2</span>
                        </div>
                        <div className="sc-vitals-meta">18:06</div>
                    </div>
                    <div className="flex items-end">
                        <div className="sc-vitals-details">
                            <div>
                                71-
                                <br />
                                RESP
                            </div>
                        </div>
                        <div className="sc-vitals-value">{infoBloodOxygenation}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

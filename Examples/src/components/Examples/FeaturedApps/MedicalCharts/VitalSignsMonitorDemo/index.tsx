import * as React from "react";
import { appTheme } from "../../../theme";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";

// REACT COMPONENT
export default function VitalSignsMonitorDemo() {
    const controlsRef = React.useRef<TResolvedReturnType<typeof drawExample>["controls"]>(undefined);

    const [infoEcg, setInfoEcg] = React.useState<number>(0);
    const [infoBloodPressure1, setInfoBloodPressure1] = React.useState<number>(0);
    const [infoBloodPressure2, setInfoBloodPressure2] = React.useState<number>(0);
    const [infoBloodVolume, setInfoBloodVolume] = React.useState<number>(0);
    const [infoBloodOxygenation, setInfoBloodOxygenation] = React.useState<number>(0);

    return (
        <div className="sc-chart-wrapper">
            <div style={{ display: "flex", height: "100%" }}>
                <SciChartReact
                    className="sc-vitals"
                    initChart={drawExample}
                    onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                        initResult.subscribeToDataUpdates((info) => {
                            setInfoEcg(info.ecg);
                            setInfoBloodPressure1(info.bloodPressure1);
                            setInfoBloodPressure2(info.bloodPressure2);
                            setInfoBloodVolume(info.bloodVolume);
                            setInfoBloodOxygenation(info.bloodOxygenation);
                        });

                        controlsRef.current = initResult.controls;
                        initResult.controls.startUpdate();

                        return () => {
                            initResult.controls.stopUpdate();
                        };
                    }}
                />
                <div className="sc-vitals-cards">
                    <div
                        className="sc-vitals-card"
                        style={{ color: appTheme.VividOrange, background: appTheme.Background }}
                    >
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
                    <div
                        className="sc-vitals-card"
                        style={{ color: appTheme.VividSkyBlue, background: appTheme.Background }}
                    >
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
                    <div
                        className="sc-vitals-card"
                        style={{ color: appTheme.VividPink, background: appTheme.Background }}
                    >
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
                    <div
                        className="sc-vitals-card"
                        style={{ color: appTheme.VividTeal, background: appTheme.Background }}
                    >
                        <div className="flex flex-1">
                            <div className="sc-vitals-title">
                                SPO<span style={{ fontSize: 12 }}>2</span>
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
        </div>
    );
}

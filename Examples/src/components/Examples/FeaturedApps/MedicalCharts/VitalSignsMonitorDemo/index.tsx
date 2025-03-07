import * as React from "react";
import commonClasses from "../../../styles/Examples.module.scss";
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
        <div className={commonClasses.ChartWrapper}>
            <div style={{ display: "flex", height: "100%" }}>
                <SciChartReact
                    className={commonClasses.VitalSigns}
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
                <div className={commonClasses.InfoBoxContainer}>
                    <div
                        className={commonClasses.InfoBox}
                        style={{ color: appTheme.VividOrange, background: appTheme.Background }}
                    >
                        <div className={commonClasses.IbRow1}>
                            <div className={commonClasses.IbRow1Col1}>ECG</div>
                            <div className={commonClasses.IbRow2Col2}>{infoEcg}</div>
                        </div>
                        <div className={commonClasses.IbRow2}>
                            <div className={commonClasses.IbRow2Col1}>
                                <div>
                                    V1 - 1.4MM
                                    <br />
                                    ST | +0.6 || +0.9
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className={commonClasses.InfoBox}
                        style={{ color: appTheme.VividSkyBlue, background: appTheme.Background }}
                    >
                        <div className={commonClasses.IbRow1}>
                            <div className={commonClasses.IbRow1Col1}>NIBP</div>
                            <div className={commonClasses.IbRow1Col2}>
                                AUTO
                                <br />
                                145/95
                            </div>
                        </div>
                        <div className={commonClasses.IbRow2}>
                            <div className={commonClasses.IbRow2Col2}>
                                <div>
                                    {infoBloodPressure1}/{infoBloodPressure2}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className={commonClasses.InfoBox}
                        style={{ color: appTheme.VividPink, background: appTheme.Background }}
                    >
                        <div className={commonClasses.IbRow1}>
                            <div className={commonClasses.IbRow1Col1}>SV</div>
                            <div className={commonClasses.IbRow1Col2}>
                                ML 100
                                <br />
                                %**** 55
                            </div>
                        </div>
                        <div className={commonClasses.IbRow2}>
                            <div className={commonClasses.IbRow2Col2}>
                                <div>{infoBloodVolume.toFixed(1)}</div>
                            </div>
                        </div>
                    </div>
                    <div
                        className={commonClasses.InfoBox}
                        style={{ color: appTheme.VividTeal, background: appTheme.Background }}
                    >
                        <div className={commonClasses.IbRow1}>
                            <div className={commonClasses.IbRow1Col1}>
                                SPO<span style={{ fontSize: 12 }}>2</span>
                            </div>
                            <div className={commonClasses.IbRow1Col2}>18:06</div>
                        </div>
                        <div className={commonClasses.IbRow2}>
                            <div className={commonClasses.IbRow2Col1}>
                                <div>
                                    71-
                                    <br />
                                    RESP
                                </div>
                            </div>
                            <div className={commonClasses.IbRow2Col2}>{infoBloodOxygenation}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

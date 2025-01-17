import { useRef, useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import Button from "@mui/material/Button";
import { makeStyles } from "tss-react/mui";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { appTheme } from "../../../theme";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawGridExample, TMessage } from "./drawExample";

const useStyles = makeStyles()((theme) => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: appTheme.DarkIndigo,
    },
    chartArea: {
        flex: 1,
    },
    infoBlock: {
        display: "flex",
        flex: "auto",
        marginLeft: 10,
        marginTop: 6,
    },
    infoItem: {
        flex: "auto",
    },
}));

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function SubchartsGrid() {
    const controlsRef = useRef<TResolvedReturnType<typeof drawExample>["controls"]>(undefined);
    const [isStarted, setIsStarted] = useState(false);

    const [messages, setMessages] = useState<TMessage[]>([]);

    const { classes } = useStyles();

    const handleLabelsChange = (ev: any, checked: boolean) => {
        controlsRef.current.setLabels(checked);
    };

    const drawExample = (rootElement: string | HTMLDivElement) =>
        drawGridExample(rootElement, (newMessages: TMessage[]) => {
            setMessages([...newMessages]);
        });

    return (
        <div className={commonClasses.ChartWrapper}>
            <div className={classes.flexOuterContainer}>
                <div className={commonClasses.ToolbarRow} style={{ justifyContent: "space-between" }}>
                    <Button
                        onClick={() => {
                            if (isStarted) {
                                controlsRef.current.stopUpdate();
                            } else {
                                controlsRef.current.startUpdate();
                            }
                            setIsStarted(!isStarted);
                        }}
                    >
                        {isStarted ? <PauseIcon /> : <PlayArrowIcon />}
                    </Button>
                    <FormControlLabel
                        className={commonClasses.FormControlLabel}
                        control={<Checkbox onChange={handleLabelsChange} />}
                        label="Axis Labels"
                        labelPlacement="start"
                    />
                    <div className={classes.infoBlock}>
                        {messages.map((msg, index) => (
                            <div key={index} className={classes.infoItem}>
                                {msg.title}: {msg.detail}
                            </div>
                        ))}
                    </div>
                </div>
                <SciChartReact
                    className={classes.chartArea}
                    initChart={drawExample}
                    onInit={({ controls }: TResolvedReturnType<typeof drawExample>) => {
                        controlsRef.current = controls;
                    }}
                    onDelete={({ controls }: TResolvedReturnType<typeof drawExample>) => {
                        controls.stopUpdate();
                    }}
                />
            </div>
        </div>
    );
}

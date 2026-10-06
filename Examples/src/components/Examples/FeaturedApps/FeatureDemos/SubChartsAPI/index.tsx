import { useRef, useState } from "react";
import { PlayArrowIcon, StopIcon, SettingsIcon, CloseIcon } from "../../../icons";
import { BodyPortal } from "../../../Portal";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawGridExample, TMessage } from "./drawExample";

export default function SubchartsGrid() {
    const controlsRef = useRef<TResolvedReturnType<typeof drawExample>["controls"]>(undefined);
    const [isStarted, setIsStarted] = useState(false);

    const [messages, setMessages] = useState<TMessage[]>([]);

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleClickOpen = () => {
        setIsDialogOpen(true);
    };

    const handleClose = () => {
        setIsDialogOpen(false);
    };

    const handleLabelsChange = (checked: boolean) => {
        controlsRef.current.setLabels(checked);
    };

    const drawExample = (rootElement: string | HTMLDivElement) =>
        drawGridExample(rootElement, (newMessages: TMessage[]) => {
            setMessages([...newMessages]);
        });
    const configurationDialog = isDialogOpen ? (
        <BodyPortal>
            <div
                className="sc-modal-backdrop"
                onClick={(event) => event.target === event.currentTarget && handleClose()}
                onKeyDown={(event) => event.key === "Escape" && handleClose()}
            >
                <section className="sc-modal" role="dialog" aria-modal="true" aria-labelledby="subcharts-config-title">
                    <header className="sc-modal-header">
                        <strong id="subcharts-config-title">Chart Configurations</strong>
                        <button
                            className="sc-button sc-button-icon"
                            aria-label="Close chart configurations"
                            onClick={handleClose}
                            autoFocus
                            type="button"
                        >
                            <CloseIcon />
                        </button>
                    </header>
                    <div className="sc-modal-body">
                        <label className="sc-switch">
                            <input
                                type="checkbox"
                                onChange={(event) => handleLabelsChange(event.currentTarget.checked)}
                            />
                            Axis Labels
                        </label>
                    </div>
                </section>
            </div>
        </BodyPortal>
    ) : null;

    return (
        <div className="sc-chart-wrapper">
            <header className="sc-toolbar-row">
                <button
                    className="sc-button sc-button-icon"
                    aria-label={isStarted ? "Pause updates" : "Start updates"}
                    title={isStarted ? "Pause updates" : "Start updates"}
                    onClick={() => {
                        if (isStarted) {
                            controlsRef.current.stopUpdate();
                        } else {
                            controlsRef.current.startUpdate();
                        }
                        setIsStarted(!isStarted);
                    }}
                    type="button"
                >
                    {isStarted ? <StopIcon /> : <PlayArrowIcon />}
                </button>

                <div
                    style={{ gridArea: "1 / 1 / 2 / 2", pointerEvents: "none", touchAction: "none", zIndex: 2 }}
                    title="Chart Configurations"
                >
                    <button
                        className="sc-button sc-button-icon"
                        aria-label="Chart configurations"
                        onClick={handleClickOpen}
                        type="button"
                    >
                        <SettingsIcon fontSize="medium" />
                    </button>
                    {configurationDialog}
                </div>

                <div className="flex gap-2" style={{ marginRight: 8, flex: "1 1 20%" }}>
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className="flex-none"
                            style={{
                                padding: "0.4em",
                                textAlign: "end",
                                width: "16%",
                                fontSize: "0.8em",
                                textWrap: "nowrap",
                            }}
                        >
                            <div>{msg.title}</div>
                            <div>{msg.detail}</div>
                        </div>
                    ))}
                </div>
            </header>
            <SciChartReact
                initChart={drawExample}
                onInit={({ controls }: TResolvedReturnType<typeof drawExample>) => {
                    controlsRef.current = controls;
                }}
                onDelete={({ controls }: TResolvedReturnType<typeof drawExample>) => {
                    controls.stopUpdate();
                }}
            />
        </div>
    );
}

import { CSSProperties, useRef, useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import Switch from "@mui/material/Switch";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Button from "@mui/material/Button";
import { Dialog, DialogTitle, IconButton } from "@mui/material";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { appTheme } from "../../../theme";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawGridExample, TMessage } from "./drawExample";

const styles: Record<string, CSSProperties> = {
    infoBlock: {
        display: "flex",
        flex: "auto",
        flexBasis: "20%",
        justifyContent: "space-between",
        justifyItems: "space-between",
        marginRight: "8px",
    },
    infoItem: {
        padding: "0.4em",
        textAlign: "end",
        flex: "none",
        width: "16%",
        fontSize: "0.8em",
        textWrap: "nowrap",
    },
    configButtonWrapperStyle: {
        gridArea: "1 / 1 / 2 / 2",
        pointerEvents: "none",
        touchAction: "none",
        zIndex: 2,
    },
};

const configButtonWrapperStyle: CSSProperties = {
    gridArea: "1 / 1 / 2 / 2",
    pointerEvents: "none",
    touchAction: "none",
    zIndex: 2,
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
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

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleClickOpen = () => {
        setIsDialogOpen(true);
    };

    const handleClose = () => {
        setIsDialogOpen(false);
    };

    const handleLabelsChange = (ev: any, checked: boolean) => {
        controlsRef.current.setLabels(checked);
    };

    const drawExample = (rootElement: string | HTMLDivElement) =>
        drawGridExample(rootElement, (newMessages: TMessage[]) => {
            setMessages([...newMessages]);
        });
    const switchStyleOverrides = {
        width: "100%",
        margin: 0,
        padding: "1em",
        color: appTheme.ForegroundColor,
        accentColor: "#0bdef4",

        "& .MuiSwitch-track": {
            opacity: 1,
            backgroundColor: appTheme.PalePink,
        },
    };
    const configurationDialog = (
        <Dialog
            onClose={handleClose}
            open={isDialogOpen}
            sx={{ color: appTheme.ForegroundColor, "& .MuiDialog-paper": { background: appTheme.DarkIndigo } }}
        >
            <DialogTitle sx={{ display: "flex", padding: "16px" }}>
                <div style={{ color: appTheme.ForegroundColor }}>Chart Configurations</div>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={(theme) => ({
                        alignSelf: "flex-start",
                        justifySelf: "flex-end",
                        marginLeft: "24px",
                        padding: 0,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <List>
                <ListItem disablePadding>
                    <FormControlLabel
                        control={<Switch onChange={handleLabelsChange} />}
                        label="Axis Labels"
                        sx={switchStyleOverrides}
                    />
                </ListItem>
            </List>
        </Dialog>
    );

    return (
        <div className={commonClasses.ChartWithToolbar}>
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

                <div style={styles.configButtonWrapperStyle} title="Chart Configurations">
                    <IconButton
                        sx={{ color: appTheme.ForegroundColor, pointerEvents: "all", touchAction: "all" }}
                        onClick={handleClickOpen}
                    >
                        <SettingsIcon fontSize="medium" />
                    </IconButton>
                    {configurationDialog}
                </div>

                <div style={styles.infoBlock}>
                    {messages.map((msg, index) => (
                        <div key={index} style={styles.infoItem}>
                            <div>{msg.title}</div>
                            <div>{msg.detail}</div>
                        </div>
                    ))}
                </div>
            </div>
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

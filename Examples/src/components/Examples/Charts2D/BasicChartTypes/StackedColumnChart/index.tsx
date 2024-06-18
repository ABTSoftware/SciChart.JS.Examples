import * as React from "react";
import { appTheme } from "../../../theme";
import classes from "../../../styles/Examples.module.scss";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";
import { SciChartSurface, StackedColumnCollection } from "scichart";
import { drawExample, divElementId } from "./drawExample";

const useStyles = makeStyles((theme) => ({
    flexOuterContainer: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: appTheme.DarkIndigo,
    },
    toolbarRow: {
        display: "flex",
        // flex: "auto",
        flexBasis: "70px",
        padding: 10,
        width: "100%",
    },
    chartArea: {
        flex: 1,
    },
}));

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function StackedColumnChart() {
    const sciChartSurfaceRef = React.useRef<SciChartSurface>();
    const stackedColumnCollectionRef = React.useRef<StackedColumnCollection>();
    const [use100PercentStackedMode, setUse100PercentStackedMode] = React.useState(false);
    const [areDataLabelsVisible, setAreDataLabelsVisible] = React.useState(true);

    React.useEffect(() => {
        const chartInitializationPromise = drawExample().then((res) => {
            sciChartSurfaceRef.current = res.sciChartSurface;
            stackedColumnCollectionRef.current = res.stackedColumnCollection;
        });

        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => {
            // check if chart is already initialized
            if (sciChartSurfaceRef.current) {
                sciChartSurfaceRef.current.delete();
                return;
            }

            // else postpone deletion
            chartInitializationPromise.then(() => {
                sciChartSurfaceRef.current.delete();
            });
        };
    }, []);

    const handleUsePercentage = (event: any, value: boolean) => {
        if (value !== null) {
            console.log(`100% stacked? ${value}`);
            setUse100PercentStackedMode(value);
            // Toggle 100% mode on click
            stackedColumnCollectionRef.current.isOneHundredPercent = value;
            sciChartSurfaceRef.current.zoomExtents(200);
        }
    };

    const handleToggleDataLabels = () => {
        setAreDataLabelsVisible(!areDataLabelsVisible);
        for(let i = 0; i < 5; i++) {
            const columnSeries = stackedColumnCollectionRef.current.get(i);
            columnSeries.dataLabelProvider.style.fontSize = areDataLabelsVisible ? 0 : 12;
        }
        sciChartSurfaceRef.current.invalidateElement();
    }

    const localClasses = useStyles();
    return (
        <div className={classes.ChartWrapper}>
            <div className={localClasses.flexOuterContainer}>
                <div className={localClasses.toolbarRow}>
                    <ToggleButtonGroup
                        className={localClasses.toolbarRow}
                        exclusive
                        size="small"
                        value={use100PercentStackedMode}
                        onChange={handleUsePercentage}
                        color="primary"
                        aria-label="small outlined button group"
                    >
                        <ToggleButton value={false} style={{ color: appTheme.ForegroundColor }}>
                            Stacked&nbsp;mode
                        </ToggleButton>
                        <ToggleButton value={true} style={{ color: appTheme.ForegroundColor }}>
                            100%&nbsp;Stacked&nbsp;mode
                        </ToggleButton>
                    </ToggleButtonGroup>
                    
                    <ToggleButtonGroup
                        style={{ marginLeft: "auto"}}
                        className={localClasses.toolbarRow}
                        size="small"
                    >
                        <ToggleButton 
                            value={areDataLabelsVisible}
                            style={{ color: appTheme.ForegroundColor }}
                            onClick={handleToggleDataLabels}
                        >
                            {areDataLabelsVisible ? "Hide" : "Show"}&nbsp;Data&nbsp;Labels
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
                <div id={divElementId} className={localClasses.chartArea} />
            </div>
        </div>
    );
}

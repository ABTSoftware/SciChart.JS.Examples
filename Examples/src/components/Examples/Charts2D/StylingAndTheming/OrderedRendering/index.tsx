import { SciChartReact, TResolvedReturnType } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";
import { useRef, useState } from "react";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    const [order, setOrder] = useState(true);
    const setChangeOrder = useRef(null);

    const changeOrder = () => {
        setOrder((oldOrder) => {
            setChangeOrder.current(!oldOrder);
            return !oldOrder;
        });
    };

    return (
        <div className="" style={{ width: "100%", height: "100%", position: "relative" }}>
            <button
                onClick={changeOrder}
                style={{
                    position: "absolute",
                    zIndex: "100",
                    color: order ? "rgb(0, 188, 212)" : "white",
                    display: "inline-block",
                    padding: "10px 24px",
                    // margin: "5px 5px",
                    background: order ? "#163149" : "#14233c",
                    // borderRadius: "12px",
                    // fontWeight: "bold"
                }}
            >
                REVERSE ORDER OF BAND SERIES
            </button>
            <SciChartReact
                initChart={drawExample}
                className={commonClasses.ChartWrapper}
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    // get the "changeOrder" function that is returned by "drawExample"
                    let { changeOrder } = initResult;

                    // set the initial order
                    changeOrder(order);

                    // assign function to ref so we can call it later
                    setChangeOrder.current = changeOrder;
                }}
            />
        </div>
    );
}

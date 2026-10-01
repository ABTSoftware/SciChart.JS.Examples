import { SciChartReact, TResolvedReturnType } from "scichart-react";
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
        <div className="sc-chart-wrapper">
            <div className="sc-toolbar-row">
                <button type="button" onClick={changeOrder} className="sc-button">
                    Reverse band series order
                </button>
            </div>
            <SciChartReact
                initChart={drawExample}
                className="w-full h-full"
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

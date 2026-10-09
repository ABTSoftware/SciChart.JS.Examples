import { useState } from "react";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import { drawExample } from "./drawExample";
import { createPortal } from "react-dom";
import "./styles.css";

export default function ChartComponent() {
    const [chartApi, setChartApi] = useState<TResolvedReturnType<typeof drawExample>>();

    return (
        <>
            <SciChartReact
                className="sc-chart-wrapper htmlAnnotationExampleChart"
                initChart={drawExample}
                onInit={(initResult: TResolvedReturnType<typeof drawExample>) => {
                    setChartApi(initResult);
                }}
            />
            {chartApi
                ? // using a portal to render a React component within a chart
                createPortal(
                    <div
                        style={{
                            fontSize: "0.8em",
                            background: "linear-gradient(135deg, #ff6a00, #ee0979)",
                            textWrap: "nowrap",
                        }}
                    >
                        This annotation is rendered using React.
                    </div>,
                    chartApi.containerAnnotation.htmlElement
                )
                : null}
        </>
    );
}

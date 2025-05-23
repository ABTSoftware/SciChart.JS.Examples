import { useState } from "react";
import { SciChartReact, TResolvedReturnType } from "scichart-react";
import commonClasses from "../../../styles/Examples.module.scss";
import { drawExample } from "./drawExample";
import { createPortal } from "react-dom";
import "./styles.css";

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    const [chartApi, setChartApi] = useState<TResolvedReturnType<typeof drawExample>>();

    return (
        <>
            <SciChartReact
                className={`${commonClasses.ChartWrapper} htmlAnnotationExampleChart`}
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
                              fontWeight: "bold",
                              textWrap: "nowrap",
                              background: "linear-gradient(135deg, #ff6a00, #ee0979)",
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

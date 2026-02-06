import { ReactNode } from "react";
import { useSearchParams } from "react-router";
import { IInitResult, SciChartGroup } from "scichart-react";
// import { InfoToolbar } from "../Examples/Toolbar";
import { TExamplePage } from "./examplePages";
import { SciChartSurface, ESurfaceType } from "scichart";
// import { PerformanceMeasurementModifier } from "scichart-addons/PerformanceMeasurementModifier";

export default function ChartControlWrapper(props: { children: ReactNode; examplePage: TExamplePage }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const hideToolbar = searchParams.get("hideToolbar") === "true";

    return (
        <>
            <SciChartGroup
                onInit={(chartInitResults: IInitResult[]) => {
                    // capture when all charts within the group are rendered
                    // Promise.all(
                    //     chartInitResults.map(({ sciChartSurface }) => {
                    //         // only supported on 2D and 3D but on Pie surface
                    //         if (sciChartSurface instanceof SciChartSurfaceBase) {
                    //             // return sciChartSurface.nextStateRender();
                    //         }
                    //         return null;
                    //     })
                    // ).then(() => {
                    //     // consider all charts to be rendered
                    // });
                    const [firstResult] = chartInitResults;
                    const firstSurface =
                        firstResult.sciChartSurface.surfaceType === ESurfaceType.SciChartSurfaceType
                            ? (firstResult.sciChartSurface as SciChartSurface)
                            : null;
                    if (firstSurface) {
                        // firstSurface.chartModifiers.add(new PerformanceMeasurementModifier({ verbose: true }));
                    }
                }}
            >
                {/* {!hideToolbar ? <InfoToolbar examplePage={props.examplePage} /> : null} */}
                {props.children}
            </SciChartGroup>
        </>
    );
}

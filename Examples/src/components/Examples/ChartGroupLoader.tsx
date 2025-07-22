import { DetailedHTMLProps, HTMLAttributes, useState } from "react";
import { SciChartGroup, IInitResult, DefaultFallback } from "scichart-react";

type TDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

// this is the initial version of a primitive helper component for displaying a loader above the DOM subtree that contains charts.
// now it could be imported from scichart-react
const ChartGroupLoader = (props: TDivProps & { onInit?: (chartInitResults: IInitResult[]) => void }) => {
    const [isInitialized, setIsInitialized] = useState(false);

    return (
        <SciChartGroup
            onInit={(chartInitResults: IInitResult[]) => {
                props.onInit?.(chartInitResults);
                setIsInitialized(true);
            }}
        >
            <div {...props}>
                {props.children}
                {!isInitialized ? <DefaultFallback /> : null}
            </div>
        </SciChartGroup>
    );
};

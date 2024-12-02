import { DetailedHTMLProps, HTMLAttributes, useState } from "react";
import { SciChartGroup, IInitResult, DefaultFallback } from "scichart-react";

type TDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export const ChartGroupLoader = (props: TDivProps & { onInit?: (chartInitResults: IInitResult[]) => void }) => {
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

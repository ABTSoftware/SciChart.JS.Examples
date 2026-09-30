import { DetailedHTMLProps, HTMLAttributes, ReactNode, useState, JSX } from "react";
import { DefaultFallback, fallbackWrapperStyle } from "./DefaultFallback";
import { SciChartGroup } from "./SciChartGroup";
import { IInitResult } from "./types";

type TDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
type TChartGroupLoaderProps = TDivProps & {
    fallback?: ReactNode | undefined;
    onInit?: (chartInitResults: IInitResult[]) => void;
    onInitError?: (error: any) => void;
};

/** The purpose of this component is to hide UI behind a spinner until the charts within it are initialized */
export const ChartGroupLoader = (props: TChartGroupLoaderProps): JSX.Element => {
    const { fallback, onInit, onInitError, ...divProps } = props;
    const [isInitialized, setIsInitialized] = useState(false);

    return (
        <SciChartGroup
            onInit={(chartInitResults: IInitResult[]) => {
                props.onInit?.(chartInitResults);
                setIsInitialized(true);
            }}
            onInitError={onInitError}
        >
            <div {...divProps}>
                {props.children}
                {!isInitialized ? (
                    fallback ? (
                        <div style={fallbackWrapperStyle}>{fallback}</div>
                    ) : (
                        <DefaultFallback />
                    )
                ) : null}
            </div>
        </SciChartGroup>
    );
};

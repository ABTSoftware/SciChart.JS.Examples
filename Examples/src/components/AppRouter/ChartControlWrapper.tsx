import { ReactNode } from "react";
import { SciChartGroup } from "scichart-react";

export default function ChartControlWrapper({ children }: { children: ReactNode }) {
    return <SciChartGroup>{children}</SciChartGroup>;
}

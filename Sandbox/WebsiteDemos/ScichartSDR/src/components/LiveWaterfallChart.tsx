import type { ComponentProps } from "react";
import { useRadioLiveData } from "../features/receiver/hooks/useRadioLiveData";
import type { RadioLiveDataSource } from "../features/receiver/types";
import { WaterfallChart } from "./WaterfallChart";

type LiveWaterfallChartProps = Omit<
  ComponentProps<typeof WaterfallChart>,
  "spectrumDb"
> & {
  liveDataSource: RadioLiveDataSource;
};

export function LiveWaterfallChart({
  liveDataSource,
  ...props
}: LiveWaterfallChartProps) {
  const { spectrumDb } = useRadioLiveData(liveDataSource);

  return <WaterfallChart {...props} spectrumDb={spectrumDb} />;
}

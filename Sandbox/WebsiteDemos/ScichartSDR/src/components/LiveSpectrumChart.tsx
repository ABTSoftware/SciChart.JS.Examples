import type { ComponentProps } from "react";
import { useRadioLiveData } from "../features/receiver/hooks/useRadioLiveData";
import type { RadioLiveDataSource } from "../features/receiver/types";
import { SpectrumChart } from "./SpectrumChart";

type LiveSpectrumChartProps = Omit<
  ComponentProps<typeof SpectrumChart>,
  "spectrumDb"
> & {
  liveDataSource: RadioLiveDataSource;
};

export function LiveSpectrumChart({
  liveDataSource,
  ...props
}: LiveSpectrumChartProps) {
  const { spectrumDb } = useRadioLiveData(liveDataSource);

  return <SpectrumChart {...props} spectrumDb={spectrumDb} />;
}

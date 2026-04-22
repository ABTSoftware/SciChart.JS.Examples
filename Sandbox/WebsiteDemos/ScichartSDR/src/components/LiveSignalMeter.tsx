import { useRadioLiveData } from "../features/receiver/hooks/useRadioLiveData";
import type { RadioLiveDataSource } from "../features/receiver/types";
import { SignalMeter } from "./SignalMeter";

type LiveSignalMeterProps = {
  liveDataSource: RadioLiveDataSource;
  minDb: number;
  maxDb: number;
};

export function LiveSignalMeter({
  liveDataSource,
  minDb,
  maxDb,
}: LiveSignalMeterProps) {
  const { signalPeakDb } = useRadioLiveData(liveDataSource);

  return (
    <SignalMeter signalPeakDb={signalPeakDb} minDb={minDb} maxDb={maxDb} />
  );
}

import { useSyncExternalStore } from "react";
import type { RadioLiveDataSource } from "../types";

export function useRadioLiveData(source: RadioLiveDataSource) {
  return useSyncExternalStore(
    source.subscribeLiveData,
    source.getLiveDataSnapshot,
    source.getLiveDataSnapshot,
  );
}

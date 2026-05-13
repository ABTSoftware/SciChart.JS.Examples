import type { PerformanceTradeoff } from "./types";

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export function isNoDeviceSelectedError(exception: unknown): boolean {
  if (!exception || typeof exception !== "object") {
    return false;
  }
  const error = exception as { name?: string; cause?: { name?: string } };
  return (
    error.name === "RadioError.NoDeviceSelected" &&
    error.cause?.name === "NotFoundError"
  );
}

export function isTransferInterruptedError(exception: unknown): boolean {
  if (!exception || typeof exception !== "object") {
    return false;
  }
  const error = exception as { name?: string; message?: string };
  return (
    error.name === "RadioError.TransferError" ||
    error.name === "RadioError.UsbTransferError" ||
    (typeof error.message === "string" &&
      error.message.includes("Sample transfer was interrupted"))
  );
}

export function isUsbDisconnectError(exception: unknown): boolean {
  if (!exception || typeof exception !== "object") {
    return false;
  }
  const error = exception as {
    name?: string;
    message?: string;
    cause?: unknown;
  };
  if (error.name === "NetworkError" || error.name === "NotFoundError")
    return true;
  if (typeof error.message === "string") {
    const msg = error.message;
    if (
      msg.includes("Error code: 5") ||
      msg === "NetworkError" ||
      msg.includes("device disconnected") ||
      msg.includes("not found")
    ) {
      return true;
    }
  }
  if (error.cause) return isUsbDisconnectError(error.cause);
  return false;
}

export function getRadioErrorMessage(exception: unknown): string {
  if (!exception || typeof exception !== "object") {
    return String(exception);
  }
  const error = exception as {
    name?: string;
    message?: string;
    cause?: unknown;
  };
  if (error.name === "RadioError.NoUsbSupport") {
    return "This browser does not support WebUSB. Use Chrome, Edge, or Opera on desktop or Android.";
  }
  if (isUsbDisconnectError(exception)) {
    return "USB device disconnected.";
  }
  if (typeof error.message === "string" && error.message.length > 0) {
    return error.message;
  }
  return String(error.cause ?? exception);
}

export function getDemodModeOptions(
  performanceTradeoff: PerformanceTradeoff,
  fmDeemph: number
): Record<string, object> {
  const latency = performanceTradeoff === "latency";
  const quality = performanceTradeoff === "quality";
  return {
    AM: {
      downsamplerTaps: quality ? 75 : undefined,
      rfTaps: latency ? 257 : quality ? 75 : undefined,
      useFftFilter: latency,
    },
    CW: {
      downsamplerTaps: quality ? 75 : undefined,
      audioTaps: latency ? 513 : quality ? 95 : undefined,
      useFftFilter: latency,
    },
    NBFM: {
      downsamplerTaps: quality ? 75 : undefined,
      rfTaps: latency ? 257 : quality ? 41 : undefined,
      useFftFilter: latency,
    },
    USB: {
      downsamplerTaps: quality ? 75 : undefined,
      rfTaps: latency ? 257 : quality ? 41 : undefined,
      useFftFilter: latency,
    },
    LSB: {
      downsamplerTaps: quality ? 75 : undefined,
      rfTaps: latency ? 257 : quality ? 75 : undefined,
      useFftFilter: latency,
    },
    WBFM: {
      deemphasizerTc: fmDeemph,
      downsamplerTaps: quality ? 75 : undefined,
      rfTaps: latency ? 75 : quality ? 75 : undefined,
      useFftFilter: latency,
    },
  };
}

export function sideBandsForMode(
  scheme: string,
  bandwidthHz: number
): { leftBandHz: number; rightBandHz: number } {
  if (scheme === "USB") {
    return { leftBandHz: 0, rightBandHz: bandwidthHz };
  }
  if (scheme === "LSB") {
    return { leftBandHz: bandwidthHz, rightBandHz: 0 };
  }
  return { leftBandHz: bandwidthHz / 2, rightBandHz: bandwidthHz / 2 };
}

export function reconcileFrequency(
  centerHz: number,
  tunedHz: number,
  sampleRate: number,
  leftBandHz: number,
  rightBandHz: number
): { centerHz: number; tunedHz: number } {
  const safeCenter = Math.max(100_000, Math.round(centerHz));
  const safeTuned = Math.max(100_000, Math.round(tunedHz));
  const halfSampleRate = sampleRate / 2;

  const minTuned = safeCenter - halfSampleRate + leftBandHz;
  const maxTuned = safeCenter + halfSampleRate - rightBandHz;
  if (minTuned <= maxTuned && safeTuned >= minTuned && safeTuned <= maxTuned) {
    return { centerHz: safeCenter, tunedHz: safeTuned };
  }

  // Match upstream behavior: if offset would be out of range, retune center to tuned.
  const recentered = safeTuned;
  const minAfterRecenter = recentered - halfSampleRate + leftBandHz;
  const maxAfterRecenter = recentered + halfSampleRate - rightBandHz;
  if (minAfterRecenter > maxAfterRecenter) {
    return { centerHz: recentered, tunedHz: recentered };
  }
  return {
    centerHz: recentered,
    tunedHz: clamp(safeTuned, minAfterRecenter, maxAfterRecenter),
  };
}

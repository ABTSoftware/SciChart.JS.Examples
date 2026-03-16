import { useCallback, useEffect, useRef, useState } from "react";

type WakeLockSentinelLike = {
  released: boolean;
  release: () => Promise<void>;
  addEventListener?: (type: "release", listener: () => void) => void;
  removeEventListener?: (type: "release", listener: () => void) => void;
};

type NavigatorWithWakeLock = Navigator & {
  wakeLock?: {
    request: (type: "screen") => Promise<WakeLockSentinelLike>;
  };
};

function getWakeLockApi() {
  if (typeof navigator === "undefined") {
    return undefined;
  }
  return (navigator as NavigatorWithWakeLock).wakeLock;
}

export function useScreenWakeLock(enabled: boolean) {
  const [active, setActive] = useState(false);
  const sentinelRef = useRef<WakeLockSentinelLike | null>(null);
  const releaseListenerRef = useRef<(() => void) | null>(null);
  const enabledRef = useRef(enabled);

  const supported = typeof getWakeLockApi()?.request === "function";

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  const detachReleaseListener = useCallback((sentinel: WakeLockSentinelLike | null) => {
    const listener = releaseListenerRef.current;
    if (!listener || !sentinel) {
      return;
    }
    sentinel.removeEventListener?.("release", listener);
    releaseListenerRef.current = null;
  }, []);

  const releaseWakeLock = useCallback(async () => {
    const sentinel = sentinelRef.current;
    sentinelRef.current = null;
    detachReleaseListener(sentinel);
    if (!sentinel || sentinel.released) {
      setActive(false);
      return;
    }
    try {
      await sentinel.release();
    } catch {
      // Ignore release failures during teardown.
    }
    setActive(false);
  }, [detachReleaseListener]);

  const requestWakeLock = useCallback(async () => {
    const wakeLock = getWakeLockApi();
    if (
      !wakeLock ||
      !enabledRef.current ||
      typeof document === "undefined" ||
      document.visibilityState !== "visible"
    ) {
      return;
    }

    const currentSentinel = sentinelRef.current;
    if (currentSentinel && !currentSentinel.released) {
      setActive(true);
      return;
    }

    try {
      const sentinel = await wakeLock.request("screen");
      if (!enabledRef.current) {
        if (!sentinel.released) {
          await sentinel.release();
        }
        return;
      }

      detachReleaseListener(sentinelRef.current);
      sentinelRef.current = sentinel;
      setActive(!sentinel.released);

      const handleRelease = () => {
        if (sentinelRef.current === sentinel) {
          sentinelRef.current = null;
        }
        setActive(false);
      };

      releaseListenerRef.current = handleRelease;
      sentinel.addEventListener?.("release", handleRelease);
    } catch {
      setActive(false);
    }
  }, [detachReleaseListener]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const requestTimer = window.setTimeout(() => {
      void requestWakeLock();
    }, 0);

    if (typeof document === "undefined") {
      window.clearTimeout(requestTimer);
      return;
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void requestWakeLock();
        return;
      }
      void releaseWakeLock();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.clearTimeout(requestTimer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      void releaseWakeLock();
    };
  }, [enabled, releaseWakeLock, requestWakeLock]);

  return {
    active,
    supported,
  };
}

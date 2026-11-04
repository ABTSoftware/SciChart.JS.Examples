import { useCallback, useSyncExternalStore } from "react";

export function useMediaQuery(query: string) {
    const subscribe = useCallback(
        (notify: () => void) => {
            const media = window.matchMedia(query);
            media.addEventListener("change", notify);
            return () => media.removeEventListener("change", notify);
        },
        [query]
    );
    return useSyncExternalStore(
        subscribe,
        () => window.matchMedia(query).matches,
        () => false
    );
}

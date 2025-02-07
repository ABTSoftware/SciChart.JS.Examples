import { useState, useCallback, MutableRefObject } from "react";
import { useIsomorphicLayoutEffect } from "../../helpers/hooks/useIsomorphicLayoutEffect";

export const useMeasure = (ref: MutableRefObject<HTMLElement>) => {
    const [bounds, setBounds] = useState<{ width: number; height: number }>(undefined);

    const measure = useCallback(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setBounds({ width: rect.width, height: rect.height });
        }
    }, []);

    useIsomorphicLayoutEffect(() => {
        if (!ref.current) return undefined;

        const resizeObserver = new ResizeObserver(() => measure());
        resizeObserver.observe(ref.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, [measure]);

    return bounds;
};

// TODO probably rename
export const useViewType = (ref: MutableRefObject<HTMLElement>) => {
    const bounds = useMeasure(ref);

    if (bounds) {
        const isLargeView = bounds.width > 1200;
        const isMobileView = bounds.width < 600;

        return { isLargeView, isMobileView };
    }

    return null;
};

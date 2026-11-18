import { useEffect } from "react";

/**
 * While `active`, anything that would lose the visitor's draft asks first: closing or reloading the tab, and
 * following a link to another page of the site. `onBlocked` receives the destination of a blocked link.
 * (The browser's back button cannot be intercepted by the router in use; the draft is lost there.)
 */
export const useDraftGuard = (active: boolean, onBlocked: (href: string) => void) => {
    useEffect(() => {
        if (!active) return undefined;
        const beforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = "";
        };
        const onClick = (event: MouseEvent) => {
            if (
                event.defaultPrevented ||
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
            )
                return;
            const link = (event.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
            if (!link || (link.target && link.target !== "_self") || link.hasAttribute("download")) return;
            const url = new URL(link.href, window.location.href);
            const here = window.location;
            if (url.origin !== here.origin || (url.pathname === here.pathname && url.search === here.search)) return;
            event.preventDefault();
            event.stopPropagation();
            onBlocked(url.pathname + url.search + url.hash);
        };
        window.addEventListener("beforeunload", beforeUnload);
        // Capture phase: runs before the router's own link handler.
        document.addEventListener("click", onClick, true);
        return () => {
            window.removeEventListener("beforeunload", beforeUnload);
            document.removeEventListener("click", onClick, true);
        };
    }, [active, onBlocked]);
};

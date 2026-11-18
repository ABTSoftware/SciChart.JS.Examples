import { createContext, useCallback, useContext } from "react";
import { useNavigate, type NavigateOptions, type To } from "react-router";

export type DraftGuard = {
    /** True while a draft exists and leaving the page would lose it. */
    active: boolean;
    /** Asks the visitor first; `proceed` runs only if they confirm. */
    ask: (proceed: () => void) => void;
};

export const DraftGuardContext = createContext<DraftGuard | null>(null);

/** `useNavigate` that asks before leaving a page with an unsaved draft. Without a guard it is `useNavigate`. */
export const useGuardedNavigate = () => {
    const navigate = useNavigate();
    const guard = useContext(DraftGuardContext);
    return useCallback(
        (to: To, options?: NavigateOptions) => {
            if (guard?.active) guard.ask(() => navigate(to, options));
            else navigate(to, options);
        },
        [navigate, guard]
    );
};

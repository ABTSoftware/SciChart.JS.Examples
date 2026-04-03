"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
    IThemeProvider,
    ISciChartSurfaceBase,
    SciChart3DSurface,
    SciChartJSDarkv2Theme,
    SciChartJSLightTheme,
    SciChartJsNavyTheme,
    SciChartPieSurface,
    SciChartPolarSubSurface,
    SciChartPolarSurface,
    SciChartSubSurface,
    SciChartSurface,
    SciChartSurfaceBase,
} from "scichart";
import { ETheme } from "../../types/types";
import type { EPageFramework } from "./frameworkParametrization";

export type StateType = {
    framework: EPageFramework;
    theme: ETheme;
};

type TStateContextValue = {
    state: StateType;
    setState: React.Dispatch<React.SetStateAction<StateType>>;
    setFramework: (framework: EPageFramework) => void;
    setTheme: (theme: ETheme) => void;
    toggleTheme: () => void;
    getNextTheme: (currentTheme?: ETheme) => ETheme;
    getThemedImageCandidates: (imagePath: string) => string[];
    getThemedImagePath: (imagePath: string) => string;
};

const APP_THEME_STORAGE_KEY = "scichart-demo-theme";
const APP_THEME_ORDER = [ETheme.navy, ETheme.light, ETheme.dark] as const;

const surfaceRegistrars = new Set<(surface: ISciChartSurfaceBase) => void>();
let activePatchedTheme: ETheme = ETheme.navy;
let createMethodsPatched = false;

const StateContext = createContext<TStateContextValue | null>(null);

const isValidTheme = (theme: string | null): theme is ETheme =>
    theme !== null && Object.values(ETheme).includes(theme as ETheme);

const getInitialTheme = (): ETheme => {
    if (typeof window === "undefined") {
        return ETheme.navy;
    }

    let savedTheme: string | null = null;
    try {
        savedTheme = window.localStorage.getItem(APP_THEME_STORAGE_KEY);
    } catch {
        // Ignore localStorage access issues (e.g. privacy mode) and fall back below.
    }
    if (isValidTheme(savedTheme)) {
        return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: light)").matches ? ETheme.light : ETheme.navy;
};

const getNextThemeInternal = (currentTheme: ETheme): ETheme => {
    const currentIndex = APP_THEME_ORDER.indexOf(currentTheme);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % APP_THEME_ORDER.length;
    return APP_THEME_ORDER[nextIndex];
};

const resolveSciChartTheme = (theme: ETheme): IThemeProvider => {
    switch (theme) {
        case ETheme.light:
            return new SciChartJSLightTheme();
        case ETheme.dark:
            return new SciChartJSDarkv2Theme();
        case ETheme.navy:
        default:
            return new SciChartJsNavyTheme();
    }
};

if (typeof window !== "undefined") {
    // Ensure create() patch uses the persisted theme even before React effects run.
    activePatchedTheme = getInitialTheme();
    SciChartSurfaceBase.DEFAULT_THEME = resolveSciChartTheme(activePatchedTheme);
}

const ensureThemeColorMeta = () => {
    const existingMeta = document.querySelector('meta[name="theme-color"]');
    if (existingMeta) {
        return existingMeta;
    }
    const meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    document.head.appendChild(meta);
    return meta;
};

const applyThemeToDocument = (theme: ETheme) => {
    if (typeof document === "undefined") return;

    document.documentElement.setAttribute("data-theme", theme);
    const computedStyles = getComputedStyle(document.documentElement);
    const themeColor = computedStyles.getPropertyValue("--bg").trim();
    ensureThemeColorMeta().setAttribute("content", themeColor);
};

type TThemeCssColors = {
    foreground: string;
    background: string;
};

const getThemeCssColors = (): TThemeCssColors => {
    if (typeof document === "undefined") {
        return {
            foreground: "#FFFFFF",
            background: "#101028",
        };
    }

    const computedStyles = getComputedStyle(document.documentElement);
    const foreground = computedStyles.getPropertyValue("--text").trim() || "#FFFFFF";
    const background =
        computedStyles.getPropertyValue("--bg-chart").trim() ||
        computedStyles.getPropertyValue("--bg").trim() ||
        "#101028";

    return { foreground, background };
};

const collectRenderableSeries = (seriesLike: unknown, collected: Set<Record<string, unknown>>) => {
    if (!seriesLike || typeof seriesLike !== "object") {
        return;
    }

    const asRecord = seriesLike as Record<string, unknown>;
    collected.add(asRecord);

    const maybeCollection = asRecord as { asArray?: () => unknown[] };
    if (typeof maybeCollection.asArray !== "function") {
        return;
    }

    const nestedSeries = maybeCollection.asArray();
    if (!Array.isArray(nestedSeries)) {
        return;
    }

    nestedSeries.forEach((nested) => collectRenderableSeries(nested, collected));
};

const syncSurfaceSeriesThemeColors = (
    surface: ISciChartSurfaceBase,
    previousColors: TThemeCssColors,
    nextColors: TThemeCssColors
) => {
    const withRenderableSeries = surface as unknown as { renderableSeries?: { asArray?: () => unknown[] } };
    if (!withRenderableSeries.renderableSeries || typeof withRenderableSeries.renderableSeries.asArray !== "function") {
        return;
    }

    const topLevelSeries = withRenderableSeries.renderableSeries.asArray();
    if (!Array.isArray(topLevelSeries)) {
        return;
    }

    const allSeries = new Set<Record<string, unknown>>();
    topLevelSeries.forEach((series) => collectRenderableSeries(series, allSeries));

    allSeries.forEach((series) => {
        const dataLabelProvider = series.dataLabelProvider as { color?: string } | undefined;
        if (dataLabelProvider && dataLabelProvider.color === previousColors.foreground) {
            dataLabelProvider.color = nextColors.foreground;
        }

        if (typeof series.stroke === "string") {
            if (series.stroke === previousColors.background) {
                series.stroke = nextColors.background;
            } else if (series.stroke === previousColors.foreground) {
                series.stroke = nextColors.foreground;
            }
        }
    });
};

const invalidateSurface = (surface: ISciChartSurfaceBase) => {
    const asInvalidatable = surface as unknown as {
        invalidateElement?: () => void;
        invalidateParentCallback?: () => void;
    };

    if (typeof asInvalidatable.invalidateElement === "function") {
        asInvalidatable.invalidateElement();
        return;
    }

    if (typeof asInvalidatable.invalidateParentCallback === "function") {
        asInvalidatable.invalidateParentCallback();
    }
};

const isSciChartSurfaceLike = (value: unknown): value is ISciChartSurfaceBase => {
    return (
        !!value &&
        typeof value === "object" &&
        typeof (value as ISciChartSurfaceBase).applyTheme === "function" &&
        typeof (value as ISciChartSurfaceBase).delete === "function"
    );
};

const getSurfaceFromCreateResult = (result: unknown): ISciChartSurfaceBase | undefined => {
    if (isSciChartSurfaceLike(result)) {
        return result;
    }

    if (!result || typeof result !== "object") {
        return undefined;
    }

    const asRecord = result as Record<string, unknown>;
    const keyedCandidates = [
        asRecord.sciChartSurface,
        asRecord.sciChart3DSurface,
        asRecord.sciChartPolarSurface,
        asRecord.sciChartPieSurface,
    ];

    const keyedSurface = keyedCandidates.find((candidate) => isSciChartSurfaceLike(candidate));
    if (keyedSurface) {
        return keyedSurface;
    }

    const firstSurfaceValue = Object.values(asRecord).find((value) => isSciChartSurfaceLike(value));
    return firstSurfaceValue as ISciChartSurfaceBase | undefined;
};

const shouldBypassGlobalThemeOverrideForCurrentRoute = (): boolean => {
    if (typeof window === "undefined") {
        return false;
    }

    // Keep UsingThemeManager demo fully self-themed (4 tiles with independent themes).
    return /\/chart-themes(?:\/|$)/.test(window.location.pathname);
};

const getPatchedCreateInvocation = (
    args: unknown[]
): {
    patchedArgs: unknown[];
    shouldApplyAppTheme: boolean;
} => {
    const [rootElement, options, ...rest] = args;
    if (shouldBypassGlobalThemeOverrideForCurrentRoute()) {
        return {
            patchedArgs: args,
            shouldApplyAppTheme: false,
        };
    }

    const nextOptions =
        options && typeof options === "object"
            ? { ...(options as Record<string, unknown>), theme: resolveSciChartTheme(activePatchedTheme) }
            : { theme: resolveSciChartTheme(activePatchedTheme) };

    return {
        patchedArgs: [rootElement, nextOptions, ...rest],
        shouldApplyAppTheme: true,
    };
};

const patchCreateMethod = (owner: Record<string, unknown>, methodName: string) => {
    const original = owner[methodName];
    if (typeof original !== "function") {
        return;
    }

    const originalFn = original as (...args: unknown[]) => unknown;
    const patchedFn = (...args: unknown[]) => {
        const { patchedArgs, shouldApplyAppTheme } = getPatchedCreateInvocation(args);
        const result = originalFn.apply(owner, patchedArgs);

        const registerSurfaceFromResult = (createResult: unknown) => {
            const surface = getSurfaceFromCreateResult(createResult);
            if (surface && shouldApplyAppTheme) {
                surfaceRegistrars.forEach((registerSurface) => registerSurface(surface));
            }
        };

        const isPromiseLike = (value: unknown): value is Promise<unknown> =>
            !!value && typeof (value as { then?: unknown }).then === "function";

        if (isPromiseLike(result)) {
            return result.then((resolvedResult: unknown) => {
                registerSurfaceFromResult(resolvedResult);
                return resolvedResult;
            });
        }

        registerSurfaceFromResult(result);
        return result;
    };

    owner[methodName] = patchedFn;
};

const patchSciChartCreateMethodsOnce = () => {
    if (createMethodsPatched) return;
    createMethodsPatched = true;

    patchCreateMethod(SciChartSurface as unknown as Record<string, unknown>, "create");
    patchCreateMethod(SciChartSurface as unknown as Record<string, unknown>, "createSingle");
    patchCreateMethod(SciChart3DSurface as unknown as Record<string, unknown>, "create");
    patchCreateMethod(SciChart3DSurface as unknown as Record<string, unknown>, "createSingle");
    patchCreateMethod(SciChartPolarSurface as unknown as Record<string, unknown>, "create");
    patchCreateMethod(SciChartPolarSurface as unknown as Record<string, unknown>, "createSingle");
    patchCreateMethod(SciChartPieSurface as unknown as Record<string, unknown>, "create");
    patchCreateMethod(SciChartSubSurface as unknown as Record<string, unknown>, "createSubSurface");
    patchCreateMethod(SciChartPolarSubSurface as unknown as Record<string, unknown>, "createSubSurface");
};

patchSciChartCreateMethodsOnce();

const getImageBaseAndExtension = (imagePath: string): { base: string; extension: string; query: string } | null => {
    const match = imagePath.match(/^(.+?)(\.[a-zA-Z0-9]+)(\?.*)?$/);
    if (!match) return null;

    return {
        base: match[1],
        extension: match[2],
        query: match[3] ?? "",
    };
};

export function StateProvider({
    children,
    framework,
}: {
    children: React.ReactNode;
    framework: EPageFramework;
}) {
    const [state, setState] = useState<StateType>(() => ({
        framework,
        theme: getInitialTheme(),
    }));

    const themeRef = useRef(state.theme);
    const themeCssColorsRef = useRef<TThemeCssColors>(getThemeCssColors());
    const surfacesRef = useRef<Set<ISciChartSurfaceBase>>(new Set());
    const patchedDeletesRef = useRef<WeakSet<ISciChartSurfaceBase>>(new WeakSet());

    const setTheme = useCallback((nextTheme: ETheme) => {
        setState((prevState) => (prevState.theme === nextTheme ? prevState : { ...prevState, theme: nextTheme }));
    }, []);

    const toggleTheme = useCallback(() => {
        setState((prevState) => ({ ...prevState, theme: getNextThemeInternal(prevState.theme) }));
    }, []);

    const getNextTheme = useCallback((currentTheme?: ETheme) => {
        return getNextThemeInternal(currentTheme ?? themeRef.current);
    }, []);

    const setFramework = useCallback((nextFramework: EPageFramework) => {
        setState((prevState) =>
            prevState.framework === nextFramework ? prevState : { ...prevState, framework: nextFramework }
        );
    }, []);

    const registerSurface = useCallback((surface: ISciChartSurfaceBase) => {
        if (!surface || surface.isDeleted) return;
        if (surfacesRef.current.has(surface)) return;

        surfacesRef.current.add(surface);

        if (!patchedDeletesRef.current.has(surface)) {
            const originalDelete = surface.delete.bind(surface) as (...args: unknown[]) => void;
            (surface as unknown as { delete: (...args: unknown[]) => void }).delete = (...args: unknown[]) => {
                surfacesRef.current.delete(surface);
                originalDelete(...args);
            };
            patchedDeletesRef.current.add(surface);
        }

        try {
            surface.applyTheme(resolveSciChartTheme(themeRef.current));
        } catch (error) {
            console.warn("Unable to apply theme to SciChart surface", error);
        }
    }, []);

    const getThemedImageCandidates = useCallback(
        (imagePath: string): string[] => {
            const parsedPath = getImageBaseAndExtension(imagePath);
            if (!parsedPath) return [imagePath];

            const { base, extension, query } = parsedPath;
            const suffix = themeRef.current;
            const themedCandidates = [
                `${base}-${suffix}${extension}${query}`,
                `${base}.${suffix}${extension}${query}`,
                `${base}_${suffix}${extension}${query}`,
            ];

            const orderedCandidates =
                suffix === ETheme.navy ? [imagePath, ...themedCandidates] : [...themedCandidates, imagePath];

            return Array.from(new Set(orderedCandidates));
        },
        []
    );

    const getThemedImagePath = useCallback(
        (imagePath: string): string => {
            const candidates = getThemedImageCandidates(imagePath);
            return candidates[0] ?? imagePath;
        },
        [getThemedImageCandidates]
    );

    useEffect(() => {
        surfaceRegistrars.add(registerSurface);
        return () => {
            surfaceRegistrars.delete(registerSurface);
        };
    }, [registerSurface]);

    useEffect(() => {
        if (state.framework !== framework) {
            setFramework(framework);
        }
    }, [framework, setFramework, state.framework]);

    useEffect(() => {
        const theme = state.theme;
        const previousThemeCssColors = themeCssColorsRef.current;
        themeRef.current = theme;
        activePatchedTheme = theme;

        if (typeof window !== "undefined") {
            window.localStorage.setItem(APP_THEME_STORAGE_KEY, theme);
        }

        applyThemeToDocument(theme);
        const nextThemeCssColors = getThemeCssColors();
        themeCssColorsRef.current = nextThemeCssColors;
        SciChartSurfaceBase.DEFAULT_THEME = resolveSciChartTheme(theme);

        surfacesRef.current.forEach((surface) => {
            if (surface.isDeleted) {
                surfacesRef.current.delete(surface);
                return;
            }

            try {
                surface.applyTheme(resolveSciChartTheme(theme));
                syncSurfaceSeriesThemeColors(surface, previousThemeCssColors, nextThemeCssColors);
                invalidateSurface(surface);
            } catch (error) {
                console.warn("Unable to re-apply theme to SciChart surface", error);
            }
        });
    }, [state.theme]);

    const contextValue = useMemo<TStateContextValue>(
        () => ({
            state,
            setState,
            setFramework,
            setTheme,
            toggleTheme,
            getNextTheme,
            getThemedImageCandidates,
            getThemedImagePath,
        }),
        [state, setFramework, setTheme, toggleTheme, getNextTheme, getThemedImageCandidates, getThemedImagePath]
    );

    return <StateContext.Provider value={contextValue}>{children}</StateContext.Provider>;
}

export function _useContext() {
    const ctx = useContext(StateContext);
    if (!ctx) throw new Error("_useContext must be used within a StateProvider");
    return ctx;
}

export const useAppContext = _useContext;

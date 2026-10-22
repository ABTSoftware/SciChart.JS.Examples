import { ComponentType, createElement, lazy, Suspense } from "react";
import { EXAMPLES_PAGES } from "./examplePages";

declare const require: any;
// Production stays synchronous for renderToString/hydration and sandbox exports.
const componentsContext = __SCICHART_LAZY_EXAMPLES__
    ? (componentPath: string) => import(`../Examples/${componentPath.slice(2, -10)}/index.tsx`)
    : require.context("../Examples", true, /index\.(js|jsx|ts|tsx)$/, "sync");
const components = new Map<string, ComponentType>();

export const getExampleComponent = (exampleId: string): ComponentType => {
    const info = EXAMPLES_PAGES[exampleId];
    if (!info) throw new Error("cannot find example " + exampleId);
    const componentPath = "./" + info.exampleDirectory.replace(/^(\.\.\/)+Examples\//, "") + "/index.tsx";
    const select = (mod: Record<string, ComponentType>) => {
        const component = mod[info.reactComponent] || mod.default;
        if (!component) throw new Error(`Component ${info.reactComponent} not found in module ${componentPath}`);
        return component;
    };
    if (!__SCICHART_LAZY_EXAMPLES__) return select(componentsContext(componentPath));
    if (!components.has(exampleId)) {
        const Chart = lazy(() =>
            componentsContext(componentPath).then((mod: Record<string, ComponentType>) => ({
                default: select(mod),
            }))
        );
        // Cache the wrapper too: a new type on each render would destroy and recreate the chart.
        components.set(exampleId, function ExampleChart() {
            return createElement(
                Suspense,
                { fallback: null },
                createElement(Chart)
            );
        });
    }
    return components.get(exampleId);
};

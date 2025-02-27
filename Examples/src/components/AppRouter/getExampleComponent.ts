import { EXAMPLES_PAGES } from "./examplePages";
import { JSX } from "react";

// Create a webpack context matching any index file in any subdirectory of Examples.
declare var require: any;
const componentsContext = require.context("../Examples", true, /index\.(js|jsx|ts|tsx)$/);

// Convert a module path to the key expected by the context.
const loadModule = (modulePath: string) => {
    const relativePath = "./" + modulePath.replace(/^(\.\.\/)+Examples\//, "");
    return componentsContext(relativePath);
};

export const getExampleComponent = (exampleId: string): (() => JSX.Element) => {
    const exampleInfo = EXAMPLES_PAGES[exampleId];
    if (!exampleInfo) {
        throw new Error("cannot fine example " + exampleId);
    }
    const filePath = exampleInfo.exampleDirectory;
    const componentPath = filePath + "/index.tsx";
    const mod = loadModule(componentPath);
    const componentName = exampleInfo.reactComponent;
    const component = mod[componentName] || mod.default;
    if (!component) {
        throw new Error(`Component ${componentName} not found in module ${componentPath}`);
    }
    console.log("dyname getExampleComponent exampeId=", exampleId);
    return component;
};

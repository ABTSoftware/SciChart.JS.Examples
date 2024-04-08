import { useMatch } from "react-router-dom";
import { EXAMPLES_PAGES } from "../../../components/AppRouter/examplePages";

export enum EPageFramework {
    Vanilla = "javascript",
    React = "react",
    Angular = "angular",
    Vue = "vue",
}

export const FRAMEWORK_NAME = {
    [EPageFramework.Vanilla]: "JavaScript",
    [EPageFramework.React]: "React",
    [EPageFramework.Angular]: "Angular",
    [EPageFramework.Vue]: "Vue",
} as const;

export type TPathTemplate = string | ((framework: EPageFramework) => string);
export type TFrameworkName = "JavaScript" | "Angular" | "React" | "Vue";
export type TTitleTemplate = string | ((framework: TFrameworkName) => string);
export type TDescriptionTemplate = string | ((framework: TFrameworkName) => string);

export const getTitle = (title: TTitleTemplate, framework: EPageFramework) => {
    return typeof title === "string" ? title : title(FRAMEWORK_NAME[framework]);
};

const isValidFramework = (framework: string | EPageFramework) =>
    Object.values(EPageFramework).includes(framework as EPageFramework);

// TODO refactor
const getExamplePageKey = (framework: string | EPageFramework, examplePath: string) => {
    return Object.keys(EXAMPLES_PAGES).find((key) => {
        const pagePath = EXAMPLES_PAGES[key].path;
        const oldFormat = `javascript-${pagePath}`;
        return pagePath === examplePath || oldFormat === examplePath;
    });
};

export const useExampleRouteParams = () => {
    let framework: EPageFramework;
    let examplePageKey: string;
    let isHomePage = false;

    const matchIframeRoute = useMatch("/iframe/:example");
    const matchWithFrameworkAndExample = useMatch("/:framework/:example");
    const matchWithOneParam = useMatch("/:exampleOrFramework");
    const matchHome = useMatch("/");

    if (matchIframeRoute) {
        examplePageKey = getExamplePageKey(EPageFramework.Vanilla, matchIframeRoute.params.example);
        const currentExample = EXAMPLES_PAGES[examplePageKey];
        return { isIFrame: true, isHomePage: false, framework: EPageFramework.Vanilla, currentExample };
    }

    if (matchWithFrameworkAndExample) {
        if (isValidFramework(matchWithFrameworkAndExample.params.framework)) {
            framework = matchWithFrameworkAndExample.params.framework as EPageFramework;
            examplePageKey = getExamplePageKey(framework, matchWithFrameworkAndExample.params.example);
        }
    } else if (matchWithOneParam) {
        if (isValidFramework(matchWithOneParam.params.exampleOrFramework)) {
            framework = matchWithOneParam.params.exampleOrFramework as EPageFramework;
            isHomePage = true;
        } else {
            examplePageKey = getExamplePageKey(EPageFramework.Vanilla, matchWithOneParam.params.exampleOrFramework);
            framework = EPageFramework.Vanilla;
        }
    } else if (matchHome) {
        framework = EPageFramework.Vanilla;
        isHomePage = true;
    }

    const currentExample = EXAMPLES_PAGES[examplePageKey];

    return { isIFrame: false, isHomePage, framework, currentExample };
};

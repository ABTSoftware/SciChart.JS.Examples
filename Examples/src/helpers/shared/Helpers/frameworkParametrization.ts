import { useMatch } from "react-router";
import { EXAMPLES_PAGES } from "../../../components/AppRouter/examplePages";

export enum EPageFramework {
    Vanilla = "javascript",
    React = "react",
    Angular = "angular",
    // Vue = "vue",
}

export enum EPlatform {
    CodeSandbox = "codesandbox",
    StackBlitz = "stackblitz",
}

export const FRAMEWORK_NAME = {
    [EPageFramework.Vanilla]: "JavaScript",
    [EPageFramework.React]: "React",
    [EPageFramework.Angular]: "Angular",
    // [EPageFramework.Vue]: "Vue",
} as const;

export const getFrameworkName = (frameWork: EPageFramework) => FRAMEWORK_NAME[frameWork];

const DEFAULT_FRAMEWORK = EPageFramework.React;

export type TPathTemplate = string | ((framework: EPageFramework) => string);
export type TFrameworkName = "JavaScript" | "Angular" | "React" | "Vue";
export type TFrameworkTemplate = string | ((framework: TFrameworkName) => string);

export const getFrameworkContent = (content: TFrameworkTemplate, framework: EPageFramework) => {
    if (!content) return "";
    return typeof content === "string" ? content : content(FRAMEWORK_NAME[framework]);
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
    let is404 = false;

    const matchIframeRoute = useMatch("/iframe/:example");
    const matchWithFrameworkAndExample = useMatch("/:framework/:example");
    const matchWithOneParam = useMatch("/:exampleOrFramework");
    const matchHome = useMatch("/");

    if (matchIframeRoute) {
        examplePageKey = getExamplePageKey(EPageFramework.Vanilla, matchIframeRoute.params.example);
        const currentExample = EXAMPLES_PAGES[examplePageKey];
        if (!currentExample) {
            is404 = true;
        }
        return { isIFrame: true, isHomePage: false, framework: EPageFramework.Vanilla, currentExample, is404 };
    }

    if (matchWithFrameworkAndExample) {
        if (isValidFramework(matchWithFrameworkAndExample.params.framework)) {
            framework = matchWithFrameworkAndExample.params.framework as EPageFramework;
            examplePageKey = getExamplePageKey(framework, matchWithFrameworkAndExample.params.example);
            if(!examplePageKey) {
                is404 = true;
            }
        } else {
            is404 = true;
            framework = DEFAULT_FRAMEWORK;
        }
    } else if (matchWithOneParam) {
        if (isValidFramework(matchWithOneParam.params.exampleOrFramework)) {
            framework = matchWithOneParam.params.exampleOrFramework as EPageFramework;
            isHomePage = true;
        } else {
            examplePageKey = getExamplePageKey(EPageFramework.Vanilla, matchWithOneParam.params.exampleOrFramework);
            if (!examplePageKey) {
                is404 = true;
            }
            framework = DEFAULT_FRAMEWORK;
        }
    } else if (matchHome) {
        isHomePage = true;
        framework = DEFAULT_FRAMEWORK;
    } else {
        is404 = true;
        framework = DEFAULT_FRAMEWORK;
    }

    const currentExample = EXAMPLES_PAGES[examplePageKey];

    return { isIFrame: false, isHomePage, framework, currentExample, is404 };
};

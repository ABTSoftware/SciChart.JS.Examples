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

export type TPage = {
    id: string;
    title: TTitleTemplate;
    path: string;
};

export const PAGES: Record<string, TPage> = {
    homapage: {
        id: "homepage",
        title: "Homepage",
        path: `/`,
    },
};

export enum EPageFramework {
    Vanilla = "javascript",
    React = "react",
    Angular = "angular",
    Vue = "vue",
}

export type TPathTemplate = (framework: EPageFramework) => string;

export type TPage = {
    id: string;
    title: string;
    path: TPathTemplate;
};

export const PAGES: Record<string, TPage> = {
    homapage: {
        id: "homepage",
        title: "Homepage",
        path: (framework: EPageFramework) => `/${framework}`,
    },
};

import { TTitleTemplate } from "../../helpers/shared/Helpers/frameworkParametrization";

export type TPage = {
    id: string;
    title: TTitleTemplate;
    path: string;
};

export const PAGES: Record<string, TPage> = {
    reactHome: {
        id: "reactHome",
        title: "Homepage",
        path: `/react`,
    },
    jsHome: {
        id: "jsHome",
        title: "Homepage",
        path: `/javascript`,
    },
};

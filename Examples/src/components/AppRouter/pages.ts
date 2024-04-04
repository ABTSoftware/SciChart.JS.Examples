import { TTitleTemplate } from "../../helpers/shared/Helpers/frameworkParametrization";

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

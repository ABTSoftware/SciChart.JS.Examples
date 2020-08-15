export type TPage = {
    id: string;
    title: string;
    path: string;
};

export const PAGES: Record<string, TPage> = {
    homapage: {
        id: "homepage",
        title: "Homepage",
        path: "/"
    }
};

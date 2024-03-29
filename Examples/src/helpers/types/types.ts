import { TPathTemplate } from "../../components/AppRouter/pages";

export type GalleryItem = {
    chartGroupTitle: string;
    items: {
        imgPath: string;
        title: string;
        seoTitle: string;
        examplePath: string;
    }[];
};

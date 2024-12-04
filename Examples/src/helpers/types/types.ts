export type GalleryItem = {
    chartGroupTitle: string;
    id: string;
    items: {
        imgPath: string;
        title: string;
        seoTitle: string;
        examplePath: string;
        subtitle?: string;
        metaDescription?: string;
    }[];
};

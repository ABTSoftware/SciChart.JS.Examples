import { TMenuItem } from "../AppRouter/examples";
import { EPageFramework } from "../AppRouter/pages";

export type TSearchItem = {
    category: string;
    title: string;
    keywords: string;
    link: string;
};

export const generateSearchItems = (allMenuItems: TMenuItem[], framework: EPageFramework) => {
    const searchItemsList: TSearchItem[] = [];
    allMenuItems.forEach((menuItem) => {
        menuItem.submenu.forEach((smItem) => {
            if (!searchItemsList.find((i) => i.title === smItem.title)) {
                searchItemsList.push({
                    category: menuItem.item.name,
                    title: smItem.title,
                    link: smItem.path(framework),
                    keywords: smItem.metaKeywords,
                });
            }
        });
    });
    return searchItemsList;
};

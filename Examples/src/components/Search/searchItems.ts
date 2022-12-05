import {ALL_MENU_ITEMS, TMenuItem} from "../AppRouter/examples";

export type TSearchItem = {
    category: string;
    title: string;
    keywords: string;
    link: string;
};

const generateSearchItems = (allMenuItems: TMenuItem[]) => {
    const searchItemsList: TSearchItem[] = [];
    allMenuItems.forEach(menuItem => {
        menuItem.submenu.forEach(smItem => {
            if (!searchItemsList.find(i => i.title === smItem.title)) {
                searchItemsList.push({
                    category: menuItem.item.name,
                    title: smItem.title,
                    link: smItem.path,
                    keywords: smItem.metaKeywords,
            });
            }
        });
    });
    return searchItemsList;
};

export const searchItems: TSearchItem[] = generateSearchItems(ALL_MENU_ITEMS);

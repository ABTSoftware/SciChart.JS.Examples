import { getTitle, EPageFramework } from "../../helpers/shared/Helpers/frameworkParametrization";
import { TMenuItem } from "../AppRouter/examples";

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
            const smItemTitle = getTitle(smItem.title, framework);
            if (!searchItemsList.find((i) => i.title === smItemTitle)) {
                searchItemsList.push({
                    category: menuItem.item.name,
                    title: smItemTitle,
                    link: `${framework}/${smItem.path}`,
                    keywords: smItem.metaKeywords,
                });
            }
        });
    });
    return searchItemsList;
};

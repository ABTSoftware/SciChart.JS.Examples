import { GalleryItem } from "./types/types";
import { MENU_ITEMS_2D, MENU_ITEMS_3D, MENU_ITEMS_FEATURED_APPS, TMenuItem } from "../components/AppRouter/examples";
import { TExamplePage } from "../components/AppRouter/examplePages";
import { getTitle, EPageFramework } from "./shared/Helpers/frameworkParametrization";
import { ExampleStrings } from "../components/Examples/ExampleStrings";

const getGalleryItems = (category: string, menuItem: TMenuItem, framework: EPageFramework) => {
    return {
        chartGroupTitle: (category !== undefined ? `${category}: ` : "") + menuItem.item.name,
        items: menuItem.submenu.map((subMenu) => {
            return {
                imgPath: subMenu.thumbnailImage,
                title: getTitle(subMenu.title, framework),
                seoTitle: getTitle(subMenu.pageTitle, framework) + ExampleStrings.exampleGenericTitleSuffix,
                examplePath: subMenu.path,
            };
        }),
    };
};

export const generateExamplesGallery = (framework: EPageFramework) => {
    const items: GalleryItem[] = [];

    // Featured apps first
    MENU_ITEMS_FEATURED_APPS.forEach((menuItem) => items.push(getGalleryItems("Featured Apps", menuItem, framework)));

    // 2D Charts
    MENU_ITEMS_2D.forEach((menuItem) => items.push(getGalleryItems("2D Charts", menuItem, framework)));

    // Then 3D Charts
    MENU_ITEMS_3D.forEach((menuItem) => items.push(getGalleryItems("3D Charts", menuItem, framework)));

    return items;
};

export const getSeeAlsoGalleryItems = (
    allMenuItems: TMenuItem[],
    currentExample: TExamplePage,
    framework: EPageFramework
) => {
    const galleryItems: GalleryItem[] = [];
    if (currentExample) {
        // Find the top-level menu item that hosts this example
        const topLevelMenu = allMenuItems.find((tm) => tm.submenu.find((sm) => sm.id === currentExample.id));
        // Get all the examples in that menu that is not this example
        const seeAlsoExamples = topLevelMenu.submenu.filter((sm) => sm.id !== currentExample.id);
        // Convert to a galleryItem for the See-Also section on each individual example
        galleryItems.push(
            getGalleryItems(
                "See Also",
                {
                    item: {
                        id: topLevelMenu.item.id,
                        name: topLevelMenu.item.name,
                    },
                    submenu: seeAlsoExamples,
                },
                framework
            )
        );
    }
    return galleryItems;
};

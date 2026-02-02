import { GalleryItem } from "./types/types";
import { MENU_ITEMS_2D, MENU_ITEMS_3D, MENU_ITEMS_FEATURED_APPS, TMenuItem } from "../components/AppRouter/examples";
import { TExamplePage } from "../components/AppRouter/examplePages";
import { getFrameworkContent, EPageFramework } from "./shared/Helpers/frameworkParametrization";
import { ExampleStrings } from "../components/Examples/ExampleStrings";

const getGalleryItems = (category: string, menuItem: TMenuItem, framework: EPageFramework) => {
    return {
        chartGroupTitle: (category !== undefined ? `${category}: ` : "") + menuItem.title,
        id: menuItem.id,
        items: menuItem.submenu.map((subMenu) => {
            return {
                imgPath: subMenu.thumbnailImage,
                title: getFrameworkContent(subMenu.title, framework),
                seoTitle: getFrameworkContent(subMenu.pageTitle, framework) + ExampleStrings.exampleGenericTitleSuffix,
                examplePath: subMenu.path,
                subTitle: subMenu.subtitle(framework),
                metaDescription: getFrameworkContent(subMenu.metaDescription, framework),
                isNew: subMenu.isNew
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
        if (topLevelMenu) {
            const seeAlsoExamples = topLevelMenu.submenu.filter((sm) => sm.id !== currentExample.id);
            // Convert to a galleryItem for the See-Also section on each individual example
            galleryItems.push(
                getGalleryItems(
                    "See Also",
                    {
                        id: topLevelMenu.id,
                        title: topLevelMenu.title,
                        submenu: seeAlsoExamples,
                    },
                    framework
                )
            );
        } else {
            //  console.log("Top level menu is null>>");
        }
    }
    return galleryItems;
};

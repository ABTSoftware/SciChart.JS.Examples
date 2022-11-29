import { GalleryItem } from "./types/types";
import {
    MENU_ITEMS_2D,
    MENU_ITEMS_3D,
    MENU_ITEMS_FEATURED_APPS,
    TMenuItem,
} from "../components/AppRouter/examples";
import {TExamplePage} from "../components/AppRouter/examplePages";

const getGalleryItems = (category: string, menuItem: TMenuItem) => {
    return {
        chartGroupTitle: (category !== undefined ? `${category}: ` : "") + menuItem.item.name,
        items: menuItem.submenu.map(subMenu => {
            return {
                imgPath: subMenu.thumbnailImage,
                title: subMenu.title,
                seoTitle: subMenu.pageTitle,
                examplePath: subMenu.path,
            }
        })
    };
};

const generateExamplesGallery = () => {
    const items: GalleryItem[] = [];

    // Featured apps first
    MENU_ITEMS_FEATURED_APPS.forEach(menuItem => items.push(getGalleryItems("Featured Apps", menuItem)));

    // 2D Charts
    MENU_ITEMS_2D.forEach(menuItem => items.push(getGalleryItems("2D Charts", menuItem)));

    // Then 3D Charts
    MENU_ITEMS_3D.forEach(menuItem => items.push(getGalleryItems("3D Charts", menuItem)));

    return items;
};

export const getSeeAlsoGalleryItems = (allMenuItems: TMenuItem[], currentExample: TExamplePage) => {
    const galleryItems: GalleryItem[] = [];
    if (currentExample) {
        // Find the top-level menu item that hosts this example
        const topLevelMenu = allMenuItems.find(tm => tm.submenu.find(sm => sm.id === currentExample.id));
        // Get all the examples in that menu that is not this example
        const seeAlsoExamples = topLevelMenu.submenu.filter(sm => sm.id !== currentExample.id);
        // Convert to a galleryItem for the See-Also section on each individual example
        galleryItems.push(getGalleryItems("See Also", {
            item: {
                id: topLevelMenu.item.id,
                name: topLevelMenu.item.name,
            },
            submenu: seeAlsoExamples
        }));
    }
    return galleryItems;
};

export const allGalleryItems: GalleryItem[] = generateExamplesGallery();

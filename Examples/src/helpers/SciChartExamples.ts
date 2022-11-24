import { GalleryItem } from "./types/types";
import {
    MENU_ITEMS_2D,
    MENU_ITEMS_3D,
    MENU_ITEMS_FEATURED_APPS,
    MENU_ITEMS_WHATSNEW,
    TMenuItem,
} from "../components/AppRouter/examples";

const generateExamplesGallery = () => {
    const galleryItems: GalleryItem[] = [];

    const generateGalleryItem = (category: string, menuItem: TMenuItem) => {
        galleryItems.push({
            chartGroupTitle: category + ": " + menuItem.item.name,
            items: menuItem.submenu.map(subMenu => {
                return {
                    imgPath: subMenu.thumbnailImage,
                    title: subMenu.title,
                    seoTitle: subMenu.pageTitle,
                    examplePath: subMenu.path,
                }
            })
        })
    };
    // Featured apps first
    MENU_ITEMS_FEATURED_APPS.forEach(menuItem => generateGalleryItem("Featured Apps", menuItem));

    // 2D Charts
    MENU_ITEMS_2D.forEach(menuItem => generateGalleryItem("2D Charts", menuItem));

    // Then 3D Charts
    MENU_ITEMS_3D.forEach(menuItem => generateGalleryItem("3D Charts", menuItem));

    return galleryItems;
};

export const sciChartExamples: GalleryItem[] = generateExamplesGallery();

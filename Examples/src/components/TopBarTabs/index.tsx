import React, { useState, FC, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import classes from "./index.scss";
import { MENU_ITEMS_2D, MENU_ITEMS_3D, MENU_ITEMS_FEATURED_APPS } from "../AppRouter/examples";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";
import { getTitle, useExampleRouteParams } from "../../helpers/shared/Helpers/frameworkParametrization";
import { generateExamplesGallery } from "../../helpers/SciChartExamples";
import NewGalleryItems from "../GalleryItems";
import SubMenuItems from "../AppDeatilsRouters/SubMenuItems";
import TabBar from "../TabBar/TabBar";
import GalleryItems from "../GalleryItems";

export type TabName = "Featured Apps" | "2D Charts" | "3D Charts" | "Demos by Industry" | "Demos by Feature";

const ButtonTabs: FC = () => {
    const navigate = useNavigate();
    const { framework } = useExampleRouteParams();
    const [activeTab, setActiveTab] = useState<TabName>("Featured Apps");
    const [currentMenuItems, setCurrentMenuItems] = useState(MENU_ITEMS_FEATURED_APPS);
    const [selectedItemId, setSelectedItemId] = useState(currentMenuItems[0].id);
    const selectedFramework = useContext(FrameworkContext);
    const selectedItem = currentMenuItems.find((item) => item?.id === selectedItemId);
    const SubmenuTitle = selectedItem?.submenu?.map((item) => {
        return { title: getTitle(item?.title, selectedFramework), path: item.path };
    });
    const allGalleryItems = generateExamplesGallery(framework);

    const handleTabClick = (tabName: TabName) => {
        setActiveTab(tabName);
        switch (tabName) {
            case "Featured Apps":
                setCurrentMenuItems(MENU_ITEMS_FEATURED_APPS);
                setSelectedItemId(MENU_ITEMS_FEATURED_APPS[0].id);
                break;
            case "2D Charts":
                setCurrentMenuItems(MENU_ITEMS_2D);
                setSelectedItemId(MENU_ITEMS_2D[0].id);
                break;
            case "3D Charts":
                setCurrentMenuItems(MENU_ITEMS_3D);
                setSelectedItemId(MENU_ITEMS_3D[0].id);
                break;
            case "Demos by Industry":
                setCurrentMenuItems(MENU_ITEMS_FEATURED_APPS);
                setSelectedItemId(MENU_ITEMS_FEATURED_APPS[0].id);
                break;
            case "Demos by Feature":
                setCurrentMenuItems(MENU_ITEMS_FEATURED_APPS);
                setSelectedItemId(MENU_ITEMS_FEATURED_APPS[0].id);
                break;
        }
    };

    const handleClick = (id: any) => {
        setSelectedItemId(id);
    };

    const handleSubmenuClick = (path: string) => {
        navigate(`/${selectedFramework}/${path}`);
    };

    return (
        <>
            <TabBar activeTab={activeTab} handleTabClick={handleTabClick} />
            <div className={classes.contentwrapper}>
                <div className={`${classes.tabcontent} ${classes.active}`}>
                    <SubMenuItems
                        currentMenuItems={currentMenuItems}
                        selectedItemId={selectedItemId}
                        handleClicks={handleClick}
                        SubmenuTitle={SubmenuTitle}
                        handleSubmenuClick={handleSubmenuClick}
                        isHomePage={true}
                    />
                    <GalleryItems examples={allGalleryItems} />
                </div>
            </div>
        </>
    );
};

export default ButtonTabs;

import React, { useState, FC, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import classes from "./index.scss";
import { MENU_ITEMS_2D, MENU_ITEMS_3D, MENU_ITEMS_FEATURED_APPS } from "../AppRouter/examples";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";
import { getTitle, useExampleRouteParams } from "../../helpers/shared/Helpers/frameworkParametrization";
import { generateExamplesGallery } from "../../helpers/SciChartExamples";
import NewGalleryItems from "../GalleryItems";
import Iconleft from "./images/icon-left-arrow.svg";
import SubMenuItems from "../AppDeatilsRouters/SubMenuItems";

type TabName = "Featured Apps" | "2D Charts" | "3D Charts";

const ButtonTabs: FC = () => {
    const navigate = useNavigate();
    const { framework } = useExampleRouteParams();
    const [activeTab, setActiveTab] = useState<TabName>("Featured Apps");
    const [currentMenuItems, setCurrentMenuItems] = useState(MENU_ITEMS_FEATURED_APPS);
    const [selectedItemId, setSelectedItemId] = useState(currentMenuItems[0].item.id);
    const selectedFramework = useContext(FrameworkContext);
    const selectedItem = currentMenuItems.find((item) => item?.item.id === selectedItemId);
    const SubmenuTitle = selectedItem?.submenu?.map((item) => {
        return { title: getTitle(item?.title, selectedFramework), path: item.path };
    });
    const allGalleryItems = generateExamplesGallery(framework);

    const handleTabClick = (tabName: TabName) => {
        setActiveTab(tabName);
        switch (tabName) {
            case "Featured Apps":
                setCurrentMenuItems(MENU_ITEMS_FEATURED_APPS);
                setSelectedItemId(MENU_ITEMS_FEATURED_APPS[0].item.id);
                break;
            case "2D Charts":
                setCurrentMenuItems(MENU_ITEMS_2D);
                setSelectedItemId(MENU_ITEMS_2D[0].item.id);
                break;
            case "3D Charts":
                setCurrentMenuItems(MENU_ITEMS_3D);
                setSelectedItemId(MENU_ITEMS_3D[0].item.id);
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
            <div className={classes.tabwrapper}>
                <ul className={classes.tabs}>
                    <li
                        className={`${classes.tablink} ${activeTab === "Featured Apps" ? classes.active : ""}`}
                        onClick={() => handleTabClick("Featured Apps")}
                    >
                        Featured Apps
                    </li>
                    <li
                        className={`${classes.tablink} ${activeTab === "2D Charts" ? classes.active : ""}`}
                        onClick={() => handleTabClick("2D Charts")}
                    >
                        2D Charts
                    </li>
                    <li
                        className={`${classes.tablink} ${activeTab === "3D Charts" ? classes.active : ""}`}
                        onClick={() => handleTabClick("3D Charts")}
                    >
                        3D Charts
                    </li>
                </ul>
            </div>
            <div className={classes.contentwrapper}>
                <div id="tab-1" className={`${classes.tabcontent} ${classes.active}`}>
                    <SubMenuItems
                        currentMenuItems={currentMenuItems}
                        selectedItemId={selectedItemId}
                        handleClicks={handleClick}
                        SubmenuTitle={SubmenuTitle}
                        handleSubmenuClick={handleSubmenuClick}
                    />
                    <NewGalleryItems examples={allGalleryItems} currentMenuItems={currentMenuItems} />
                </div>
            </div>
        </>
    );
};

export default ButtonTabs;

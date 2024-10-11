import React, { FC } from "react";
import classes from "./AppDeatilsRouter.scss";
import Iconleft from "../TopBarTabs/images/icon-left-arrow.svg";

type MenuItem = {
    item: {
        id: any;
        name: any;
    };
};

type SubMenuItem = {
    title: any;
    path: any;
};

type TProps = {
    currentMenuItems: MenuItem[];
    selectedItemId: any;
    handleClicks: (id: number) => void;
    SubmenuTitle: SubMenuItem[];
    handleSubmenuClick: (path: string) => void;
    isHomePage?: boolean;
};

const SubMenuItems: FC<TProps> = ({
    currentMenuItems,
    selectedItemId,
    handleClicks,
    SubmenuTitle,
    handleSubmenuClick,
    isHomePage = false
}) => {
    return (
        <div className={classes.contertlistwrap} style={ isHomePage ? {top: 80} : {}}> 
            <div className={`${classes.contentlist} ${classes.graybg}`}>
                {currentMenuItems.map((item) => (
                    <ul key={item.item.id} style={{ fontWeight: 500, fontFamily: "Arial", fontSize: "17px" }}>
                        <li
                            className={selectedItemId === item.item.id ? classes.active : ""}
                            onClick={() => handleClicks(item.item.id)}
                            style={{
                                fontWeight: 500,
                                fontFamily: "Arial",
                                fontSize: "17px",
                                color: "rgba(80, 103, 117, 1)",
                            }}
                        >
                            {item.item.name}
                            {selectedItemId === item.item.id && (
                                <img style={{ marginTop: "2px", float: "right" }} src={Iconleft} alt="Icon" />
                            )}
                            <div className={`${classes.contentlist} ${classes.columncount} ${classes.desktophidden}`}>
                                <ul>
                                    {SubmenuTitle?.map((submenuItem, index) => (
                                        <li key={index} onClick={() => handleSubmenuClick(submenuItem.path)}>
                                            {submenuItem.title}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    </ul>
                ))}
            </div>
            <div className={`${classes.contentlist} ${classes.columncount} ${classes.mobilehidden}`}>
                <ul style={{ fontWeight: 600, fontFamily: "Arial", fontSize: "17px" }}>
                    {SubmenuTitle?.map((submenuItem, index) => (
                        <li key={index} onClick={() => handleSubmenuClick(submenuItem.path)}>
                            {submenuItem.title}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SubMenuItems;

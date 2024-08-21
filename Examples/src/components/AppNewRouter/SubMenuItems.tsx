import React, { FC } from "react";
import classes from "./AppNewRouter.scss";
import Iconleft from "../NewTabs/images/icon-left-arrow.svg";

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
};

const SubMenuItems: FC<TProps> = ({
    currentMenuItems,
    selectedItemId,
    handleClicks,
    SubmenuTitle,
    handleSubmenuClick,
}) => {
    return (
        <div className={classes.contertlistwrap}>
            <div className={`${classes.contentlist} ${classes.graybg}`}>
                {currentMenuItems.map((item) => (
                    <ul key={item.item.id}>
                        <li
                            className={selectedItemId === item.item.id ? classes.active : ""}
                            onClick={() => handleClicks(item.item.id)}
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
                <ul>
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

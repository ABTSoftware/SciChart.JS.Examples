import { FC, Fragment, useContext, useEffect, useRef } from "react";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import { TMenuItem } from "../AppRouter/examples";
import { useMatch } from "react-router";
import MenuListItemText from "../../helpers/shared/MenuListItemText/MenuListItemText";
import classes from "./ListItemsBlock.module.scss";
import ListItemCollapseArrowIcon from "./ListItemCollapseArrowIcon";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";
import { getFrameworkContent, useExampleRouteParams } from "../../helpers/shared/Helpers/frameworkParametrization";

type TProps = {
    onExpandClick: (id: string) => void;
    checkIsOpened: (id: string) => boolean;
    historyPushPath: (path: string) => void;
    title: string;
    menuItems: TMenuItem[];
    menuItemsId: string;
    mostVisibleCategory?: string;
};

const ListItemsBlock: FC<TProps> = (props) => {
    const selectedFramework = useContext(FrameworkContext);
    const match = useExampleRouteParams();

    const { onExpandClick, checkIsOpened, historyPushPath, title, menuItems, menuItemsId, mostVisibleCategory } = props;

    // Ref for the currently active item
    const activeItemRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Automatically scroll to the active item
        if (activeItemRef.current) {
            activeItemRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, []);

    // Automatically expand the section containing the active or most visible item
    useEffect(() => {
        if (mostVisibleCategory) {
            const activeMenuItem = menuItems.find((item) =>
                item.submenu.some((subItem) => subItem.id === mostVisibleCategory)
            );

            if (activeMenuItem) {
                onExpandClick(activeMenuItem.id);
                onExpandClick(menuItemsId);
            }
        }
    }, [mostVisibleCategory, menuItems, onExpandClick, menuItemsId]);

    const isItemActive = (itemId: string): boolean => {
        return match?.currentExample?.id === itemId;
    };

    return (
        <div className={classes.ListItemBlock}>
            <div onClick={() => onExpandClick(menuItemsId)} className={classes.CollapsibleMenuListItem}>
                <MenuListItemText text={title} className={classes.MenuListItemText} />
            </div>
            <Collapse in={true} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {menuItems.map((el) => (
                        <Fragment key={el.id}>
                            <div
                                className={`${classes.CollapsibleMenuListItem} ${
                                    el.id === mostVisibleCategory ? classes.ActiveParentCategory : ""
                                }`}
                                onClick={() => onExpandClick(el.id)}
                                data-category-id={el.id}
                            >
                                <MenuListItemText text={el.title} className={classes.SecondLevelMenuListItemText} />
                                <ListItemCollapseArrowIcon
                                    className={classes.CollapseArrowButton}
                                    isCollapseOpened={
                                        el.submenu.some((subItem) => isItemActive(subItem.id)) || !checkIsOpened(el.id)
                                    }
                                />
                            </div>
                            <Collapse
                                in={el.submenu.some((subItem) => isItemActive(subItem.id)) || !checkIsOpened(el.id)}
                                timeout="auto"
                                unmountOnExit
                            >
                                <List component="div" disablePadding>
                                    {el.submenu.map((subEl) => (
                                        <div
                                            key={subEl.id}
                                            ref={isItemActive(subEl.id) ? activeItemRef : null} // Attach ref to the active item
                                            className={`${
                                                isItemActive(subEl.id)
                                                    ? classes.SelectedBottomLevelListItem
                                                    : classes.BottomLevelListItem
                                            } ${subEl.id === mostVisibleCategory ? classes.MostVisible : ""}`}
                                            onClick={() => historyPushPath(`${selectedFramework}/${subEl.path}`)}
                                        >
                                            <a
                                                className={classes.ExampleLink}
                                                href={`${selectedFramework}/${subEl.path}`}
                                                title={getFrameworkContent(subEl.title, selectedFramework)}
                                            >
                                                {getFrameworkContent(subEl.title, selectedFramework)}
                                            </a>
                                        </div>
                                    ))}
                                </List>
                            </Collapse>
                        </Fragment>
                    ))}
                </List>
            </Collapse>
        </div>
    );
};

export default ListItemsBlock;

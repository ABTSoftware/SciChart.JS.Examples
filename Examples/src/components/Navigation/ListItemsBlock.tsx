import { FC, Fragment, useContext, useEffect } from "react";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import { TMenuItem } from "../AppRouter/examples";
import { useMatch } from "react-router-dom";
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

    const { 
        onExpandClick, 
        checkIsOpened, 
        historyPushPath, 
        title, 
        menuItems, 
        menuItemsId,
        mostVisibleCategory 
    } = props;

    // Automatically expand the section containing the active or most visible item
    useEffect(() => {
        if (mostVisibleCategory) {
            // Find the parent category for the most visible category
            const activeMenuItem = menuItems.find(item => 
                item.submenu.some(subItem => subItem.id === mostVisibleCategory)
            );

            if (activeMenuItem) {
                // Expand the parent category
                onExpandClick(activeMenuItem.id);
                
                // Ensure the top-level menu is also expanded
                onExpandClick(menuItemsId);
            }
        }
    }, [mostVisibleCategory, menuItems, onExpandClick, menuItemsId]);

    // Helper function to check if a submenu item is active
    const isItemActive = (itemId: string) => {
        return match?.currentExample?.path === `${selectedFramework}/${itemId}`;
    };

    return (
        <div className={classes.ListItemBlock}>
            <div 
                onClick={() => onExpandClick(menuItemsId)} 
                className={`${classes.CollapsibleMenuListItem} ${
                    menuItems.some(menuItem => 
                        menuItem.submenu.some(subItem => isItemActive(subItem.id))
                    ) ? classes.ActiveParentCategory : ''
                }`}
            >
                <MenuListItemText text={title} className={classes.MenuListItemText} />
                <ListItemCollapseArrowIcon
                    className={classes.CollapseArrowButton}
                    isCollapseOpened={checkIsOpened(menuItemsId)}
                />
            </div>
            <Collapse in={checkIsOpened(menuItemsId)} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {menuItems.map((el) => (
                        <Fragment key={el.id}>
                            <div 
                                className={`${classes.CollapsibleMenuListItem} ${
                                    el.id === mostVisibleCategory ? classes.ActiveParentCategory : ''
                                }`} 
                                onClick={() => onExpandClick(el.id)}
                                data-category-id={el.id} // Assign a data attribute
                            >
                                <MenuListItemText text={el.title} className={classes.SecondLevelMenuListItemText} />
                                <ListItemCollapseArrowIcon
                                    className={classes.CollapseArrowButton}
                                    isCollapseOpened={!checkIsOpened(el.id)}
                                />
                            </div>
                            <Collapse in={!checkIsOpened(el.id)} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {el.submenu.map((subEl) => (
                                        <div
                                            key={subEl.id}
                                            className={`${isItemActive(subEl.id)
                                                ? classes.SelectedBottomLevelListItem
                                                : classes.BottomLevelListItem} ${
                                                subEl.id === mostVisibleCategory ? classes.MostVisible : ""
                                            }`}
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

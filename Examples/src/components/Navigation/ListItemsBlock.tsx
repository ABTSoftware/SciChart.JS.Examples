import { FC, Fragment, useContext, useEffect, useRef } from "react";
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import { TMenuItem } from "../AppRouter/examples";
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
    
    const containerRef = useRef<HTMLDivElement>(null);
    const categoryElements = useRef(new Map<string, HTMLElement>());

    // Register category elements
    const registerCategoryElement = (id: string | null, element: HTMLElement | null) => {
        if (element && id) {
            categoryElements.current.set(id, element);
        }
    };

    // Scroll to most visible category
    useEffect(() => {
        if (mostVisibleCategory && containerRef.current) {
            setTimeout(() => {
                const element = categoryElements.current.get(mostVisibleCategory);
                if (element) {
                    if(mostVisibleCategory === "featuredApps_performanceDemos") {
                        containerRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
                    } else {
                        element.scrollIntoView({ block: "nearest", behavior: "smooth" });
                    }
                }
            }, 10); // Allow for expansion animations
        }
    }, [mostVisibleCategory]);

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
        <div className={classes.ListItemBlock} ref={containerRef}>
            <div onClick={() => onExpandClick(menuItemsId)} className={classes.CollapsibleMenuListItem}>
                <MenuListItemText text={title} className={classes.MenuListItemText} />
            </div>
            <Collapse in={true} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {menuItems.map((el) => (
                        <Fragment key={el.id}>
                            {/* Parent category element */}
                            <div
                                ref={(elem) => registerCategoryElement(el.id, elem)}
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
                                            ref={(elem) => registerCategoryElement(subEl.id, elem)}
                                            className={`${
                                                isItemActive(subEl.id)
                                                    ? classes.SelectedBottomLevelListItem
                                                    : classes.BottomLevelListItem
                                            } ${subEl.id === mostVisibleCategory ? classes.MostVisible : ""}`}
                                            onClick={() => historyPushPath(`${selectedFramework}/${subEl.path}`)}
                                            data-category-id={subEl.id}
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

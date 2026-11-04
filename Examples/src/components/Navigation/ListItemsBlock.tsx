import { FC, Fragment, useEffect, useRef, useState } from "react";
import { TMenuItem } from "../AppRouter/examples";
import MenuListItemText from "../../helpers/shared/MenuListItemText/MenuListItemText";
import ListItemCollapseArrowIcon from "./ListItemCollapseArrowIcon";
import { getFrameworkContent } from "../../helpers/shared/Helpers/frameworkParametrization";
import { _useContext } from "../../helpers/shared/Helpers/Context";

import { useNavigate } from "react-router";
import { useNavigationContext } from "./NavigationContext";

type TProps = {
    title: string;
    menuItems: TMenuItem[];
    menuItemsId: string;
};

const ListItemsBlock: FC<TProps> = (props) => {
    const { state } = _useContext();
    const selectedFramework = state.framework;
    const { toggleCategory, isCategoryCollapsed, expandCategory, mostVisibleCategory } = useNavigationContext();
    const historyPushPath = useNavigate();
    const { title, menuItems, menuItemsId } = props;

    const [manuallyCollapsed, setManuallyCollapsed] = useState<Set<string>>(new Set());

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
                    if (mostVisibleCategory === "featuredApps_performanceDemos") {
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
                expandCategory(activeMenuItem.id);
                expandCategory(menuItemsId);
            }
        }
    }, [mostVisibleCategory, menuItems, expandCategory, menuItemsId]);

    const isItemActive = (itemId: string): boolean => {
        return state.currentExample?.id === itemId;
    };

    const hasActiveItem = (category: TMenuItem): boolean => {
        return category.submenu.some((subItem) => isItemActive(subItem.id));
    };

    const handleCategoryClick = (categoryId: string) => {
        const category = menuItems.find((item) => item.id === categoryId);

        if (category && hasActiveItem(category)) {
            setManuallyCollapsed((prev) => {
                const updated = new Set(prev);
                if (updated.has(categoryId)) {
                    updated.delete(categoryId);
                } else {
                    updated.add(categoryId);
                }

                return updated;
            });
        }

        toggleCategory(categoryId);
    };

    return (
        <div className="sc-app-menu-list-item-block" ref={containerRef}>
            <div onClick={() => toggleCategory(menuItemsId)} className="sc-app-menu-collapsible-menu-list-item">
                <MenuListItemText text={title} className="sc-app-menu-menu-list-item-text" />
            </div>
            <div>
                <div>
                    {menuItems.map((el) => {
                        const isActiveCategory = hasActiveItem(el);
                        const isManuallyCollapsed = manuallyCollapsed.has(el.id);
                        const shouldExpand =
                            (isActiveCategory && !isManuallyCollapsed) ||
                            (!isActiveCategory && !isCategoryCollapsed(el.id));

                        return (
                            <Fragment key={el.id}>
                                {/* Parent category element */}
                                <div
                                    ref={(elem) => registerCategoryElement(el.id, elem)}
                                    className={`sc-app-menu-collapsible-menu-list-item ${
                                        el.id === mostVisibleCategory ? "sc-app-menu-active-parent-category" : ""
                                    }`}
                                    onClick={() => handleCategoryClick(el.id)}
                                    data-category-id={el.id}
                                >
                                    <MenuListItemText
                                        text={el.title}
                                        className="sc-app-menu-second-level-menu-list-item-text"
                                    />
                                    <ListItemCollapseArrowIcon
                                        className="sc-app-menu-collapse-arrow-button"
                                        isCollapseOpened={shouldExpand}
                                    />
                                </div>
                                <div hidden={!shouldExpand}>
                                    <div>
                                        {el.submenu.map((subEl) => (
                                            <div
                                                key={subEl.id}
                                                ref={(elem) => registerCategoryElement(subEl.id, elem)}
                                                className={`${
                                                    isItemActive(subEl.id)
                                                        ? "sc-app-menu-selected-bottom-level-list-item"
                                                        : "sc-app-menu-bottom-level-list-item"
                                                }`}
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    historyPushPath(`${selectedFramework}/${subEl.path}`);
                                                }}
                                                data-category-id={subEl.id}
                                            >
                                                <a
                                                    className="sc-app-menu-example-link"
                                                    href={`${selectedFramework}/${subEl.path}`}
                                                    title={getFrameworkContent(subEl.title, selectedFramework)}
                                                >
                                                    {getFrameworkContent(subEl.title, selectedFramework)}
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Fragment>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ListItemsBlock;

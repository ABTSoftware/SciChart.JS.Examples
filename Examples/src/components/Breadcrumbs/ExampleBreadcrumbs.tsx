import { ReactNode, useMemo } from "react";
import { Button, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { getExampleCategoryPath, MENU_ITEMS_HIERARCHY } from "../AppRouter/examples";
import { BreadcrumbsWithMenu, TBreadcrumbItem, TBreadcrumbPath } from "./GenericBreadcrumbs";
import { appTheme } from "../Examples/theme";
import { TExamplePage } from "../AppRouter/examplePages";
import { useExampleRouteParams, getFrameworkContent } from "../../helpers/shared/Helpers/frameworkParametrization";

// TODO TMenuItem is not consistent with tree-like format and doesn't really fit this structure, thus special handling of the leaf nodes is required

const onBreadcrumbPathChange = (value: TBreadcrumbPath) => {};

export const ExampleBreadcrumbs = () => {
    const { isIFrame, currentExample, framework: selectedFramework } = useExampleRouteParams();
    const memoizedMenuPath = useMemo(() => getExampleCategoryPath(currentExample), [currentExample]);

    return (
        <BreadcrumbsWithMenu
            items={MENU_ITEMS_HIERARCHY as TBreadcrumbItem[]}
            path={memoizedMenuPath}
            onChange={onBreadcrumbPathChange}
            breadcrumbPropsMapper={(breadcrumb: TBreadcrumbItem) => {
                let link: string;
                let title: string;
                let labelContent: ReactNode;
                let menuItems: TBreadcrumbItem[] = undefined;

                if (!breadcrumb.submenu) {
                    // leaf nodes (specific examples handling)
                    link = (breadcrumb as TExamplePage).path;
                    title = getFrameworkContent(breadcrumb.title, selectedFramework);
                    labelContent = getFrameworkContent(breadcrumb.title, selectedFramework) || "Loading...";
                } else if (breadcrumb.id === "home") {
                    // Home menu item handling
                    link = `/${selectedFramework}`;
                    title = "Home Page Gallery";
                    labelContent = <HomeIcon
                        sx={{
                            // align in center
                            verticalAlign: "middle",
                        }}
                    />;
                    menuItems = [];
                } else {
                    // inner menu category handling
                    link = `/${selectedFramework}#${breadcrumb.id}`;
                    title = breadcrumb.title;
                    labelContent = breadcrumb.title;
                }

                const label = (
                    <Button
                        sx={{
                            display: "inline-block",
                            padding: 0,
                            minWidth: "unset",
                            textWrap: "nowrap",
                            overflow: "hidden",
                            textOverflow: { xs: "ellipsis", md: "unset", lg: "unset" },
                            textTransform: "unset",
                            color: 'var(--light-blue)',

                            "&:hover": { textDecoration: "underline" },
                            ".": {},
                        }}
                    >
                        {labelContent}
                    </Button>
                );

                return { link, label, title, menuItems };
            }}
            breadcrumbMenuItemsMapper={(breadcrumb: TBreadcrumbItem) => {
                let link: string;
                let title: string;
                let labelContent: ReactNode;

                if (!breadcrumb.submenu) {
                    // leaf nodes (specific examples handling)
                    link = (breadcrumb as TExamplePage).path;
                    title = getFrameworkContent(breadcrumb.title, selectedFramework);
                    labelContent = getFrameworkContent(breadcrumb.title, selectedFramework);
                } else {
                    // inner menu category handling
                    link = `/${selectedFramework}#${breadcrumb.id}`;
                    title = breadcrumb.title;
                    labelContent = breadcrumb.title;
                }

                const label = (
                    <Typography
                        sx={{
                            padding: 0,
                            minWidth: "unset",
                            textTransform: "unset",
                            textDecoration: "none",

                            color: "var(--text)",
                            // "&:hover": { textDecoration: "underline" },
                        }}
                    >
                        {labelContent}
                    </Typography>
                );

                return { link, label, title };
            }}
        />
    );
};

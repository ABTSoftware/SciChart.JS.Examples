import { useContext, useState, MouseEvent, ReactNode } from "react";
import { Link } from "react-router";
import {
    MenuItem,
    Breadcrumbs,
    ClickAwayListener,
    Grow,
    MenuList,
    Paper,
    Popper,
    useMediaQuery,
    Theme,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import React from "react";

export type TBreadcrumbItem = {
    id: string;
    title: string;
    submenu?: TBreadcrumbItem[];
};

export type TBreadcrumbPath = (number | string)[];

export type TBreadcrumbProps = { link: string; label: ReactNode; title: string; menuItems?: TBreadcrumbItem[] };

export function BreadcrumbsWithMenu(props: {
    path: TBreadcrumbPath;
    items: TBreadcrumbItem[];
    onChange: (value: TBreadcrumbPath) => void;
    breadcrumbPropsMapper?: (value: TBreadcrumbItem, index?: number, array?: TBreadcrumbItem[]) => TBreadcrumbProps;
    breadcrumbMenuItemsMapper?: (value: TBreadcrumbItem, index?: number, array?: TBreadcrumbItem[]) => TBreadcrumbProps;
}) {
    const { path, items, breadcrumbPropsMapper } = props;

    const [open, setOpen] = React.useState(false);
    const [openedBreadcrumb, setOpenedBreadcrumb] = useState<TBreadcrumbNode>(null);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLAnchorElement>(null);
    const handleBreadcrumbClick = (event: React.MouseEvent<HTMLAnchorElement>, breadcrumb: TBreadcrumbNode) => {
        if (breadcrumb.menuItems.length > 0) {
            event.preventDefault();
        }

        setAnchorEl(event.currentTarget);
        if (breadcrumb.entry.id === openedBreadcrumb?.entry?.id) {
            setOpen(false);
            setOpenedBreadcrumb(null);
        } else {
            setOpenedBreadcrumb(breadcrumb);
            setOpen(true);
        }
    };

    const handleClose = (event: Event | React.SyntheticEvent) => {
        if (anchorEl.contains(event.target as HTMLElement)) {
            return;
        }

        setOpen(false);
        setOpenedBreadcrumb(null);
    };

    function handleListKeyDown(event: React.KeyboardEvent) {
        if (event.key === "Tab") {
            event.preventDefault();
            setOpen(false);
        } else if (event.key === "Escape") {
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorEl.focus();
        }

        prevOpen.current = open;
    }, [open]);

    /** Describes a structure that will be used for rendering the breadcrumb */
    type TBreadcrumbNode = TBreadcrumbProps & { sameLevelEntries: TBreadcrumbItem[]; entry: TBreadcrumbItem };

    const defaultMapper = (breadcrumbItem: TBreadcrumbItem): TBreadcrumbProps => {
        const label = breadcrumbItem?.title;
        const title = breadcrumbItem?.title;
        const link = breadcrumbItem?.id;
        return { label, link, title, menuItems: undefined };
    };

    const breadcrumbList = path.reduce(
        (acc: { nodes: TBreadcrumbNode[]; submenuEntries: TBreadcrumbItem[] }, pathSegment: number | string) => {
            const sameLevelEntries = acc.submenuEntries;
            // TODO maybe it would be simpler to find by index
            const itemEntry = sameLevelEntries?.find((menuItem) => menuItem.id === pathSegment);

            const { label, link, title, menuItems } = breadcrumbPropsMapper?.(itemEntry) ?? defaultMapper(itemEntry);

            acc.nodes.push({
                label,
                link,
                title,
                sameLevelEntries,
                entry: itemEntry,
                menuItems: menuItems ?? sameLevelEntries,
            });
            acc.submenuEntries = itemEntry?.submenu;
            return acc;
        },
        { nodes: [], submenuEntries: items }
    ).nodes;

    const breadcrumbElements = breadcrumbList.map((breadcrumb) => {
        const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => handleBreadcrumbClick(event, breadcrumb);

        return (
            <Link
                key={breadcrumb.entry.id}
                style={{ textDecoration: "none" }}
                to={breadcrumb.link}
                title={breadcrumb.title}
                id="composition-button"
                aria-controls={open ? "composition-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                {breadcrumb.label}
            </Link>
        );
    });

    const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down("md")); // Mobile view

    return (
        <>
            <Breadcrumbs
                aria-label="breadcrumbs"
                maxItems={isXs ? 2 : 8}
                separator={<NavigateNextIcon fontSize="small" sx={{ color: "var(--text)" }} />}
            >
                {breadcrumbElements}
            </Breadcrumbs>

            <Popper
                open={open && openedBreadcrumb?.menuItems.length > 0}
                anchorEl={anchorEl}
                role={undefined}
                placement="bottom-start"
                transition
                disablePortal
                sx={{ zIndex: 10 }}
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin: placement === "bottom-start" ? "left top" : "left bottom",
                        }}
                    >
                        <Paper
                            sx={{
                                backgroundColor: "var(--bg)",
                                color: "var(--text)",
                            }}
                        >
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList
                                    autoFocusItem={open}
                                    id="composition-menu"
                                    aria-labelledby="composition-button"
                                    onKeyDown={handleListKeyDown}
                                >
                                    {openedBreadcrumb?.menuItems?.map((item, index, collection) => {
                                        const { label, link } =
                                            props.breadcrumbMenuItemsMapper?.(item, index, collection) ??
                                            defaultMapper(item);

                                        return (
                                            <MenuItem key={item.id} onClick={handleClose} sx={{ padding: "0px" }}>
                                                {
                                                    <Link
                                                        color="primary"
                                                        style={{
                                                            textDecoration: "none",
                                                            width: "100%",
                                                            height: "100%",
                                                            padding: "6px 16px",
                                                        }}
                                                        to={link}
                                                        title={item.title}
                                                    >
                                                        {label}
                                                    </Link>
                                                }
                                            </MenuItem>
                                        );
                                    })}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </>
    );
}

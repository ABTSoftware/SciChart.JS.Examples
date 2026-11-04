import { ReactNode, useRef, useEffect } from "react";
import { Link } from "react-router";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export type TBreadcrumbItem = {
    id: string;
    title: string;
    submenu?: TBreadcrumbItem[];
};

export type TBreadcrumbPath = (number | string)[];

export type TBreadcrumbProps = {
    link: string;
    label: ReactNode;
    title: string;
    menuItems?: TBreadcrumbItem[];
};

export function BreadcrumbsWithMenu(props: {
    path: TBreadcrumbPath;
    items: TBreadcrumbItem[];
    onChange: (value: TBreadcrumbPath) => void;
    breadcrumbPropsMapper?: (value: TBreadcrumbItem, index?: number, array?: TBreadcrumbItem[]) => TBreadcrumbProps;
    breadcrumbMenuItemsMapper?: (value: TBreadcrumbItem, index?: number, array?: TBreadcrumbItem[]) => TBreadcrumbProps;
}) {
    const { path, items, breadcrumbPropsMapper } = props;

    const ref = useRef<HTMLElement>(null);
    useEffect(() => {
        const closeMenus = (event: PointerEvent | KeyboardEvent) => {
            if (event instanceof KeyboardEvent && event.key !== "Escape") return;
            ref.current
                ?.querySelectorAll<HTMLDetailsElement>("details[open]")
                .forEach((details: HTMLDetailsElement) => {
                    if (event instanceof KeyboardEvent || !details.contains(event.target as Node)) {
                        details.open = false;
                        if (event instanceof KeyboardEvent) details.querySelector("summary")?.focus();
                    }
                });
        };
        document.addEventListener("pointerdown", closeMenus);
        document.addEventListener("keydown", closeMenus);
        return () => {
            document.removeEventListener("pointerdown", closeMenus);
            document.removeEventListener("keydown", closeMenus);
        };
    }, []);

    /** Describes a structure that will be used for rendering the breadcrumb */
    type TBreadcrumbNode = TBreadcrumbProps & {
        sameLevelEntries: TBreadcrumbItem[];
        entry: TBreadcrumbItem;
    };

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

    return (
        <nav ref={ref} aria-label="Breadcrumbs" className="sc-app-breadcrumbs">
            <ol>
                {breadcrumbList.map((breadcrumb, index) => (
                    <li key={breadcrumb.entry.id}>
                        {index > 0 && <NavigateNextIcon fontSize="small" />}
                        {breadcrumb.menuItems.length ? (
                            <details
                                onToggle={(event) => {
                                    if (event.currentTarget.open) {
                                        ref.current
                                            ?.querySelectorAll<HTMLDetailsElement>("details[open]")
                                            .forEach((other: HTMLDetailsElement) => {
                                                if (other !== event.currentTarget) other.open = false;
                                            });
                                    }
                                }}
                            >
                                <summary title={breadcrumb.title}>{breadcrumb.label}</summary>
                                <ul>
                                    {breadcrumb.menuItems.map((item, index, collection) => {
                                        const { label, link, title } =
                                            props.breadcrumbMenuItemsMapper?.(item, index, collection) ??
                                            defaultMapper(item);
                                        return (
                                            <li key={item.id}>
                                                <Link
                                                    to={link}
                                                    title={title}
                                                    onClick={(event) => {
                                                        event.currentTarget.closest("details").open = false;
                                                    }}
                                                >
                                                    {label}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </details>
                        ) : (
                            <Link to={breadcrumb.link} title={breadcrumb.title}>
                                {breadcrumb.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}

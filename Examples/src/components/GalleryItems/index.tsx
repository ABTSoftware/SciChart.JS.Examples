import React, { useState, useEffect, useContext, useMemo } from "react";
import classes from "./index.scss";
import { useNavigate } from "react-router-dom";
import filtericon from "../TopBarTabs/images/filter-icon-1.svg";
import filtericon11 from "../TopBarTabs/images/filtericon11.svg";
import filtericon2 from "../TopBarTabs/images/filter-icon-2.svg";
import filtericon22 from "../TopBarTabs/images/activeicon.svg";
import filtericon3 from "../TopBarTabs/images/filter-icon-3.svg";
import filtericon33 from "../TopBarTabs/images/filtericon33.svg";
import { GalleryItem } from "../../helpers/types/types";
import { Tooltip } from "@mui/material";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";
import { TMenuItem } from "../AppRouter/examples";

type TProps = {
    examples: GalleryItem[];
};

enum GridType {
    Filter1 = "filter1",
    Filter2 = "filter2",
    Filter3 = "filter3",
}

type StatePair<T> = [T, React.Dispatch<React.SetStateAction<T>>];

const GridSelection: React.FC<{ filterState: StatePair<string> }> = ({
    filterState: [activeFilter, setActiveFilter],
}) => {
    const getIcon = (filter: GridType) => {
        const active = activeFilter === filter;
        switch (filter) {
            case GridType.Filter1:
                return active ? filtericon : filtericon11;
            case GridType.Filter2:
                return active ? filtericon22 : filtericon2;
            case GridType.Filter3:
                return active ? filtericon33 : filtericon3;
        }
    };

    const item = (filter: GridType) => (
        <li onClick={() => setActiveFilter(filter)} key={filter}>
            <img src={getIcon(filter)} />
        </li>
    );

    return (
        <div className={classes.showcasedisplay}>
            <ul style={{ cursor: "pointer" }}>{Object.values(GridType).map(item)}</ul>
        </div>
    );
};

const GalleryItems: React.FC<TProps> = ({ examples }) => {
    const navigate = useNavigate();
    const framework = useContext(FrameworkContext);
    const activeFilterState = useState<string>("filter1");
    const [activeFilter] = activeFilterState;

    const handleSubmenuClick = (path: string) => {
        navigate(`/${framework}/${path}`);
    };

    /*
    const groupedItems = useMemo(
        () =>
            currentMenuItems.map((menuItem) => {
                const matchingExample = examples.find((example) =>
                    example.chartGroupTitle.includes(menuItem.title)
                );
                return matchingExample ? { ...menuItem, items: matchingExample.items } : menuItem;
            }),
        [currentMenuItems, examples]
    );
    */

    const renderItems = (items: any[]) => {
        switch (activeFilter) {
            case "filter2":
                return (
                    <div className={`${classes.showcaserow} ${classes.tabmultiple}`}>
                        {items.map((item: any, idx: number) => (
                            <div className={classes.showcasecol} key={idx}>
                                <div className={classes.showcasethumb}>
                                    <img
                                        onClick={() => handleSubmenuClick(item.examplePath)}
                                        src={item.imgPath}
                                        alt={item.seoTitle}
                                        title={item.title}
                                        style={{ cursor: "pointer" }}
                                    />
                                </div>
                                <h3 onClick={() => handleSubmenuClick(item.examplePath)}>{item.title}</h3>
                            </div>
                        ))}
                    </div>
                );
            case "filter3":
                return (
                    <div className={`${classes.showcaserow} ${classes.tablist}`}>
                        {items.map((item: any, idx: number) => (
                            <div className={classes.showcasecol} key={idx}>
                                <div className={classes.showcasethumb}>
                                    <img
                                        onClick={() => handleSubmenuClick(item.examplePath)}
                                        src={item.imgPath}
                                        alt={item.seoTitle}
                                        title={item.title}
                                        style={{ cursor: "pointer" }}
                                    />
                                </div>
                                <div className={classes.showcasecontent}>
                                    <h3>{item.title}</h3>
                                    <p>{item.description || "No description available"}</p>
                                    <div className={classes.tabbtnwrap}>
                                        {/* TODO these should be ReactRouter `Link`s if they are needed at all */}
                                        <a
                                            href=""
                                            className={classes.btnprimary}
                                            onClick={() => handleSubmenuClick(item.examplePath)}
                                        >
                                            View Full Screen
                                        </a>
                                        <a href="" className={classes.btnsecondary}>
                                            View Source in Github
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            default:
                return (
                    <div className={classes.showcaserow}>
                        {items.map((item: any, idx: number) => (
                            <div className={classes.showcasecol} key={idx}>
                                <div className={classes.showcasethumb}>
                                    <Tooltip
                                        style={{ zIndex: "9999" }}
                                        title={<img src={item.imgPath} width={600} height={600} alt={item.seoTitle} />}
                                    >
                                        <img
                                            src={item.imgPath}
                                            alt={item.seoTitle}
                                            onClick={() => handleSubmenuClick(item.examplePath)}
                                            style={{ cursor: "pointer" }}
                                        />
                                    </Tooltip>
                                </div>
                                <h3 onClick={() => handleSubmenuClick(item.examplePath)}>{item.title}</h3>
                            </div>
                        ))}
                    </div>
                );
        }
    };

    const groupHeading = (group: GalleryItem) => (
        <div className={classes.showcasetitle}>
            <h2 id={group.id}>
                {`${group.chartGroupTitle} (${"items" in group ? group.items.length : 0} Demo${
                    "items" in group && group.items.length !== 1 ? "s" : ""
                })`}
            </h2>
        </div>
    );
    return (
        <div className="showcase-wrap">
            {examples.map((group, index) => (
                <div key={index}>
                    <div className={classes.showcaseheadingwrap}>
                        {groupHeading(group)}
                        {index === 0 && <GridSelection filterState={activeFilterState} />}
                    </div>
                    {"items" in group && group.items.length > 0 ? renderItems(group.items) : <p>No items available</p>}
                </div>
            ))}
        </div>
    );
};

export default GalleryItems;

import React, { useState, useEffect, useContext } from "react";
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

type TProps = {
    examples: GalleryItem[];
    currentMenuItems: any[];
};

const GalleryItems: React.FC<TProps> = (props) => {
    const navigate = useNavigate();
    const framework = useContext(FrameworkContext);
    const [groupedItems, setGroupedItems] = useState<any[]>([]);
    const [activeFilter, setActiveFilter] = useState<string>("filter1");

    const handleSubmenuClick = (path: string) => {
        navigate(`/${framework}/${path}`);
    };

    useEffect(() => {
        const groupItems = () => {
            const grouped = props.currentMenuItems.map((menuItem) => {
                const matchingExample = props.examples.find((example) =>
                    example.chartGroupTitle.includes(menuItem.item.name)
                );
                return matchingExample ? { ...menuItem, items: matchingExample.items } : menuItem;
            });
            setGroupedItems(grouped);
        };

        groupItems();
    }, [props.currentMenuItems, props.examples]);

    const renderItems = (items: any[], submenu: any[]) => {
        switch (activeFilter) {
            case "filter2":
                return (
                    <div className={`${classes.showcaserow} ${classes.tabmultiple}`}>
                        {items.map((item: any, idx: number) => (
                            <div className={classes.showcasecol} key={idx}>
                                <div className={classes.showcasethumb}>
                                    <img src={item.imgPath} alt={item.seoTitle} title={item.title} />
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
                                    <img src={item.imgPath} alt={item.seoTitle} title={item.title} />
                                </div>
                                <div className={classes.showcasecontent}>
                                    <h3>{item.title}</h3>
                                    <p>{submenu[idx]?.description || "No description available"}</p>
                                    <div className={classes.tabbtnwrap}>
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
                                        <img src={item.imgPath} alt={item.seoTitle} />
                                    </Tooltip>
                                </div>
                                <h3 onClick={() => handleSubmenuClick(item.examplePath)}>{item.title}</h3>
                            </div>
                        ))}
                    </div>
                );
        }
    };

    return (
        <div className="showcase-wrap">
            {groupedItems.map((group, index) => (
                <div key={index}>
                    <div className={classes.showcaseheadingwrap}>
                        <div className={classes.showcasetitle}>
                            <h2>
                                {`Featured Apps: ${group.item.name} (${group.items ? group.items.length : 0} Demo${
                                    group.items && group.items.length !== 1 ? "s" : ""
                                })`}
                            </h2>
                        </div>
                        {index === 0 && (
                            <div className={classes.showcasedisplay}>
                                <ul style={{ cursor: "pointer" }}>
                                    <li onClick={() => setActiveFilter("filter1")}>
                                        {activeFilter == "filter1" ? (
                                            <img src={filtericon} alt="Filter 2" />
                                        ) : (
                                            <img src={filtericon11} alt="Filter 2" />
                                        )}
                                    </li>
                                    <li onClick={() => setActiveFilter("filter2")}>
                                        {activeFilter == "filter2" ? (
                                            <img src={filtericon22} alt="Filter 2" />
                                        ) : (
                                            <img src={filtericon2} alt="Filter 2" />
                                        )}
                                    </li>
                                    <li onClick={() => setActiveFilter("filter3")}>
                                        {activeFilter == "filter3" ? (
                                            <img src={filtericon33} alt="Filter 2" />
                                        ) : (
                                            <img src={filtericon3} alt="Filter 2" />
                                        )}
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                    {group.items && group.items.length > 0 ? (
                        renderItems(group.items, group.submenu)
                    ) : (
                        <p>No items available</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default GalleryItems;

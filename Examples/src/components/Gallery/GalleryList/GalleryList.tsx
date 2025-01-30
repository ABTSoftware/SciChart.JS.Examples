import { useState } from "react";
import GalleryCard from "../GalleryCard";
import classes from "../Gallery.module.scss";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ComponentWrapper from "../../ComponentWrapper/ComponentWrapper";
import { GalleryItem } from "../../../helpers/types/types";

type TProps = {
    example: GalleryItem;
    length: number;
    slidersNumber: number;
    mostVisibleCategory?: string | null;
    setMostVisibleCategory?: (category: string) => void;
};

export default function GalleryList(props: TProps) {
    const [showAll, setShowAll] = useState(false);
    const slideWidth = (1 / props.slidersNumber) * 100;

    return (
        <ComponentWrapper>
            <div className={classes.ChartGroupHeader}>
                <div className={classes.ChartGroupTitle}>
                    <h6>{props.example.chartGroupTitle}</h6>
                    <span>{props.example.items.length}&nbsp;Demos</span>
                </div>
            </div>
            <ul className={classes.Gallery}>
                {props.example.items.map((item, itemIndex) => {
                    if (props.slidersNumber !== 1 || itemIndex === 0 || showAll) {
                        // Show all items if only one slider is visible
                        const key = item.title + item.imgPath;
                        return (
                            <li
                                key={key}
                                className={classes.GalleryItem}
                                style={{
                                    minWidth: `${slideWidth}%`,
                                    maxWidth: `${slideWidth}%`,
                                }}
                            >
                                <GalleryCard
                                    imgPath={item.imgPath}
                                    title={item.title}
                                    seoTitle={item.seoTitle}
                                    examplePath={item.examplePath}
                                />
                            </li>
                        );
                    }
                    return "";
                })}

                {props.example.items.length > 1 &&
                    (!showAll ? (
                        <button
                            className={classes.ShowAllButton}
                            onClick={() => {
                                setShowAll(true);
                            }}
                        >
                            Show All
                            <ArrowDropDownIcon />
                        </button>
                    ) : (
                        <button
                            className={classes.ShowAllButton}
                            onClick={() => {
                                setShowAll(false);
                            }}
                        >
                            Hide
                            <ArrowDropUpIcon />
                        </button>
                    ))}
            </ul>
        </ComponentWrapper>
    );
}

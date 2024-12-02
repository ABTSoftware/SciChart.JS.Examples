import { useState, useEffect, useRef } from "react";
import GalleryCard from "../GalleryCard";
import classes from "../Gallery.module.scss";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ComponentWrapper from "../../ComponentWrapper/ComponentWrapper";
import { GalleryItem } from "../../../helpers/types/types";
import { FrameworkContext } from "../../../helpers/shared/Helpers/FrameworkContext";
import { useContext } from "react";

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

    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!props.setMostVisibleCategory || !sectionRef.current) return () => {};
    
        const observer = new IntersectionObserver(
            (entries) => {
                // Track the visible area for all observed elements
                const visibilityMap = new Map<string, number>();
    
                entries.forEach((entry) => {
                    // Calculate the visible area in square pixels
                    const visibleArea =
                        entry.intersectionRect.width * entry.intersectionRect.height;
    
                    const category = props.example.chartGroupTitle;
                    if (category) {
                        visibilityMap.set(category, visibleArea);
                    }
                });
    
                // Find the component with the maximum visible area
                let mostVisible = null;
                let maxVisibleArea = 0;
    
                visibilityMap.forEach((visibleArea, category) => {
                    if (visibleArea > maxVisibleArea) {
                        mostVisible = category;
                        maxVisibleArea = visibleArea;
                    }
                });
    
                // Update the state only if the most visible changes
                if (mostVisible) {
                    props.setMostVisibleCategory(mostVisible);
                }
            },
            {
                root: null, // Observe relative to the viewport
                threshold: [0], // Trigger callback on any visibility change
            }
        );
    
        observer.observe(sectionRef.current);
    
        return () => {
            observer.disconnect();
        };
    }, [props.setMostVisibleCategory, props.example.chartGroupTitle]);    

    return (
        <ComponentWrapper>
            <div
                className={classes.ChartGroupHeader}
                ref={sectionRef}
            >
                <div className={classes.ChartGroupTitle}>
                    <h6>{props.example.chartGroupTitle}</h6>
                    <span>{props.example.items.length} Demos</span>
                </div>
            </div>
            <ul className={classes.Gallery}>
                {props.example.items.map((item, itemIndex) => {
                    if (props.slidersNumber !== 1 || itemIndex === 0 || showAll) { // Show all items if only one slider is visible
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

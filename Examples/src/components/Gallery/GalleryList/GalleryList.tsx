import * as React from "react";

import GalleryCard from "../GalleryCard";
import classes from "../Gallery.module.scss";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ComponentWrapper from "../../ComponentWrapper/ComponentWrapper";
import { GalleryItem } from "../../../helpers/types/types";
import { FrameworkContext } from "../../../helpers/shared/Helpers/FrameworkContext";
import { useContext } from "react";

type TProps = {
    example: GalleryItem;
    length: number;
    slidersNumber: number;
};
export default function GalleryList(props: TProps) {
    const [index, setIndex] = React.useState(0);
    const [showAll, setShowAll] = React.useState(false);
    const slideWidth = (1 / props.slidersNumber) * 100;
    const framework = useContext(FrameworkContext);
    const moveR = () => {
        if (index <= props.slidersNumber - props.example.items.length) {
            setIndex(0);
            return;
        }
        setIndex(index - 1);
    };
    const moveL = () => {
        if (index >= 0) {
            setIndex(props.slidersNumber - props.example.items.length);
            return;
        }
        setIndex(index + 1);
    };
    return (
        <ComponentWrapper>
            <div className={classes.ChartGroupHeader}>
                <div className={classes.ChartGroupTitle}>
                    <h6>{props.example.chartGroupTitle}</h6>
                    <span>{props.example.items.length} Demos</span>
                </div>

                {/*{props.slidersNumber < props.example.items.length && (*/}
                {/*    <div className={classes.CarouselButtons}>*/}
                {/*        <button className={classes.ButtonArrow} onClick={moveL}>*/}
                {/*            <ArrowBackIcon />*/}
                {/*        </button>*/}
                {/*        <button className={classes.ButtonArrow} onClick={moveR}>*/}
                {/*            <ArrowForwardIcon />*/}
                {/*        </button>*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>
            <ul className={classes.Gallery}>
                {props.example.items.map((item, itemIndex) => {
                    if (props.slidersNumber !== 1 || itemIndex === 0 || showAll) {
                        const key = item.title + item.imgPath;
                        return (
                            <li
                                key={key}
                                className={classes.GalleryItem}
                                style={{
                                    transform: `translateX(${index * 100}%)`,
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

import * as React from "react";
import { GalleryItem } from "../Gallery";
import GalleryCard from "../GalleryCard";
import classes from "../Gallery.module.scss";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
// Import Swiper styles

// import "swiper/swiper.scss";
type TProps = {
    example: GalleryItem;
    length: number;
    slidersNumber: number;
};
export default function GalleryList(props: TProps) {
    const [index, setIndex] = React.useState(0);
    const slideWidth = (1 / props.slidersNumber) * 100;

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
        <div className={classes.GalleryWrapper}>
            <div className={classes.ChartGroupHeader}>
                <div className={classes.ChartGroupTitle}>
                    <h6>{props.example.chartGroupTitle}</h6>
                    <span>{props.example.items.length} charts</span>
                </div>

                {props.slidersNumber < props.example.items.length && (
                    <div>
                        <button
                            className={classes.ButtonArrow}
                            onClick={() => {
                                moveL();
                            }}
                        >
                            <ArrowBackIcon />
                        </button>
                        <button
                            className={classes.ButtonArrow}
                            onClick={() => {
                                moveR();
                            }}
                        >
                            <ArrowForwardIcon />
                        </button>
                    </div>
                )}
            </div>
            <ul className={classes.Gallery}>
                {props.example.items.map(item => (
                    <li
                        key={item.title + item.imgPath}
                        className={classes.GalleryItem}
                        style={{
                            transform: `translateX(${index * 100}%)`,
                            minWidth: `${slideWidth}%`,
                            maxWidth: `${slideWidth}%`
                        }}
                    >
                        <GalleryCard
                            imgPath={item.imgPath}
                            title={item.title}
                            seoTitle={item.seoTitle}
                            examplePath={item.examplePath}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}

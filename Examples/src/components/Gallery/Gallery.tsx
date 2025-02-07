import * as React from "react";
import GalleryList from "./GalleryList/GalleryList";
import { useMediaQuery, useTheme } from "@mui/material"; // Use MUI's responsive hooks
import classes from "./Gallery.module.scss";
import { GalleryItem } from "../../helpers/types/types";

type TProps = {
    examples: GalleryItem[];
};

const Gallery: React.FC<TProps> = (props) => {
    const theme = useTheme();

    // Determine slider width based on screen size
    const isXs = useMediaQuery(theme.breakpoints.down("md")); // Mobile view
    const isSm = useMediaQuery(theme.breakpoints.only("sm")); // Small view
    const slidersWidth = isXs ? 1 : isSm ? 3 : 5; // Default to 5 for larger screens

    return (
        <div className={classes.GalleryContainer}>
            {props.examples.map((item: GalleryItem, index: number) => (
                <div
                    key={item.chartGroupTitle + index}
                    data-category={item.chartGroupTitle}
                >
                    <GalleryList
                        slidersNumber={slidersWidth}
                        example={item}
                        length={props.examples.length}
                    />
                </div>
            ))}
        </div>
    );
};

export default Gallery;

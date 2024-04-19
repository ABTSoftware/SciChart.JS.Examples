import * as React from "react";

import GalleryList from "./GalleryList/GalleryList";
import withWidth, { WithWidth } from "@material-ui/core/withWidth";
import classes from "./Gallery.module.scss";
import { GalleryItem } from "../../helpers/types/types";

type TProps = {
    examples: GalleryItem[];
};

const Gallery: React.FC<TProps & WithWidth> = (props) => {
    let slidersWidth = 5;
    if (props.width === "sm") {
        slidersWidth = 3;
    } else if (props.width === "xs") {
        slidersWidth = 1;
    }
    return (
        <div className={classes.GalleryContainer}>
            {props.examples.map((item: any, index: number) => {
                return (
                    <GalleryList
                        key={item.chartGroupTitle + index}
                        slidersNumber={slidersWidth}
                        example={item}
                        length={props.examples.length}
                    />
                );
            })}
        </div>
    );
};

export default withWidth()(Gallery);

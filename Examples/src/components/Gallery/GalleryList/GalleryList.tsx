import * as React from "react";
import { GalleryItem } from "../Gallery";
import GalleryCard from "../GalleryCard";
import classes from "../Gallery.module.scss";
import Slider from "react-slick";

type TProps = {
    example: GalleryItem;
    length: number;
};

const settings = {
    dots: true,
    infinite: true,

    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1
};
export default function GalleryList(props: TProps) {
    return (
        // <div className={classes.GalleryWrapper}>
        //     <div className={classes.ChartGroupHeader}>
        //         <div className={classes.ChartGroupTitle}>
        //             <h6>{props.example.chartGroupTitle}</h6>
        //             <span>{props.example.items.length} charts</span>
        //         </div>
        //         <div>
        //             <button>left</button>
        //             <button>right</button>
        //         </div>
        //     </div>
        //     <ul className={classes.Gallery}>
        <div className={classes.SliderWrapper1}>
            <Slider {...settings}>
                {props.example.items.map(item => (
                    <li className={classes.GalleryItem}>
                        <GalleryCard
                            imgPath={item.imgPath}
                            title={item.title}
                            seoTitle={item.seoTitle}
                            examplePath={item.examplePath}
                        />
                    </li>
                ))}
            </Slider>
        </div>
        //     </ul>
        // </div>
    );
}

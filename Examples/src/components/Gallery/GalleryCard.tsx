import * as React from "react";
import { useHistory, Link } from "react-router-dom";
import classes from "./Gallery.module.scss";
import {LazyLoadImage} from "react-lazy-load-image-component";

type TProps = {
    imgPath: string;
    title: string;
    seoTitle: string;
    examplePath: string;
};

const GalleryCard: React.FC<TProps> = props => {
    const history = useHistory();

    const { imgPath, title, seoTitle, examplePath } = props;

    return (
        <div className={classes.GalleryItemCard}>
            <Link className={classes.GalleryItemCardImage} to={examplePath} title={seoTitle}>
                {/*<img src={imgPath} title={seoTitle} alt={title}  />*/}
                <LazyLoadImage src={imgPath} title={seoTitle} alt={title}/>
                <h5 className={classes.GalleryItemTitle}>{title}</h5>
            </Link>
        </div>
    );
};

export default GalleryCard;

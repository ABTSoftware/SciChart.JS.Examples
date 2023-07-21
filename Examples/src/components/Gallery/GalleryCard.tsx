import * as React from "react";
import { useNavigate, Link } from "react-router-dom";
import classes from "./Gallery.module.scss";
import { Tooltip } from "@material-ui/core";

type TProps = {
    imgPath: string;
    title: string;
    seoTitle: string;
    examplePath: string;
};

const GalleryCard: React.FC<TProps> = props => {
    const history = useNavigate();

    const { imgPath, title, seoTitle, examplePath } = props;

    return (
        <div className={classes.GalleryItemCard}>
            <Link className={classes.GalleryItemCardImage} to={examplePath}>
                <Tooltip title={<img src={imgPath} width={600} height={600} alt={seoTitle} />}>
                    <img src={imgPath} data-title={seoTitle} alt={seoTitle} />
                </Tooltip>
                <h5 className={classes.GalleryItemTitle}>{title}</h5>
            </Link>
        </div>
    );
};

export default GalleryCard;

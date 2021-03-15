import * as React from "react";
import { useHistory } from "react-router-dom";
import classes from "./Gallery.module.scss";

type TProps = {
    imgPath: string;
    title: string;
    seoTitle: string;
    examplePath: string;
};

const GalleryCard: React.FC<TProps> = props => {
    const history = useHistory();

    const { imgPath, title, seoTitle, examplePath } = props;

    const handleClick = (path: string) => (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        history.push(path);
    };

    const handleClickLink = (e: any) => {
        e.preventDefault();
    };
    return (
        <div className={classes.GalleryItemCard}>
            <a className={classes.GalleryItemCardImage} href={examplePath} title={seoTitle} onClick={handleClickLink}>
                <img src={imgPath} title={seoTitle} alt={title} onClick={handleClick(examplePath)} />
            </a>
            <h5 className={classes.GalleryItemTitle}>{title}</h5>
        </div>
    );
};

export default GalleryCard;

import { FC } from "react";
import { Link } from "react-router";
import classes from "./Gallery.module.scss";
import { Tooltip } from "@mui/material";
import { ThemedImage } from "../ThemedImage/ThemedImage";
import { _useContext } from "../../helpers/shared/Helpers/Context";

type TProps = {
    imgPath: string;
    title: string;
    seoTitle: string;
    examplePath: string;
};

const GalleryCard: FC<TProps> = (props) => {
    const { state } = _useContext();
    const framework = state.framework;
    const { imgPath, title, seoTitle, examplePath } = props;

    return (
        <div className={classes.GalleryItemCard}>
            <Link className={classes.GalleryItemCardImage} to={`/${framework}/${examplePath}`}>
                <Tooltip title={<ThemedImage src={imgPath} width={600} height={600} alt={seoTitle} />}>
                    <ThemedImage src={imgPath} data-title={seoTitle} alt={seoTitle} />
                </Tooltip>
                <h5 className={classes.GalleryItemTitle}>{title}</h5>
            </Link>
        </div>
    );
};

export default GalleryCard;

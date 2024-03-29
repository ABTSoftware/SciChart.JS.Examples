import { FC, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import classes from "./Gallery.module.scss";
import { Tooltip } from "@material-ui/core";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";

type TProps = {
    imgPath: string;
    title: string;
    seoTitle: string;
    examplePath: string;
};

const GalleryCard: FC<TProps> = (props) => {
    const framework = useContext(FrameworkContext);
    const history = useNavigate();

    const { imgPath, title, seoTitle, examplePath } = props;

    return (
        <div className={classes.GalleryItemCard}>
            <Link className={classes.GalleryItemCardImage} to={`/${framework}/${examplePath}`}>
                <Tooltip title={<img src={imgPath} width={600} height={600} alt={seoTitle} />}>
                    <img src={imgPath} data-title={seoTitle} alt={seoTitle} />
                </Tooltip>
                <h5 className={classes.GalleryItemTitle}>{title}</h5>
            </Link>
        </div>
    );
};

export default GalleryCard;

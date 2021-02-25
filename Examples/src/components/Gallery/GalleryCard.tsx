import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { useHistory } from "react-router-dom";
import classes from "./Gallery.module.scss";

type TProps = {
    imgPath: string;
    title: string;
    seoTitle: string;
    examplePath: string;
};

const useStyles = makeStyles(theme => ({
    paper: {
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
        "&:hover": {
            cursor: "pointer"
        }
    }
}));

const GalleryCard: React.FC<TProps> = props => {
    const classes1 = useStyles();
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
            <a href={examplePath} title={seoTitle} onClick={handleClickLink}>
                <img
                    style={{ maxWidth: "100%", display: "block" }}
                    src={imgPath}
                    title={seoTitle}
                    alt={seoTitle}
                    onClick={handleClick(examplePath)}
                />
            </a>
            <h5 className={classes.GalleryItemTitle}>{title}</h5>
        </div>
    );
};

export default GalleryCard;

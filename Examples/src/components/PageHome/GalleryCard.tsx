import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";

type TProps = {
    imgPath: string;
    title: string;
    seoTitle: string;
    examplePath: string;
};

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
        "&:hover": {
            cursor: "pointer",
        },
    },
}));

const GalleryCard: React.FC<TProps> = (props) => {
    const classes = useStyles();
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
        <Paper className={classes.paper}>
            <a href={examplePath} title={seoTitle} onClick={handleClickLink}>
                <img
                    style={{ maxWidth: "100%", display: "block" }}
                    src={imgPath}
                    title={seoTitle}
                    alt={seoTitle}
                    onClick={handleClick(examplePath)}
                />
            </a>
            <Typography variant="h5" gutterBottom style={{ textAlign: "center", marginBottom: 0 }}>
                {title}
            </Typography>
        </Paper>
    );
};

export default GalleryCard;

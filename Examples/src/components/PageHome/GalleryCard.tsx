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
    const classes = useStyles();
    const history = useHistory();

    const { imgPath, title, seoTitle, examplePath } = props;

    const handleClick = (path: string) => () => {
        history.push(path);
    };
    return (
        <Paper className={classes.paper} onClick={handleClick(examplePath)}>
            <a href={examplePath}>
                <img style={{ maxWidth: "100%", display: "block" }} src={imgPath} title={seoTitle} alt={seoTitle} />
            </a>
            <Typography variant="h5" gutterBottom style={{ textAlign: "center", marginBottom: 0 }}>
                {title}
            </Typography>
        </Paper>
    );
};

export default GalleryCard;

import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";

type TProps = {
    title: string;
};

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(4),
        paddingLeft: theme.spacing(1)
    }
}));

const ChartGroupTitle: React.FC<TProps> = props => {
    const classes = useStyles();
    const history = useHistory();

    const { title } = props;

    return (
        <Typography className={classes.root} variant="h4" gutterBottom>
            {title}
        </Typography>
    );
};

export default ChartGroupTitle;

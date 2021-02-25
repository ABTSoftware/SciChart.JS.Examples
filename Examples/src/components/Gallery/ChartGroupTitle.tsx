import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import classes from "./Gallery.module.scss";

type TProps = {
    title: string;
};

const ChartGroupTitle: React.FC<TProps> = props => {
    const { title } = props;

    return <div className={classes.ChartGroupTitle}>{title}</div>;
};

export default ChartGroupTitle;

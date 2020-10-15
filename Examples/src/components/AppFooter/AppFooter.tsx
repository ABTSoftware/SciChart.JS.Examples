import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { FOOTER_LINKS } from "./GENERATED_FOOTER_LINKS";

export type TFooterlink = {
    link: string;
    text: string;
};

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(2),
        overflow: "hidden",
        backgroundColor: "#4caf50EE"
    },
    linksBlock: {
        width: "100%",
        overflow: "hidden"
    },
    link: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        float: "left",
        "& a": {
            color: "white",
            textDecoration: "none",
            fontSize: 14,
            "&:hover": {
                textDecoration: "underline"
            }
        }
    },
    sitemap: {
        marginTop: theme.spacing(1),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        "& a": {
            color: "grey",
            textDecoration: "none",
        }
    }
}));

export default function AppFooter() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.linksBlock}>
                {FOOTER_LINKS.map(el => (
                    <div key={el.link} className={classes.link}>
                        <a href={el.link}>{el.text}</a>
                    </div>
                ))}
            </div>
            <div className={classes.sitemap}>
                <a href="/sitemap.xml">Sitemap</a>
            </div>
        </div>
    );
}

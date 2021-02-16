import * as React from "react";
import List from "@material-ui/core/List";
import { makeStyles } from "@material-ui/core/styles";
import { TMenuItem } from "../AppRouter/examples";
import Typography from "@material-ui/core/Typography";
import { Box, Grid, Link } from "@material-ui/core";

type TProps = {
    historyPushPath: (path: string) => void;
    title: string;
    menuItems: TMenuItem[];
    menuItemsId: string;
};

const useStyles = makeStyles(theme => ({
    listItemText: {
        marginLeft: theme.spacing(1),

        color: "#BAC0C6"
    },
    listItemText2: {
        marginLeft: theme.spacing(2),
        fontSize: "0.875rem",

        color: "#BAC0C6",
        cursor: "pointer",
        "& a": {
            textDecoration: "none",
            pointerEvents: "none",
            cursor: "default"
        }
    },
    listItems: {
        width: "33.3%",

        [theme.breakpoints.down("xs")]: {
            width: "100%"
        }
    },
    divider: {
        position: "relative",
        borderBottom: "1px solid #2C353D"
    },
    dividerBox: {
        position: "absolute",
        left: "0",
        width: "30px",
        height: "3px",
        backgroundColor: "#67AC5B"
    }
}));

const FooterGrid: React.FC<TProps> = props => {
    const classes = useStyles();

    const { historyPushPath, title, menuItems } = props;

    return (
        <Box mb={3}>
            <Box mb={2}>
                <Typography variant="h5">{title}</Typography>
                <div className={classes.divider}>
                    <div className={classes.dividerBox}></div>
                </div>
            </Box>

            <Grid container direction="row" alignItems="flex-start">
                {menuItems.map(el => (
                    <div className={classes.listItems} key={el.item.id}>
                        <div>
                            <div className={classes.listItemText}>
                                <Typography variant="h6">{el.item.name}</Typography>
                            </div>

                            <Box mb={1}>
                                <List component="div" disablePadding>
                                    {el.submenu.map(subEl => (
                                        <Link
                                            key={subEl.id}
                                            onClick={() => historyPushPath(subEl.path)}
                                            title={subEl.title}
                                        >
                                            <Typography variant="body1" className={classes.listItemText2} gutterBottom>
                                                {subEl.title}
                                            </Typography>
                                        </Link>
                                    ))}
                                </List>
                            </Box>
                        </div>
                    </div>
                ))}
            </Grid>
        </Box>
    );
};

export default FooterGrid;

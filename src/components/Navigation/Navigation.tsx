import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import * as React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { DEFAULT_EXPENDED_MENU_ITEMS, MENU_ITEMS } from "../AppRouter/examples";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        header: {
            marginLeft: theme.spacing(2)
        },
        root: {
            width: "100%",
            maxWidth: 360,
            backgroundColor: theme.palette.background.paper
        },
        nested: {
            paddingLeft: theme.spacing(4)
        }
    })
);

export default function Navigation() {
    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const [isOpened, setIsOpened] = React.useState<Record<string, boolean>>(DEFAULT_EXPENDED_MENU_ITEMS);

    const handleExpandClick = (id: string) => () => {
        setIsOpened({ ...isOpened, [id]: !isOpened[id] });
    };

    const handleExampleClick = (path: string) => () => {
        if (!path) return;
        history.push(path);
    };

    return (
        <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
                <Typography className={classes.header} variant="h5" gutterBottom>
                    Examples
                </Typography>
            }
            className={classes.root}
        >
            {MENU_ITEMS.map(el => (
                <React.Fragment key={el.item.id}>
                    <ListItem button onClick={() => history.push("/")} selected={location.pathname === "/"}>
                        <ListItemText primary="Homepage" />
                    </ListItem>
                    <ListItem button onClick={handleExpandClick(el.item.id)}>
                        <ListItemText primary={el.item.name} />
                        {isOpened[el.item.id] ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={isOpened[el.item.id]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {el.submenu.map(subEl => (
                                <ListItem
                                    key={subEl.id}
                                    selected={location.pathname === subEl.path}
                                    button
                                    className={classes.nested}
                                    onClick={handleExampleClick(subEl.path)}
                                >
                                    <ListItemText primary={subEl.title} primaryTypographyProps={{ variant: "body2" }} />
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                </React.Fragment>
            ))}
        </List>
    );
}

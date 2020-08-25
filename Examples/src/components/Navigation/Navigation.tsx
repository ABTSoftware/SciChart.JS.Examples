import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import * as React from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
    MENU_ITEMS_2D,
    MENU_ITEMS_3D,
    MENU_ITEMS_2D_ID,
    MENU_ITEMS_3D_ID,
    getParentMenuIds
} from "../AppRouter/examples";
import { makeStyles } from "@material-ui/core/styles";

type TProps = {
    onExpandClick: (id: string) => void;
    checkIsOpened: (id: string) => boolean;
    currentExampleId: string;
};

const useStyles = makeStyles((theme) => ({
    listItemText: {
        marginLeft: theme.spacing(1),
    },
    listItemText2: {
        marginLeft: theme.spacing(2),
    },
}));

const Navigation: React.FC<TProps> = (props) => {
    const { onExpandClick, checkIsOpened, currentExampleId } = props;

    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();

    const handleExampleClick = (path: string) => () => {
        if (!path) return;
        history.push(path);
    };

    return (
        <List component="nav" aria-labelledby="nested-list-subheader">
            <ListItem button onClick={() => history.push("/")} selected={location.pathname === "/"}>
                <ListItemText primary="Homepage" />
            </ListItem>
            <ListItem button onClick={() => onExpandClick(MENU_ITEMS_2D_ID)}>
                <ListItemText primary="2D Charts" />
                {/*{isOpened[MENU_ITEMS_2D_ID] ? <ExpandLess /> : <ExpandMore />}*/}
            </ListItem>
            <Collapse in={checkIsOpened(MENU_ITEMS_2D_ID)} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {MENU_ITEMS_2D.map((el) => (
                        <React.Fragment key={el.item.id}>
                            <ListItem button onClick={() => onExpandClick(el.item.id)}>
                                <ListItemText className={classes.listItemText} primary={el.item.name} />
                                {/*{isOpened[el.item.id] ? <ExpandLess /> : <ExpandMore />}*/}
                            </ListItem>
                            <Collapse in={checkIsOpened(el.item.id)} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {el.submenu.map((subEl) => (
                                        <ListItem
                                            key={subEl.id}
                                            selected={location.pathname === subEl.path}
                                            button
                                            onClick={handleExampleClick(subEl.path)}
                                        >
                                            <ListItemText
                                                className={classes.listItemText2}
                                                primary={subEl.title}
                                                primaryTypographyProps={{ variant: "body2" }}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        </React.Fragment>
                    ))}
                </List>
            </Collapse>
        </List>
    );
};

export default Navigation;

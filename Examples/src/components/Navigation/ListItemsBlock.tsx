import * as React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";
import { TMenuItem } from "../AppRouter/examples";
import { useLocation } from "react-router-dom";
import MenuListItemText from "../shared/MenuListItemText/MenuListItemText";
import Typography from "@material-ui/core/Typography";

type TProps = {
    onExpandClick: (id: string) => void;
    checkIsOpened: (id: string) => boolean;
    historyPushPath: (path: string) => void;
    title: string;
    menuItems: TMenuItem[];
    menuItemsId: string;
};

const useStyles = makeStyles(theme => ({
    listItemText: {
        marginLeft: theme.spacing(1)
    },
    listItemText2: {
        marginLeft: theme.spacing(2),
        fontSize: "0.875rem",
        "& a": {
            textDecoration: "none",
            color: "rgba(0, 0, 0, 0.87)",
            pointerEvents: "none",
            cursor: "default"
        }
    }
}));

const ListItemsBlock: React.FC<TProps> = props => {
    const classes = useStyles();
    const location = useLocation();

    const { onExpandClick, checkIsOpened, historyPushPath, title, menuItems, menuItemsId } = props;

    return (
        <React.Fragment>
            <ListItem button onClick={() => onExpandClick(menuItemsId)}>
                <MenuListItemText text={title} />
                {/*{isOpened[MENU_ITEMS_2D_ID] ? <ExpandLess /> : <ExpandMore />}*/}
            </ListItem>
            <Collapse in={checkIsOpened(menuItemsId)} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {menuItems.map(el => (
                        <React.Fragment key={el.item.id}>
                            <ListItem button onClick={() => onExpandClick(el.item.id)}>
                                <div className={classes.listItemText}>
                                    <MenuListItemText text={el.item.name} />
                                </div>
                                {/*{isOpened[el.item.id] ? <ExpandLess /> : <ExpandMore />}*/}
                            </ListItem>
                            <Collapse in={checkIsOpened(el.item.id)} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {el.submenu.map(subEl => (
                                        <ListItem
                                            key={subEl.id}
                                            selected={location.pathname === subEl.path}
                                            button
                                            onClick={() => historyPushPath(subEl.path)}
                                        >
                                            <Typography className={classes.listItemText2} variant="body1" gutterBottom>
                                                <a href={subEl.path}>{subEl.title}</a>
                                            </Typography>
                                            {/*<ListItemText*/}
                                            {/*    className={classes.listItemText2}*/}
                                            {/*    primary={subEl.title}*/}
                                            {/*    primaryTypographyProps={{ variant: "body2" }}*/}
                                            {/*/>*/}
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        </React.Fragment>
                    ))}
                </List>
            </Collapse>
        </React.Fragment>
    );
};

export default ListItemsBlock;

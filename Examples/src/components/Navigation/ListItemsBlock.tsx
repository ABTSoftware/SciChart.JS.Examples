import * as React from "react";
import ListItem from "@material-ui/core/ListItem";
import Collapse from "@material-ui/core/Collapse";
import List from "@material-ui/core/List";
import { TMenuItem } from "../AppRouter/examples";
import { useLocation } from "react-router-dom";
import MenuListItemText from "../shared/MenuListItemText/MenuListItemText";
import classes from "./ListItemsBlock.module.scss";

type TProps = {
    onExpandClick: (id: string) => void;
    checkIsOpened: (id: string) => boolean;
    historyPushPath: (path: string) => void;
    title: string;
    menuItems: TMenuItem[];
    menuItemsId: string;
};

const ListItemsBlock: React.FC<TProps> = props => {
    const location = useLocation();

    const { onExpandClick, checkIsOpened, historyPushPath, title, menuItems, menuItemsId } = props;

    return (
        <React.Fragment>
            <ListItem button onClick={() => onExpandClick(menuItemsId)} className={classes.MenuListItem}>
                <MenuListItemText text={title} />
                {/*{isOpened[MENU_ITEMS_2D_ID] ? <ExpandLess /> : <ExpandMore />}*/}
            </ListItem>
            <Collapse in={checkIsOpened(menuItemsId)} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {menuItems.map(el => (
                        <React.Fragment key={el.item.id}>
                            <ListItem button onClick={() => onExpandClick(el.item.id)} className={classes.MenuListItem}>
                                <MenuListItemText text={el.item.name} className={classes.SecondLevelMenuListItemText} />
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
                                            <a  className={classes.ExampleLink} href={subEl.path} title={subEl.title}>
                                                {subEl.title}
                                            </a>
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

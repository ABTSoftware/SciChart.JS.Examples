import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import * as React from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
    MENU_ITEMS_2D,
    MENU_ITEMS_3D,
    MENU_ITEMS_FEATURED_APPS,
    MENU_ITEMS_2D_ID,
    MENU_ITEMS_3D_ID,
    MENU_ITEMS_FEATURED_APPS_ID,
} from "../AppRouter/examples";
import ListItemsBlock from "./ListItemsBlock";

type TProps = {
    onExpandClick: (id: string) => void;
    checkIsOpened: (id: string) => boolean;
};

const Navigation: React.FC<TProps> = (props) => {
    const { onExpandClick, checkIsOpened } = props;
    const history = useHistory();
    const location = useLocation();

    const historyPushPath = (path: string) => {
        if (!path) return;
        history.push(path);
    };

    return (
        <List component="nav" aria-labelledby="nested-list-subheader">
            <ListItem button onClick={() => history.push("/")} selected={location.pathname === "/"}>
                <ListItemText primary="Homepage" />
            </ListItem>
            <ListItemsBlock
                onExpandClick={onExpandClick}
                checkIsOpened={checkIsOpened}
                historyPushPath={historyPushPath}
                title="2D Charts"
                menuItems={MENU_ITEMS_2D}
                menuItemsId={MENU_ITEMS_2D_ID}
            />
            <ListItemsBlock
                onExpandClick={onExpandClick}
                checkIsOpened={checkIsOpened}
                historyPushPath={historyPushPath}
                title="3D Charts"
                menuItems={MENU_ITEMS_3D}
                menuItemsId={MENU_ITEMS_3D_ID}
            />
            <ListItemsBlock
                onExpandClick={onExpandClick}
                checkIsOpened={checkIsOpened}
                historyPushPath={historyPushPath}
                title="Featured Apps"
                menuItems={MENU_ITEMS_FEATURED_APPS}
                menuItemsId={MENU_ITEMS_FEATURED_APPS_ID}
            />
        </List>
    );
};

export default Navigation;

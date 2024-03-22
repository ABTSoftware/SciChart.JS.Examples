import { FC, useContext } from "react";
import List from "@material-ui/core/List";
import { useNavigate, useLocation } from "react-router-dom";
import {
    MENU_ITEMS_2D,
    MENU_ITEMS_3D,
    MENU_ITEMS_FEATURED_APPS,
    MENU_ITEMS_2D_ID,
    MENU_ITEMS_3D_ID,
    MENU_ITEMS_FEATURED_APPS_ID,
} from "../AppRouter/examples";
import ListItemsBlock from "./ListItemsBlock";
import classes from "./Navigation.module.scss";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";

type TProps = {
    onExpandClick: (id: string) => void;
    testIsOpened: (id: string) => boolean;
    toggleDrawer: () => void;
};

const Navigation: FC<TProps> = (props) => {
    const { onExpandClick, testIsOpened, toggleDrawer } = props;
    const navigate = useNavigate();
    const location = useLocation();
    const framework = useContext(FrameworkContext);
    const historyPushPath = (path: string) => {
        if (!path) return;
        navigate(path);
        toggleDrawer();
    };

    const historyPushHomepage = () => {
        navigate(`/${framework}`);
        toggleDrawer();
    };

    return (
        <List className={classes.NavigationList} component="nav" aria-labelledby="nested-list-subheader">
            <div
                className={
                    location.pathname === `/${framework}` ? classes.SelectedHomepageListItem : classes.HomepageListItem
                }
                onClick={historyPushHomepage}
            >
                Homepage
            </div>
            <ListItemsBlock
                onExpandClick={onExpandClick}
                checkIsOpened={testIsOpened}
                historyPushPath={historyPushPath}
                title="Featured Apps"
                menuItems={MENU_ITEMS_FEATURED_APPS}
                menuItemsId={MENU_ITEMS_FEATURED_APPS_ID}
            />
            <ListItemsBlock
                onExpandClick={onExpandClick}
                checkIsOpened={testIsOpened}
                historyPushPath={historyPushPath}
                title="2D Charts"
                menuItems={MENU_ITEMS_2D}
                menuItemsId={MENU_ITEMS_2D_ID}
            />
            <ListItemsBlock
                onExpandClick={onExpandClick}
                checkIsOpened={testIsOpened}
                historyPushPath={historyPushPath}
                title="3D Charts"
                menuItems={MENU_ITEMS_3D}
                menuItemsId={MENU_ITEMS_3D_ID}
            />
        </List>
    );
};

export default Navigation;

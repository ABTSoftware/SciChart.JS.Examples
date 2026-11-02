import { useNavigate, useLocation } from "react-router";
import {
    MENU_ITEMS_2D,
    MENU_ITEMS_3D,
    MENU_ITEMS_FEATURED_APPS,
    MENU_ITEMS_2D_ID,
    MENU_ITEMS_3D_ID,
    MENU_ITEMS_FEATURED_APPS_ID,
} from "../AppRouter/examples";
import ListItemsBlock from "./ListItemsBlock";
import { _useContext } from "../../helpers/shared/Helpers/Context";

const Navigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = _useContext();
    const framework = state.framework;
    const historyPushHomepage = () => {
        navigate(`/${framework}`);
    };

    return (
        <nav className="sc-app-navigation" aria-label="Examples">
            <div
                className={
                    location.pathname === `/${framework}`
                        ? "sc-app-navigation-selected-homepage-list-item"
                        : "sc-app-navigation-homepage-list-item"
                }
                onClick={historyPushHomepage}
            >
                Homepage
            </div>
            <ListItemsBlock
                title="Featured Apps"
                menuItems={MENU_ITEMS_FEATURED_APPS}
                menuItemsId={MENU_ITEMS_FEATURED_APPS_ID}
            />
            <ListItemsBlock title="2D Charts" menuItems={MENU_ITEMS_2D} menuItemsId={MENU_ITEMS_2D_ID} />
            <ListItemsBlock title="3D Charts" menuItems={MENU_ITEMS_3D} menuItemsId={MENU_ITEMS_3D_ID} />
        </nav>
    );
};

export default Navigation;

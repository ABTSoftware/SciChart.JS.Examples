import CloseIcon from "@mui/icons-material/Close";
import Navigation from "../Navigation/Navigation";
import { NavigationProvider } from "../Navigation/NavigationContext";
import Search from "../Search/Search";

const DrawerContent = ({ mostVisibleCategory, onClose }: { mostVisibleCategory?: string; onClose?: () => void }) => (
    <NavigationProvider mostVisibleCategory={mostVisibleCategory}>
        <div className="sc-app-drawer-content">
            {onClose ? (
                <div className="sc-app-drawer-top">
                    <Search />
                    <button
                        type="button"
                        className="sc-button sc-button-icon"
                        onClick={onClose}
                        aria-label="Close navigation"
                    >
                        <CloseIcon />
                    </button>
                </div>
            ) : (
                <Search />
            )}
            <hr className="sc-app-drawer-divider" />
            <Navigation />
        </div>
    </NavigationProvider>
);

export default DrawerContent;

import Navigation from "../Navigation/Navigation";
import { NavigationProvider } from "../Navigation/NavigationContext";
import Search from "../Search/Search";

const DrawerContent = ({ mostVisibleCategory }: { mostVisibleCategory?: string }) => (
    <NavigationProvider mostVisibleCategory={mostVisibleCategory}>
        <div className="sc-app-drawer-content">
            <Search />
            <hr className="sc-app-drawer-divider" />
            <Navigation />
        </div>
    </NavigationProvider>
);

export default DrawerContent;

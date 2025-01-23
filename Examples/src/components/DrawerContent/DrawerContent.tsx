import { FC, useContext } from "react";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Navigation from "../Navigation/Navigation";
import { Link } from "react-router";
import classes from "./DrawerContent.module.scss";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";
import Search from "../Search/Search";
import { EPageFramework } from "../../helpers/shared/Helpers/frameworkParametrization";
import { useMediaQuery } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { TExamplePage } from "../AppRouter/examplePages";

// tslint:disable-next-line:no-var-requires
const APP_VERSION = require("../../../package.json").dependencies.scichart;

type TProps = {
    testIsOpened: (id: string) => boolean;
    toggleOpenedMenuItem: (id: string) => void;
    toggleDrawer: () => void;
    currentExample: TExamplePage;
    mostVisibleCategory?: string;
};

const FrameworkSVG = {
    [EPageFramework.React]: (
        <svg height={30} width={30} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
            <path
                fill="#00bcd4"
                d="M16 12c7.444 0 12 2.59 12 4s-4.556 4-12 4-12-2.59-12-4 4.556-4 12-4m0-2c-7.732 0-14 2.686-14 6s6.268 6 14 6 14-2.686 14-6-6.268-6-14-6Z"
            />
            <path fill="#00bcd4" d="M16 14a2 2 0 1 0 2 2 2 2 0 0 0-2-2Z" />
            <path
                fill="#00bcd4"
                d="M10.458 5.507c2.017 0 5.937 3.177 9.006 8.493 3.722 6.447 3.757 11.687 2.536 12.392a.9.9 0 0 1-.457.1c-2.017 0-5.938-3.176-9.007-8.492C8.814 11.553 8.779 6.313 10 5.608a.903.903 0 0 1 .458-.1m-.001-2A2.871 2.871 0 0 0 9 3.875C6.13 5.532 6.938 12.304 10.804 19c3.284 5.69 7.72 9.493 10.74 9.493A2.87 2.87 0 0 0 23 28.124c2.87-1.656 2.062-8.428-1.804-15.124-3.284-5.69-7.72-9.493-10.74-9.493Z"
            />
            <path
                fill="#00bcd4"
                d="M21.543 5.507a.9.9 0 0 1 .457.1c1.221.706 1.186 5.946-2.536 12.393-3.07 5.316-6.99 8.493-9.007 8.493a.9.9 0 0 1-.457-.1C8.779 25.686 8.814 20.446 12.536 14c3.07-5.316 6.99-8.493 9.007-8.493m0-2c-3.02 0-7.455 3.804-10.74 9.493C6.939 19.696 6.13 26.468 9 28.124a2.87 2.87 0 0 0 1.457.369c3.02 0 7.455-3.804 10.74-9.493C25.061 12.304 25.87 5.532 23 3.876a2.87 2.87 0 0 0-1.457-.369Z"
            />
        </svg>
    ),
    [EPageFramework.Angular]: (
        <svg height={30} width={30} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
                fill="#e53935"
                d="M9.87 2.5 3.022 5.666l.645 10.178zm4.26 0 6.202 13.344.645-10.178zM12 7.563l-2.451 5.964h4.906zm-3.73 8.959-.954 2.308L12 21.5l4.683-2.67-.953-2.308z"
            />
        </svg>
    ),
    [EPageFramework.Vanilla]: (
        <svg height={30} width={30} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="#ffd600" d="M6,42V6h36v36H6z"></path>
            <path
                fill="#000001"
                d="M29.538 32.947c.692 1.124 1.444 2.201 3.037 2.201 1.338 0 2.04-.665 2.04-1.585 0-1.101-.726-1.492-2.198-2.133l-.807-.344c-2.329-.988-3.878-2.226-3.878-4.841 0-2.41 1.845-4.244 4.728-4.244 2.053 0 3.528.711 4.592 2.573l-2.514 1.607c-.553-.988-1.151-1.377-2.078-1.377-.946 0-1.545.597-1.545 1.377 0 .964.6 1.354 1.985 1.951l.807.344C36.452 29.645 38 30.839 38 33.523 38 36.415 35.716 38 32.65 38c-2.999 0-4.702-1.505-5.65-3.368L29.538 32.947zM17.952 33.029c.506.906 1.275 1.603 2.381 1.603 1.058 0 1.667-.418 1.667-2.043V22h3.333v11.101c0 3.367-1.953 4.899-4.805 4.899-2.577 0-4.437-1.746-5.195-3.368L17.952 33.029z"
            ></path>
        </svg>
    ),
};

const DrawerContent: FC<TProps> = (props) => {
    const framework = useContext(FrameworkContext);
    const { testIsOpened, toggleOpenedMenuItem, toggleDrawer, currentExample } = props;

    // TODO md was changed by migration script.requires verification
    const isMedium = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

    return (
        <div className={classes.DrawerContent}>
            <div className={classes.DrawerTopSection}>
                <IconButton onClick={toggleDrawer} className={classes.CloseButton} aria-label="close-drawer-button">
                    <CloseIcon />
                </IconButton>
                <div className={classes.FrameworkSelect}>
                    {Object.values(EPageFramework).map((fw) => (
                        <Link
                            key={fw}
                            className={framework === fw ? classes.SelectedFramework : classes.Framework}
                            to={currentExample ? `${fw}/${currentExample.path}` : `/${fw}`}
                        >
                            {FrameworkSVG[fw]}
                        </Link>
                    ))}
                </div>
            </div>
            {(isMedium || true) && <Divider 
                sx={{ backgroundColor: "var(--border-color)" }}
            />}
            {(isMedium || true) && <Search />}
            <Navigation 
                testIsOpened={testIsOpened} 
                onExpandClick={toggleOpenedMenuItem} 
                toggleDrawer={toggleDrawer}
                mostVisibleCategory={props?.mostVisibleCategory}
            />
        </div>
    );
};

export default DrawerContent;

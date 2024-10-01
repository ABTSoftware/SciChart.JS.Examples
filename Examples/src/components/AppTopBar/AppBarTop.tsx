import { FC, useContext, useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import GitHubIcon from "@mui/icons-material/GitHub";
import CodeIcon from "@mui/icons-material/Code";
import BookIcon from "@mui/icons-material/Book";
import { makeStyles } from "@mui/styles";
import Search from "../Search/Search";
import classes from "./AppTopBar.module.scss";
import Logo from "../../images/scichart-logo-app-bar.svg";
import LogoSmall from "../../images/scichart-logo-app-bar-mobile.svg";
import { TExamplePage } from "../AppRouter/examplePages";
import npm from "./npm.svg";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";
import { getTitle, EPageFramework, FRAMEWORK_NAME } from "../../helpers/shared/Helpers/frameworkParametrization";
import { useNavigate } from "react-router-dom";
import { appTheme } from "../Examples/theme";

type TProps = {
    toggleDrawer: () => void;
    currentExample?: TExamplePage;
};

const useStyles = makeStyles((theme) => ({
    formControl: {
        minWidth: 200,
        width: 200,
        marginLeft: 10,
    },
    select: {
        color: "#97a0a8",
        background: "#030723",
        width: 200,
        paddingLeft: 10,
        "&.Mui-focused": {
            color: "#4a545b",
        },
        "&:hover": {
            background: "#4a545b",
            color: appTheme.ForegroundColor,
        },
    },
    label: {
        paddingLeft: 10,

        color: appTheme.ForegroundColor,
        "&.Mui-focused": {
            color: appTheme.ForegroundColor,
        },
    },
    selectIcon: {
        color: appTheme.ForegroundColor,
    },
    "MuiSelect-nativeInput": {
        width: "100%",
    },
}));

const AppBarTop: FC<TProps> = (props) => {
    const { toggleDrawer, currentExample } = props;
    const [isMobile, setIsMobile] = useState(false);
    const [availableFrameworks, setAvailableFrameworks] = useState<EPageFramework[]>([EPageFramework.React]);
    const selectedFramework = useContext(FrameworkContext);
    const navigate = useNavigate();
    const localClasses = useStyles();
    const baseGithubPath = "https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/Examples/src";
    const contextualGithub =
        currentExample?.filepath !== undefined
            ? baseGithubPath + "/components/Examples/" + currentExample.filepath
            : "https://github.com/ABTSoftware/SciChart.JS.Examples";
    const contextualGithubTitle =
        currentExample !== undefined
            ? `View source for ${getTitle(currentExample.title, selectedFramework)} on Github`
            : "Clone SciChart.js.examples on GitHub";
    const docLinks = currentExample?.documentationLinks;
    const contextualDocUrl =
        docLinks !== undefined && docLinks.length > 0
            ? docLinks[0].href
            : "https://www.scichart.com/javascript-chart-documentation";
    const contextualDocTitle =
        docLinks !== undefined && docLinks.length > 0 ? docLinks[0].title : "SciChart.js Documentation Home";

    useEffect(() => {
        setIsMobile(window.innerWidth <= 768);
    }, []);

    type TAvailableFrameworkVariants = {
        [key in EPageFramework]: string;
    };
    useEffect(() => {
        const fetchAvailableVariants = async (example: TExamplePage): Promise<TAvailableFrameworkVariants> => {
            const variantsUrl = `services/variants/${example.path}?framework=${selectedFramework}`;
            const response = await fetch(variantsUrl);
            const data = (await response.json()) as TAvailableFrameworkVariants;
            return data;
        };

        if (currentExample) {
            fetchAvailableVariants(currentExample).then((variants) => {
                const frameworks = Object.keys(variants).filter((key) => variants[key as EPageFramework]);
                setAvailableFrameworks([...(frameworks as EPageFramework[]), EPageFramework.React]);
            });
        }
    }, [currentExample]);

    const isFrameworkVariantAvailable = availableFrameworks?.includes(selectedFramework);

    const codeSandboxButton = currentExample ? (
        <Button
            //disabled={!isFrameworkVariantAvailable}
            rel="nofollow external"
            // className={
            //     isFrameworkVariantAvailable ? classes.PurpleButton : `${classes.PurpleButton} ${classes.DisabledButton}`
            // }
            className={classes.PurpleButton}
            href={`codesandbox/${currentExample.path}?codesandbox=1&framework=${
                isFrameworkVariantAvailable ? selectedFramework : EPageFramework.React
            }`}
            title={
                isFrameworkVariantAvailable
                    ? `Edit ${getTitle(currentExample.title, selectedFramework)} in CodeSandbox`
                    : `Sorry, we have not got ${FRAMEWORK_NAME[selectedFramework]} code for this example yet, so you will see react code instead, but the actual chart code is always the same. Contact support@scichart.com to request prioritisation of this example`
            }
            target="_blank"
        >
            <CodeIcon fontSize="small" /> &nbsp;Code Sandbox
        </Button>
    ) : null;

    return (
        <AppBar position="sticky" className={classes.AppBar}>
            <Toolbar className={classes.ToolBar}>
                <a href="https://demo.scichart.com/" title="SciChart Demo">
                    {isMobile ? (
                        <img className={classes.Logo} src={LogoSmall} alt="scichart-logo" />
                    ) : (
                        <img className={classes.Logo} src={Logo} alt="scichart-logo" />
                    )}
                </a>
                <Search />
                <div className={classes.FlexPlaceholder}></div>
                <Button
                    className={classes.BlueButton}
                    href="https://www.scichart.com/getting-started/scichart-javascript/"
                    target="_blank"
                    title="Get a FREE Community license"
                    style={{ color: "white" }}
                >
                    Get it FREE
                </Button>
                <Button
                    className={classes.PurpleButton}
                    href={contextualDocUrl}
                    title={contextualDocTitle}
                    target="_blank"
                    style={{ color: "white" }}
                >
                    <BookIcon fontSize="small" style={{ color: "white" }} />
                    &nbsp;Docs
                </Button>
                {codeSandboxButton}
                <a className={classes.GitHubLink} href={contextualGithub} title={contextualGithubTitle} target="_blank">
                    <GitHubIcon fontSize="small" />
                </a>
                <a
                    className={classes.NpmLink}
                    href="https://www.npmjs.com/package/scichart"
                    title="npmjs / SciChart"
                    target="_blank"
                >
                    <img src={npm} alt="Npm Logo" width={32} height={32} />
                </a>
                <IconButton
                    onClick={toggleDrawer}
                    edge="start"
                    className={classes.MenuButton}
                    color="inherit"
                    aria-label="menu"
                >
                    <MenuIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default AppBarTop;

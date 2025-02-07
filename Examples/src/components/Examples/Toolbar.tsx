import { useState, useContext } from "react";
import { makeStyles } from "tss-react/mui";
import { Theme } from "@mui/material/styles";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDial from "@mui/material/SpeedDial";
import DescriptionIcon from "@mui/icons-material/Description";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import CodeIcon from "@mui/icons-material/Code";
import GitHubIcon from "@mui/icons-material/GitHub";
import npmLogo from "../AppTopBar/npm.svg";
import { TExamplePage } from "../AppRouter/examplePages";
import { baseGithubPath } from "../../constants";
import { appTheme } from "./theme";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";
import { SciChartGroupContext } from "scichart-react";

const DocsActionButton = () => <DescriptionIcon></DescriptionIcon>;

const GitHubActionButton = () => <GitHubIcon />;

const NpmActionButton = () => <img src={npmLogo} alt="Npm Logo" width={32} height={32} />;

const CodeSandboxActionButton = () => <EditIcon></EditIcon>;

const ShowSourceActionButton = () => <CodeIcon></CodeIcon>;

const useStyles = makeStyles()((theme) => ({
    root: {},
    speedDial: {
        position: "absolute",
        top: 4,
        right: 8,
    },
    speedDialFab: {
        backgroundColor: appTheme.PaleBlue,
        border: "1px solid black",
        color: "white",
        opacity: 0.5,
        "&:hover": {
            backgroundColor: appTheme.MutedBlue,
            opacity: 1,
        },
    },
    actionButtonFab: {
        lineHeight: "1em",
        backgroundColor: appTheme.PaleBlue,
        border: "1px solid black",
        color: appTheme.ForegroundColor,
        "&:hover": {
            backgroundColor: appTheme.MutedBlue,
        },
    },
    fabIcon: {
        lineHeight: "1em",
        height: "unset",
        // width: "unset",
    },
    iconOpen: {
        // position: "relative",
        // transform: "unset",
        // opacity: 1,
    },                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           

    icon: {
        // position: "absolute",
        // top: "50%",
        // transform: "translate(-50%, -50%)",
        // "&:hover": {
        // opacity: 1,
        // },
    },

    actionLink: {
        color: "inherit",
    },
}));

export function InfoToolbar(props: { examplePage: TExamplePage }) {
    const framework = useContext(FrameworkContext);
    const chartGroupContext = useContext(SciChartGroupContext);
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const { classes } = useStyles();

    const { examplePage } = props;
    const documentationLinks = examplePage ? examplePage.documentationLinks : undefined;
    const githubUrl = examplePage ? "/components/Examples/" + examplePage.filepath : "";
    const fullGithubUrl = baseGithubPath + githubUrl;
    const exampleUrl = examplePage ? examplePage.path : "";

    if (!fullGithubUrl || !exampleUrl) {
        console.warn(`Missing URL for ${examplePage.title}!`);
    }
    const actions = [
        { icon: <DocsActionButton />, name: "Open documentation", href: documentationLinks[0]?.href },
        { icon: <NpmActionButton />, name: "SciChart at NPM", href: "https://www.npmjs.com/package/scichart" },
        { icon: <GitHubActionButton />, name: "View the example at GitHub", href: fullGithubUrl },
        {
            icon: <CodeSandboxActionButton />,
            name: "Edit the example at CodeSandbox",
            href: `codesandbox/${exampleUrl}?codesandbox=1&framework=${framework}`,
        },
        // { icon: <ShowSourceActionButton />, name: "ShowSourceIcon" }
    ];

    return (
        <SpeedDial
            className={classes.speedDial}
            classes={{ fab: classes.speedDialFab, root: classes.root }}
            open={isOpen}
            onClose={handleClose}
            onOpen={handleOpen}
            ariaLabel="SpeedDial"
            FabProps={{
                size: "medium",
            }}
            TransitionProps={{
                enter: false,
                exit: false,
            }}
            icon={
                <SpeedDialIcon
                    classes={{
                        root: classes.fabIcon,
                        iconOpen: classes.iconOpen,
                        icon: classes.icon,
                    }}
                    icon={<InfoIcon fontSize="large" />}
                />
            }
            direction={"left"}
        >
            {actions.map((action) => (
                <SpeedDialAction
                    classes={{
                        fab: classes.actionButtonFab,
                    }}
                    key={action.name}
                    icon={
                        <a className={classes.actionLink} href={action.href} target="_blank">
                            {action.icon}
                        </a>
                    }
                    tooltipTitle={action.name}
                    tooltipPlacement="bottom"
                    FabProps={{
                        size: "small",
                    }}
                />
            ))}
        </SpeedDial>
    );
}

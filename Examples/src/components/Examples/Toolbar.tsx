import { useState, useContext } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { SpeedDialIcon, SpeedDialAction, SpeedDial } from "@material-ui/lab";
import DescriptionIcon from "@material-ui/icons/Description";
import InfoIcon from "@material-ui/icons/Info";
import EditIcon from "@material-ui/icons/Edit";
import CodeIcon from "@material-ui/icons/Code";
import GitHubIcon from "@material-ui/icons/GitHub";
import npmLogo from "../AppTopBar/npm.svg";
import { TExamplePage } from "../AppRouter/examplePages";
import { baseGithubPath } from "../../constants";
import { appTheme } from "scichart-example-dependencies";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";

const DocsActionButton = () => <DescriptionIcon></DescriptionIcon>;

const GitHubActionButton = () => <GitHubIcon />;

const NpmActionButton = () => <img src={npmLogo} alt="Npm Logo" width={32} height={32} />;

const CodeSandboxActionButton = () => <EditIcon></EditIcon>;

const ShowSourceActionButton = () => <CodeIcon></CodeIcon>;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
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
            opacity: (props: any) => (props.isOpen ? 1 : 0.5),
            "&:hover": {
                backgroundColor: appTheme.MutedBlue,
                opacity: 1,
            },
        },
        actionButtonFab: {
            backgroundColor: appTheme.PaleBlue,
            border: "1px solid black",
            color: appTheme.ForegroundColor,
            "&:hover": {
                backgroundColor: appTheme.MutedBlue,
            },
        },
        fabIcon: {
            height: "unset",
            width: "unset",
        },
        iconOpen: {
            transform: "unset",
            opacity: 1,
        },
        icon: {
            position: "absolute",
            top: "50%",
            transform: "translate(-50%, -50%)",
            "&:hover": {
                opacity: 1,
            },
        },
        actionLink: {
            color: "inherit",
        },
    })
);

export function InfoToolbar(props: { examplePage: TExamplePage }) {
    const framework = useContext(FrameworkContext);
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const classes = useStyles({ isOpen });

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
            href: `codesandbox/${exampleUrl}?codesandbox=1`,
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
                    classes={{ root: classes.fabIcon, iconOpen: classes.iconOpen, icon: classes.icon }}
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

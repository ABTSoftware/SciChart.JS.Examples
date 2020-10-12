import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Title from "../Title/Title";
import SourceCode from "../SourceCode/SourceCode";
import sciChartLogoImg from "../../images/scichart-logo-making-impossible-projects-possible@2x.png";
import GettingStarted from "../GettingStarted/GettingStarted";
import Description from "../Description/Description";
import { makeStyles } from "@material-ui/core/styles";
import { TExamplePage } from "../AppRouter/examples";
import { HOME_PAGE_TITLE } from "../PageHome/PageHome";
import { updateGoogleTagManagerPage } from "../../utils/googleTagManager";

type TProps = {
    example: () => JSX.Element;
    currentExample: TExamplePage;
};

const useStyles = makeStyles(
    theme => ({
        root: {
            margin: theme.spacing(2)
        },
        sciChartLogo: {
            textAlign: "right",
            marginBottom: theme.spacing(2),
            [theme.breakpoints.down("sm")]: {
                display: "none"
            }
        },
        body: {
            display: "flex",
            fontFamily:
                "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol",
            [theme.breakpoints.down("sm")]: {
                display: "block"
            }
        },
        colMain: {
            flexBasis: 240,
            flexShrink: 0,
            flexGrow: 1,
            overflowX: "auto",
            marginBottom: theme.spacing(3)
        },
        colMainContent: {
            maxWidth: 900
        },
        colDescription: {
            flexBasis: 360,
            flexGrow: 0,
            flexShrink: 0,
            paddingLeft: theme.spacing(3),
            [theme.breakpoints.down("sm")]: {
                paddingLeft: 0
            },
            marginBottom: theme.spacing(3)
        },
        description: {
            marginBottom: theme.spacing(3)
        },
        title: {
            marginTop: theme.spacing(3)
        },
        subtitle: {
            marginBottom: 20
        }
    }),
    { index: 1 }
);

const ExamplesRoot: React.FC<TProps> = props => {
    const classes = useStyles();
    const { currentExample } = props;

    const ExampleComponent = props.example;

    const titleText = currentExample ? currentExample.title : HOME_PAGE_TITLE;
    const subtitleText = currentExample ? currentExample.subtitle() : undefined;
    const DescComponent: () => JSX.Element = currentExample?.description;
    const codeStr = currentExample ? currentExample.code : "";
    const githubUrl = currentExample ? currentExample.githubUrl : "";

    React.useEffect(() => {
        updateGoogleTagManagerPage();
        window.scrollTo(0, 0);
        window.Prism.highlightAll();
    }, []);

    return (
        <div className={classes.root}>
            <div className={classes.body}>
                <div className={classes.colMain}>
                    <div className={classes.colMainContent}>
                        <Typography variant="h5" variantMapping={{ h4: "h1" }} gutterBottom>
                            SciChart.js - High Performance Realtime Javascript Charts Examples Suite
                        </Typography>
                        <div className={classes.title}>
                            <Title title={titleText} />
                            <div className={classes.subtitle}>{subtitleText}</div>
                        </div>
                        <ExampleComponent />
                        {currentExample && <SourceCode code={codeStr} githubUrl={githubUrl} />}
                    </div>
                </div>
                <div className={classes.colDescription}>
                    <div className={classes.sciChartLogo}>
                        <img src={sciChartLogoImg} width={209} height={42} />
                    </div>
                    <GettingStarted />
                    {DescComponent && (
                        <div className={classes.description}>
                            <Description>
                                <DescComponent />
                            </Description>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExamplesRoot;

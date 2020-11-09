import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Title from "../Title/Title";
import SourceCode from "../SourceCode/SourceCode";
import sciChartLogoImg from "../../images/scichart-logo-making-impossible-projects-possible@2x.png";
import GettingStarted from "../GettingStarted/GettingStarted";
import Description from "../Description/Description";
import SeoTags from "../SeoTags/SeoTags";
import { makeStyles } from "@material-ui/core/styles";
import { TExamplePage } from "../AppRouter/examplePages";
import { HOME_PAGE_TITLE } from "../PageHome/PageHome";
import { updateGoogleTagManagerPage } from "../../utils/googleTagManager";
import { getExampleComponent } from "../AppRouter/examples";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";

type TProps = {
    // example: () => JSX.Element;
    examplePage: TExamplePage;
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
        },
        textGreen: {
            color: "#5CB85C"
        }
    }),
    { index: 1 }
);

const ExamplesRoot: React.FC<TProps> = props => {
    const classes = useStyles();
    const { examplePage } = props;

    const ExampleComponent = getExampleComponent(examplePage.id);

    const titleText = examplePage ? examplePage.title : HOME_PAGE_TITLE;
    const subtitleText = examplePage ? examplePage.subtitle() : undefined;
    const DescComponent: () => JSX.Element = examplePage?.description;
    const codeStr = examplePage ? examplePage.code : "";
    const githubUrl = examplePage ? examplePage.githubUrl : "";

    React.useEffect(() => {
        updateGoogleTagManagerPage();
        window.scrollTo(0, 0);
        window.Prism.highlightAll();
    }, []);

    const todoKeywords = titleText;
    const todoDescription = titleText;

    return (
        <div className={classes.root}>
            <SeoTags title={titleText} keywords={todoKeywords} description={todoDescription} />
            <div className={classes.body}>
                <div className={classes.colMain}>
                    <div className={classes.colMainContent}>
                        <p>SciChart.js - High Performance Realtime Javascript Charts Examples Suite</p>
                        <div className={classes.title}>
                            <Title title={titleText} />
                            <div className={classes.subtitle}>{subtitleText}</div>
                        </div>
                        <ExampleComponent />
                        {examplePage && <SourceCode code={codeStr} githubUrl={githubUrl} />}
                    </div>
                </div>
                <div className={classes.colDescription}>
                    <div className={classes.sciChartLogo}>
                        <img src={sciChartLogoImg} width={209} height={42} />
                    </div>
                    <div className={classes.description}>
                        <Typography variant="h5" variantMapping={{ h5: "p" }} gutterBottom>
                            <span className={classes.textGreen}>// </span>JavaScript Chart Examples
                        </Typography>
                        <p>
                            <em>
                                SciChart.js ships with ~40{" "}
                                <a href="https://demo.scichart.com">JavaScript Chart Examples</a> which you can browse,
                                play with, view the source code and see related documentation. All of this is possible
                                with the SciChart.js Examples Suite, which ships as part of the{" "}
                                <a href="https://www.scichart.com/downloads">SciChart.js SDK</a>
                            </em>
                        </p>
                        <ButtonGroup
                            style={{ marginTop: 0 }}
                            size="large"
                            color="primary"
                            aria-label="small outlined button group"
                        >
                            <Button href="https://www.scichart.com/downloads/" target="_blank">
                                Download the SDK
                            </Button>
                        </ButtonGroup>
                    </div>
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

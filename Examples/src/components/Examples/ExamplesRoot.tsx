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
import { ExampleStrings } from "./ExampleStrings";
import classes from "./Examples.module.scss";
import ComponentWrapper from "../ComponentWrapper/ComponentWrapper";

type TProps = {
    // example: () => JSX.Element;
    examplePage: TExamplePage;
};

const ExamplesRoot: React.FC<TProps> = props => {
    const { examplePage } = props;

    const ExampleComponent = getExampleComponent(examplePage.id);

    const titleText = examplePage ? examplePage.title : ExampleStrings.siteHomeTitle;
    const seoTitleText = titleText + ExampleStrings.exampleTitleSuffix;
    const subtitleText = examplePage ? examplePage.subtitle() : undefined;
    const DescComponent: () => JSX.Element = examplePage?.description;
    const SeeAlsoComponent: () => JSX.Element = examplePage?.seeAlso;
    const codeStr = examplePage ? examplePage.code : "";
    const githubUrl = examplePage ? examplePage.githubUrl : "";
    const seoDescription = examplePage ? examplePage.seoDescription : "";
    const seoKeywords = examplePage ? examplePage.seoKeywords : "";
    const basePath = process.env.PUBLIC_URL ?? "https://demo.scichart.com";
    const exampleImage = examplePage ? `${basePath}/images/${examplePage.thumbnailImage}` : undefined;
    const exampleUrl = examplePage ? examplePage.path : "";

    React.useEffect(() => {
        updateGoogleTagManagerPage();
        window.scrollTo(0, 0);
        window.Prism.highlightAll();
    }, []);

    return (
        <div className={classes.ExamplesRoot}>
            <SeoTags
                title={seoTitleText}
                keywords={seoKeywords}
                description={seoDescription}
                image={exampleImage}
                url={exampleUrl}
            />
            <div className={classes.Body}>
                <div className={classes.ColMain}>
                    <div className={classes.ColMainContent}>
                        <ComponentWrapper>
                            <div className={classes.ExampleDescription}>
                                <h5>JavaScript Chart Examples</h5>
                                <p className={classes.ExampleDescriptionText}>
                                    SciChart.js ships with ~40{" "}
                                    <a className={classes.ExampleDescriptionLink} href="https://demo.scichart.com">
                                        JavaScript Chart Examples
                                    </a>{" "}
                                    which you can browse, play with, view the source code and see related documentation.
                                    All of this is possible with the SciChart.js Examples Suite, which ships as part of
                                    the{" "}
                                    <a
                                        className={classes.ExampleDescriptionLink}
                                        href="https://www.scichart.com/downloads"
                                    >
                                        SciChart.js SDK
                                    </a>
                                </p>
                                <ButtonGroup
                                    className={classes.ExampleDescriptionButton}
                                    size="large"
                                    color="primary"
                                    aria-label="small outlined button group"
                                >
                                    <Button href="https://www.scichart.com/downloads/" target="_blank">
                                        Download the SDK
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </ComponentWrapper>

                        <ComponentWrapper>
                            <h4 className={classes.Title}>{titleText} </h4>

                            <div className={classes.ExampleWrapper}>
                                <div className={classes.Example}>
                                    <div style={{ maxWidth: 900 }}>
                                        <ExampleComponent />
                                    </div>
                                </div>

                                {/* {DescComponent && ( */}
                                <div className={classes.ExampleDescription}>
                                    <div className={classes.Subtitle}>{subtitleText}</div>
                                    {/* <Description> */}
                                    <DescComponent />
                                    {/* </Description> */}
                                </div>
                                {/* )} */}
                                {/* <div style={{ overflow: "scroll" }}> */}
                                {/* {examplePage && <SourceCode code={codeStr} githubUrl={githubUrl} />} */}
                                {/* </div> */}
                            </div>
                        </ComponentWrapper>
                        <SeeAlsoComponent />
                    </div>
                </div>
                {/* <div className={classes.ColDescription}>
                    <div className={classes.SciChartLogo}>
                        <img src={sciChartLogoImg} width={209} height={42} />
                    </div>

                    {DescComponent && (
                        <div className={classes.Description}>
                            <Description>
                                <DescComponent />
                            </Description>
                        </div>
                    )}
                </div> */}
            </div>
        </div>
    );
};

export default ExamplesRoot;

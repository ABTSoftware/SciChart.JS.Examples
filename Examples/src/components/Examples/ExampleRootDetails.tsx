import { useContext, FC, useState, useEffect } from "react";
import SeoTags from "../SeoTags/SeoTags";
import { TExamplePage } from "../AppRouter/examplePages";
import { updateGoogleTagManagerPage } from "../../utils/googleTagManager";
import { getExampleComponent } from "../AppRouter/examples";
import { ExampleStrings } from "./ExampleStrings";
import classes from "./styles/Examples.module.scss";
import ComponentWrapper from "../ComponentWrapper/ComponentWrapper";
import { GalleryItem } from "../../helpers/types/types";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";
import { getTitle } from "../../helpers/shared/Helpers/frameworkParametrization";

type TProps = {
    // example: () => JSX.Element;
    examplePage: TExamplePage;
    seeAlso: GalleryItem[];
};

const ExamplesRootDetails: FC<TProps> = (props) => {
    const { examplePage, seeAlso } = props;
    const framework = useContext(FrameworkContext);
    const ExampleComponent = getExampleComponent(examplePage.id);
    const seoTitleText = getTitle(examplePage.pageTitle, framework) + ExampleStrings.exampleGenericTitleSuffix;
    const seoDescription = examplePage ? getTitle(examplePage.metaDescription, framework) : "";
    const seoKeywords = examplePage ? examplePage.metaKeywords : "";
    const basePath = "https://demo.scichart.com";
    const exampleImage = examplePage ? `${basePath}/${examplePage.thumbnailImage}` : undefined;
    const exampleUrl = examplePage ? examplePage.path : "";

    useEffect(() => {
        updateGoogleTagManagerPage();
        window.scrollTo(0, 0);
        window.Prism?.highlightAll();
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
                <div className={classes.Example}>
                    <ExampleComponent />
                </div>
        </div>
    );
};

export default ExamplesRootDetails;

import { useContext, FC, useState, useEffect } from "react";
import SeoTags from "../SeoTags/SeoTags";
import { TExamplePage } from "../AppRouter/examplePages";
import { updateGoogleTagManagerPage } from "../../utils/googleTagManager";
import { getExampleComponent } from "../AppRouter/examples";
import { ExampleStrings } from "./ExampleStrings";
import commonClasses from "./styles/Examples.module.scss";
import ComponentWrapper from "../ComponentWrapper/ComponentWrapper";
import { GalleryItem } from "../../helpers/types/types";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";
import { getFrameworkContent } from "../../helpers/shared/Helpers/frameworkParametrization";

type TProps = {
    // example: () => JSX.Element;
    examplePage: TExamplePage;
    seeAlso: GalleryItem[];
};

const ExamplesRootDetails: FC<TProps> = (props) => {
    const { examplePage, seeAlso } = props;
    const framework = useContext(FrameworkContext);
    const ExampleComponent = getExampleComponent(examplePage.id);
    const seoTitleText =
        getFrameworkContent(examplePage.pageTitle, framework) + ExampleStrings.exampleGenericTitleSuffix;
    const seoDescription = examplePage ? getFrameworkContent(examplePage.metaDescription, framework) : "";
    const seoKeywords = examplePage ? examplePage.metaKeywords : "";
    const basePath = "https://scichart.com/demo";
    const exampleImage = examplePage ? examplePage.thumbnailImage : undefined;
    const exampleUrl = examplePage ? examplePage.path : "";

    useEffect(() => {
        updateGoogleTagManagerPage();
        window.scrollTo(0, 0);
        // window.Prism?.highlightAll();
    }, []);
    return (
        <div className={commonClasses.ExamplesRoot}>
            <SeoTags
                title={seoTitleText}
                keywords={seoKeywords}
                description={seoDescription}
                image={exampleImage}
                url={exampleUrl}
            />
            <div className={`${commonClasses.Example} AnExampleContainer`} style={{ height: "100%" }}>
                <ExampleComponent />
            </div>
        </div>
    );
};

export default ExamplesRootDetails;

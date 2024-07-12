import * as React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PageHome from "../PageHome/PageHome";
import { EXAMPLES_PAGES, TExamplePage } from "./examplePages";
import ExamplesRoot from "../Examples/ExamplesRoot";
import { getExampleComponent } from "./examples";
import classes from "../Examples/styles/Examples.module.scss";
import { GalleryItem } from "../../helpers/types/types";
import NoIndexTag from "../SeoTags/NoIndexTag";
import { InfoToolbar } from "../Examples/Toolbar";
import { FrameworkContext } from "../../helpers/shared/Helpers/FrameworkContext";
import { useContext } from "react";

type TProps = {
    currentExample: TExamplePage;
    isIFrame?: boolean;
    seeAlso: GalleryItem[];
};

const examplePagesKeys = Object.keys(EXAMPLES_PAGES);

const ExampleComponent = React.memo((props: { children: React.ReactNode; examplePage: TExamplePage }) => {
    return (
        <>
            <InfoToolbar examplePage={props.examplePage} />
            {props.children}
        </>
    );
});

export default function AppRouter(props: TProps) {
    const { currentExample, seeAlso, isIFrame = false } = props;
    const selectedFramework = useContext(FrameworkContext);

    if (isIFrame) {
        const ChartComponent = getExampleComponent(currentExample.id);

        return (
            <div className={classes.ExampleWrapperIFrame}>
                <NoIndexTag />
                <Routes>
                    {examplePagesKeys.map((key) => {
                        const exPage = EXAMPLES_PAGES[key];
                        return (
                            <Route
                                key={key}
                                path={`/iframe/${exPage.path}`}
                                element={
                                    <ExampleComponent examplePage={currentExample}>
                                        <ChartComponent />
                                    </ExampleComponent>
                                }
                            />
                        );
                    })}
                </Routes>
            </div>
        );
    } else {
        return (
            <Routes>
                {examplePagesKeys.map((key) => {
                    const exPage = EXAMPLES_PAGES[key];
                    return (
                        <Route
                            key={key}
                            path={`/${selectedFramework}?/${exPage.path}`}
                            element={<ExamplesRoot examplePage={currentExample} seeAlso={seeAlso} />}
                        />
                    );
                })}

                {currentExample ? (
                    <Route
                        path={`/javascript-${currentExample?.path}`}
                        element={<Navigate to={`/${selectedFramework}/${currentExample?.path}`} />}
                    />
                ) : null}

                <Route path={`/${selectedFramework}`} element={<PageHome />} />
            </Routes>
        );
    }
}

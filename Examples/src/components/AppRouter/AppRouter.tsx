import * as React from "react";
import { Switch, Route } from "react-router-dom";
import PageHome from "../PageHome/PageHome";
import { PAGES } from "./pages";
import { EXAMPLES_PAGES, TExamplePage } from "./examplePages";
import ExamplesRoot from "../Examples/ExamplesRoot";
import { getExampleComponent } from "./examples";
import classes from "../Examples/Examples.module.scss";
import {GalleryItem} from "../../helpers/types/types";
import NoIndexTag from "../SeoTags/NoIndexTag";
type TProps = {
    currentExample: TExamplePage;
    isIFrame?: boolean;
    seeAlso: GalleryItem[]
};

const examplePagesKeys = Object.keys(EXAMPLES_PAGES);

export default function AppRouter(props: TProps) {
    const { currentExample, seeAlso, isIFrame = false } = props;
    if (isIFrame) {
        const ExampleComponent = getExampleComponent(currentExample.id)
        const renderIFrameExample = () => <div className={classes.ExampleWrapperIFrame}><NoIndexTag/><ExampleComponent /></div>;
        return (
            <Switch>
                {examplePagesKeys.map(key => {
                    const exPage = EXAMPLES_PAGES[key];
                    return <Route key={key} path={`/iframe${exPage.path}`} render={renderIFrameExample} />;
                })}
            </Switch>
        );
    } else {
        return (
            <Switch>
                {examplePagesKeys.map(key => {
                    const exPage = EXAMPLES_PAGES[key];
                    return (
                        <Route
                            key={key}
                            path={exPage.path}
                            render={() => <ExamplesRoot examplePage={currentExample} seeAlso={seeAlso}  />}
                        />
                    );
                })}
                <Route path={PAGES.homapage.path} component={PageHome} />
            </Switch>
        );
    }
}

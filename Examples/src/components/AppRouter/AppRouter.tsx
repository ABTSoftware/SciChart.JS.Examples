import * as React from "react";
import { Switch, Route } from "react-router-dom";
import PageHome from "../PageHome/PageHome";
import { PAGES } from "./pages";
import { EXAMPLES_PAGES, TExamplePage } from "./examplePages";
import ExamplesRoot from "../Examples/ExamplesRoot";

type TProps = {
    currentExample: TExamplePage;
};

const examplePagesKeys = Object.keys(EXAMPLES_PAGES);

export default function AppRouter(props: TProps) {
    const { currentExample } = props;
    return (
        <Switch>
            {examplePagesKeys.map(key => {
                const exPage = EXAMPLES_PAGES[key];
                return (
                    <Route
                        key={key}
                        path={exPage.path}
                        render={() => <ExamplesRoot examplePage={currentExample} />}
                    />
                );
            })}
            <Route path={PAGES.homapage.path} component={PageHome} />
        </Switch>
    );
}

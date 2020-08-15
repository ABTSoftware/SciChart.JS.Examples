import * as React from "react";
import { Switch, Route } from "react-router-dom";
import PageHome from "../PageHome";
import { PAGES } from "./pages";
import { EXAMPLES_PAGES } from "./examples";

const examplePagesKeys = Object.keys(EXAMPLES_PAGES);

export default function AppRouter() {
    return (
        <Switch>
            {examplePagesKeys.map(key => {
                const exPage = EXAMPLES_PAGES[key];
                const Component = exPage.Component;
                return (
                    <Route key={key} path={exPage.path} component={Component}/>
                );
            })}
            <Route path={PAGES.homapage.path} component={PageHome}/>
        </Switch>
    );
}

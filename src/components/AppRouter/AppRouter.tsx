import * as React from "react";
import { Switch, Route } from "react-router-dom";
import PageHome from "../PageHome";
import { PAGES } from "./pages";
import { EXAMPLES_PAGES } from "./examples";
import LineChart from "../Examples/Charts2D/BasicChartTypes/LineChart";
import BandSeriesChart from "../Examples/Charts2D/BasicChartTypes/BandSeriesChart";

const examplePagesKeys = Object.keys(EXAMPLES_PAGES);

export default function AppRouter() {
    return (
        <Switch>
            <Route exact path={PAGES.chart2D_basicCharts_LineChart.path}>
                <LineChart />
            </Route>
            <Route exact path={PAGES.chart2D_basicCharts_BandSeriesChart.path}>
                <BandSeriesChart />
            </Route>
            <Route path="/">
                <PageHome />
            </Route>
            {examplePagesKeys.map(key => {
                const exPage = EXAMPLES_PAGES[key];
                const Component = exPage.Component;
                return (
                    <Route key={key} exact path={exPage.path}>
                        <Component key={key} />
                    </Route>
                );
            })}
        </Switch>
    );
}

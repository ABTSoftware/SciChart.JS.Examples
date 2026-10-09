import { memo } from "react";
import { Routes, Route } from "react-router";
import { EXAMPLES_PAGES, TExamplePage } from "./examplePages";
import { getExampleComponent } from "./getExampleComponent";
import NoIndexTag from "../SeoTags/NoIndexTag";
import ChartControlWrapper from "./ChartControlWrapper";

type TProps = {
    currentExample: TExamplePage;
};

const examplePagesKeys = Object.keys(EXAMPLES_PAGES);

const ExampleComponent = memo(ChartControlWrapper);

export default function AppRouter(props: TProps) {
    const { currentExample } = props;

    const ChartComponent = getExampleComponent(currentExample.id);

    return (
        <div className="sc-app-iframe">
            <NoIndexTag />
            <Routes>
                {examplePagesKeys.map((key) => {
                    const exPage = EXAMPLES_PAGES[key];
                    return (
                        <Route
                            key={key}
                            path={`/iframe/${exPage.path}`}
                            element={
                                <ExampleComponent>
                                    <ChartComponent />
                                </ExampleComponent>
                            }
                        />
                    );
                })}
            </Routes>
        </div>
    );
}

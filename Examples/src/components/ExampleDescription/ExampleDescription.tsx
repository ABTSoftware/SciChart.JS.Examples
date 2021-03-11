import * as React from "react";
import classes from "./ExampleDescription.module.scss";
import { TSeeAlso } from "./ExampleDescriptionTypes";

type TProps = {
    seeAlso: TSeeAlso[];
    documentationLinks: any[];
    previewDescription: string;
    description: string;
    tips: string[];
};

export default function ExampleDescription(props: TProps) {
    return (
        <div>
            <div className={classes.ExampleInfoText}>
                <p>{props.previewDescription}</p>
                <p>{props.description}</p>
            </div>
            <div className={classes.Tips}>
                <h4>Tips!</h4>
                {props.tips.map((item, index) => (
                    <p key={index + item}>{item}</p>
                ))}
            </div>
            <div className={classes.Tips}>
                <h4>Documentation Links</h4>
                {/* <ul>
                    <li>
                        <a
                            href={ExampleStrings.urlDocumentationHome}
                            title={ExampleStrings.titleDocumentationHome}
                            target="_blank"
                        >
                            SciChart.js Documentation Home
                        </a>
                    </li>
                    <li>
                        <a
                            href={ExampleStrings.urlTutorialsHome}
                            title={ExampleStrings.titleTutorialsHome}
                            target="_blank"
                        >
                            SciChart.js Tutorials
                        </a>
                    </li>
                    <li>
                        <a
                            href={ExampleStrings.urlPerformanceTipsDocumentation}
                            target="_blank"
                            title={ExampleStrings.urlTitlePerformanceTipsDocumentation}
                        >
                            SciChart.js Performance Tips and Tricks
                        </a>
                    </li> 
                </ul>
                    */}
            </div>
            <h4>See Also</h4>
            <ul>
                {props.seeAlso.map((item, index) => {
                    return (
                        <li key={index + item.href}>
                            <a href={item.href} title={item.title}>
                                {item.exampleTitle}
                            </a>
                        </li>
                    );
                })}
                {/* <li>
                    <a
                        href={ExampleStrings.urlRealtimeJavaScriptChartDemo}
                        title={ExampleStrings.urlTitleRealtimeJavaScriptChartDemo}
                    >
                        Realtime JavaScript Chart Example
                    </a>
                </li>
                <li>
                    <a
                        href={ExampleStrings.urlRealtimeGhostedTracesDemo}
                        title={ExampleStrings.urlTitleRealtimeGhostedTracesDemo}
                    >
                        Realtime Ghosted Traces Example
                    </a>
                </li> */}
            </ul>
        </div>
    );
}

import * as React from "react";
import classes from "./ExampleDescription.module.scss";
import { TDocumentationLink } from "../../helpers/types/ExampleDescriptionTypes";
import { TDescriptionTemplate } from "../../helpers/shared/Helpers/frameworkParametrization";

type TProps = {
    documentationLinks: TDocumentationLink[];
    previewDescription?: string;
    description: TDescriptionTemplate;
    tips?: string[];
};

export default function ExampleDescription(props: TProps) {
    return (
        <div>
            {/*<div className={classes.ExampleInfoText}>*/}
            {/*    {props.previewDescription && <p>{props.previewDescription}</p>}*/}
            {/*    <p>{props.description}</p>*/}
            {/*</div>*/}
            {/*{props.tips && (*/}
            {/*    <div className={classes.UsefulLinksWrapper}>*/}
            {/*        <h4>Tips!</h4>*/}
            {/*        {props.tips.map((item, index) => (*/}
            {/*            <p key={index + item}>{item}</p>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*)}*/}
            {/*<div className={classes.UsefulLinksWrapper}>*/}
            {/*    <h4>Documentation Links</h4>*/}
            {/*    <ul>*/}
            {/*        {props.documentationLinks.map((item, index) => {*/}
            {/*            return (*/}
            {/*                <li key={index + item.href}>*/}
            {/*                    <a href={item.href} title={item.title}>*/}
            {/*                        {item.linkTitle}*/}
            {/*                    </a>*/}
            {/*                </li>*/}
            {/*            );*/}
            {/*        })}*/}
            {/*    </ul>*/}
            {/*</div>*/}
        </div>
    );
}

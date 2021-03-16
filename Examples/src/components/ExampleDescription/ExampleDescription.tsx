import * as React from "react";
import classes from "./ExampleDescription.module.scss";
import { TDocumentationLink, TSeeAlso } from "../../helpes/types/ExampleDescriptionTypes";
import Gallery from "../Gallery/Gallery";
import { GalleryItem } from "../../helpes/types/types";

type TProps = {
    seeAlso: GalleryItem[];
    documentationLinks: TDocumentationLink[];
    previewDescription?: string;
    description: string;
    tips: string[];
};

export default function ExampleDescription(props: TProps) {
    return (
        <div>
            <div className={classes.ExampleInfoText}>
                {props.previewDescription && <p>{props.previewDescription}</p>}
                <p>{props.description}</p>
            </div>
            <div className={classes.UsefulLinksWrapper}>
                <h4>Tips!</h4>
                {props.tips.map((item, index) => (
                    <p key={index + item}>{item}</p>
                ))}
            </div>
            <div className={classes.UsefulLinksWrapper}>
                <h4>Documentation Links</h4>
                <ul>
                    {props.documentationLinks.map((item, index) => {
                        return (
                            <li key={index + item.href}>
                                <a href={item.href} title={item.title}>
                                    {item.linkTitle}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* <ul>
                {props.seeAlso.map((item, index) => {
                    return (
                        <li key={index + item.href}>
                            <a href={item.href} title={item.title}>
                                {item.exampleTitle}
                            </a>
                        </li>
                    );
                })}
            </ul> */}
        </div>
    );
}

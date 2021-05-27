import * as React from "react";
import { TExampleInfo } from "../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../ExampleStrings";

import { TDocumentationLink } from "../../../../helpers/types/ExampleDescriptionTypes";

const description = ``;

const documentationLinks: TDocumentationLink[] = [];

const Subtitle = () => <p></p>;

export const webGLIssueChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleWebGLChart,
    path: ExampleStrings.urlWebGLChart,
    subtitle: Subtitle,
    documentationLinks,
    description,
    code,
    githubUrl,
    seoDescription: "",
    seoKeywords: ""
};

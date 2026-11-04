import React, { FC, ReactNode } from "react";
import { getFrameworkContent } from "../../helpers/shared/Helpers/frameworkParametrization";
import { _useContext } from "../../helpers/shared/Helpers/Context";
import { SandboxPlatform } from "../CodeSandbox/SandboxPlatform";
import { getSandboxUrl, getStackBlitzFiles } from "./sandboxUtils";
import { CodeActionButton } from "./CodeActionButton";
import type { StackBlitzResponse } from "../../helpers/types/types";

type CodeActionButtonsProps = {
    className?: string;
    onSandboxOpen: (
        platform: SandboxPlatform,
        sandboxId: string,
        projectFiles?: StackBlitzResponse
    ) => void;
};

export const CodeActionButtons: FC<CodeActionButtonsProps> = ({ className, onSandboxOpen }): ReactNode => {
    const {
        state: { currentExample, framework: selectedFramework },
    } = _useContext();
    const pageTitle = getFrameworkContent(currentExample.title, selectedFramework);

    const contextualGithubTitle =
        currentExample !== undefined
            ? `View source for ${pageTitle} on Github`
            : "Clone SciChart.js.examples on GitHub";

    const handleSandboxClick = async (e: React.MouseEvent<HTMLAnchorElement>, platform: SandboxPlatform) => {
        e.preventDefault();
        try {
            if (platform === SandboxPlatform.CodeSandbox) {
                const { id } = await getSandboxUrl(currentExample.path, selectedFramework, platform);
                if (id) {
                    onSandboxOpen(platform, id);
                } else {
                    console.log("error");
                }
            } else {
                // For StackBlitz, get the files first
                const files = await getStackBlitzFiles(currentExample.path, selectedFramework);
                onSandboxOpen(platform, currentExample.path, files);
            }
        } catch (error) {
            console.error("Failed to open sandbox:", error);
        }
    };

    return (
        <div className={className}>
            <CodeActionButton
                iconName="fullscreen"
                label="Fullscreen"
                className={`sc-editor-action sc-editor-action-github`}
                href={`iframe/${currentExample.path}`}
                target="_blank"
                rel="nofollow"
                title={`View ${getFrameworkContent(currentExample.title, selectedFramework)} in fullscreen`}
            />
            <CodeActionButton
                iconName="exampleStackblitz"
                label="Edit"
                className={`sc-editor-action sc-editor-action-dark`}
                onClick={(e) => handleSandboxClick(e, SandboxPlatform.StackBlitz)}
                title={`Edit ${getFrameworkContent(currentExample.title, selectedFramework)} in StackBlitz`}
            />
            <CodeActionButton
                iconName="codesandbox"
                label="&nbsp;Edit"
                className={`sc-editor-action sc-editor-action-dark`}
                onClick={(e) => handleSandboxClick(e, SandboxPlatform.CodeSandbox)}
                title={`Edit ${getFrameworkContent(currentExample.title, selectedFramework)} in CodeSandbox`}
            />
            <CodeActionButton
                iconName="docs"
                label="Docs"
                className={`sc-editor-action sc-editor-action-docs`}
                href={`https://www.scichart.com/documentation/js/v6/intro`}
                target="_blank"
                rel="nofollow"
                title={`SciChart.js Documentation`}
            />
            <CodeActionButton
                iconName="npm"
                className={`sc-editor-action sc-editor-action-npm`}
                href={`https://www.npmjs.com/package/scichart`}
                target="_blank"
                rel="nofollow"
                title={`Visit SciChart.js on NPM`}
            />
            <CodeActionButton
                iconName="exampleGithub"
                // label="View&nbsp;Source"
                className={`sc-editor-action sc-editor-action-github`}
                href={`https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/${currentExample.filepath}`}
                target="_blank"
                rel="noopener"
                title={contextualGithubTitle}
            />
        </div>
    );
};

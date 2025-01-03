import React, { FC, ReactNode, useState } from "react";
import classes from "./AppDetailsRouter.scss";
import {
    EPageFramework,
    FRAMEWORK_NAME,
    getFrameworkContent,
} from "../../helpers/shared/Helpers/frameworkParametrization";
import { TExamplePage } from "../AppRouter/examplePages";
import { SandboxPlatform } from "../CodeSandbox/SandboxPlatform";
import { getSandboxUrl, getStackBlitzFiles } from "./sandboxUtils";
import { CodeActionButton } from "./CodeActionButton";

const getFrameWorkName = (frameWork: string): string => {
    return (FRAMEWORK_NAME as any)[frameWork];
};

type CodeActionButtonsProps = {
    className?: string;
    currentExample: TExamplePage;
    selectedFramework: EPageFramework;
    selectedFile: { name: string; content: string };
    onSandboxOpen: (
        platform: SandboxPlatform,
        sandboxId: string,
        projectFiles?: any,
        framework?: EPageFramework
    ) => void;
    style?: React.CSSProperties;
};

export const CodeActionButtons: FC<CodeActionButtonsProps> = ({
    className,
    currentExample,
    selectedFramework,
    onSandboxOpen,
    selectedFile,
    style,
}): ReactNode => {
    const [availableFrameworks] = useState<EPageFramework[]>([
        EPageFramework.React,
        EPageFramework.Vanilla,
        EPageFramework.Angular,
    ]);

    const isFrameworkVariantAvailable = availableFrameworks?.includes(selectedFramework);
    const frameWorkName = getFrameWorkName(selectedFramework);

    const pageTitle = getFrameworkContent(currentExample.title, selectedFramework);

    const contextualGithubTitle =
        currentExample !== undefined
            ? `View source for ${pageTitle} on Github`
            : "Clone SciChart.js.examples on GitHub";

    const handleSandboxClick = async (e: React.MouseEvent<HTMLAnchorElement>, platform: SandboxPlatform) => {
        e.preventDefault();
        try {
            const framework = isFrameworkVariantAvailable ? selectedFramework : EPageFramework.React;
            const frameworkType = framework.toLowerCase() as "react" | "angular" | "vanilla";

            if (platform === SandboxPlatform.CodeSandbox) {
                const { id, actualFramework } = await getSandboxUrl(currentExample.path, frameworkType, platform);
                if (id) {
                    onSandboxOpen(platform, id, undefined, actualFramework);
                } else {
                    console.log("error");
                }
            } else {
                // For StackBlitz, get the files first
                const files = await getStackBlitzFiles(currentExample.path, frameworkType);
                onSandboxOpen(platform, currentExample.path, files);
            }
        } catch (error) {
            console.error("Failed to open sandbox:", error);
        }
    };

    return (
        <div className={className} style={style}>
            <CodeActionButton
                iconName="fullscreen"
                label="View&nbsp;fullscreen"
                className={`${classes.btn} ${classes.btnGithub}`}
                href={`/iframe/${currentExample.path}`}
                target="_blank"
                rel="nofollow"
                title={`View ${getFrameworkContent(currentExample.title, selectedFramework)} in fullscreen`}
            />
            <CodeActionButton
                iconName="exampleStackblitz"
                label="Edit"
                className={`${classes.btn} ${classes.btnDark}`}
                onClick={(e) => handleSandboxClick(e, SandboxPlatform.StackBlitz)}
                title={
                    isFrameworkVariantAvailable
                        ? `Edit ${getFrameworkContent(currentExample.title, selectedFramework)} in StackBlitz`
                        : `Sorry, we have not got ${frameWorkName} code for this example yet, so you will see react code instead, but the actual chart code is always the same. Contact support@scichart.com to request prioritisation of this example`
                }
            />
            <CodeActionButton
                iconName="codesandbox"
                label="Edit"
                className={`${classes.btn} ${classes.btnDark}`}
                onClick={(e) => handleSandboxClick(e, SandboxPlatform.CodeSandbox)}
                title={
                    isFrameworkVariantAvailable
                        ? `Edit ${getFrameworkContent(currentExample.title, selectedFramework)} in CodeSandbox`
                        : `Sorry, we have not got ${frameWorkName} code for this example yet, so you will see react code instead, but the actual chart code is always the same. Contact support@scichart.com to request prioritisation of this example`
                }
            />
            <CodeActionButton
                iconName="exampleGithub"
                label="View&nbsp;Source"
                className={`${classes.btn} ${classes.btnGithub}`}
                href={`https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/${currentExample.filepath}`}
                target="_blank"
                rel="noopener"
                title={contextualGithubTitle}
            />
        </div>
    );
};

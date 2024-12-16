import React, { FC, ReactNode, useState } from "react";
import classes from "./AppDeatilsRouter.scss";
import {
    EPageFramework,
    FRAMEWORK_NAME,
    getFrameworkContent,
} from "../../helpers/shared/Helpers/frameworkParametrization";
import { TExamplePage } from "../AppRouter/examplePages";
import { SandboxPlatform } from "../CodeSandbox/SandboxPlatform";
import { getSandboxUrl, getStackBlitzFiles } from "./sandboxUtils";
import { ExampleButton } from "./ExampleButton";

const getFrameWorkName = (frameWork: string): string => {
    return (FRAMEWORK_NAME as any)[frameWork];
};

type ExampleButtonsProps = {
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

export const ExampleButtons: FC<ExampleButtonsProps> = ({
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
            <ExampleButton
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
            <ExampleButton
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
            <ExampleButton
                iconName="exampleGithub"
                label="View&nbsp;Source"
                className={`${classes.btn} ${classes.btnGithub}`}
                href={`https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/${currentExample.filepath}/${selectedFile.name}`}
                target="_blank"
                rel="noopener"
            />
        </div>
    );
};

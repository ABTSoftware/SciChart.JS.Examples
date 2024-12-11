import React, { FC, ReactNode, useState } from "react";
import classes from "./AppDeatilsRouter.scss";
import { EPageFramework, FRAMEWORK_NAME, getFrameworkContent } from "../../helpers/shared/Helpers/frameworkParametrization";
import { TExamplePage } from "../AppRouter/examplePages";
import { SandboxPlatform } from "../CodeSandbox/SandboxPlatform";
import { getSandboxUrl } from "./sandboxUtils";
import { ExampleButton } from "./ExampleButton";

const getFrameWorkName = (frameWork: string): string => {
    return (FRAMEWORK_NAME as any)[frameWork];
};

type TExampleButtonsProps = {
    currentExample: TExamplePage;
    selectedFramework: EPageFramework;
    selectedFile: { name: string; content: string };
    onSandboxOpen: (platform: SandboxPlatform, sandboxId: string) => void;
};

export const ExamplesButtons: FC<TExampleButtonsProps> = ({
    currentExample,
    selectedFramework,
    onSandboxOpen,
    selectedFile,
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
                const sandboxId = await getSandboxUrl(currentExample.path, frameworkType, platform);
                if (sandboxId) {
                    onSandboxOpen(platform, sandboxId);
                } else {
                    console.log("error");
                }
            } else {
                // For StackBlitz, directly open the editor without getting a URL
                onSandboxOpen(platform, currentExample.path);
            }
        } catch (error) {
            console.error("Failed to open sandbox:", error);
            const fallbackUrl =
                platform === SandboxPlatform.CodeSandbox
                    ? `codesandbox/${currentExample.path}?codesandbox=1&framework=${
                          isFrameworkVariantAvailable ? selectedFramework : EPageFramework.React
                      }`
                    : `stackblitz/${currentExample.path}?codesandbox=1&framework=${
                          isFrameworkVariantAvailable ? selectedFramework : EPageFramework.React
                      }`;
            window.location.href = fallbackUrl;
        }
    };

    return (
        <div className={classes.tabbtnwrap}>
            <ExampleButton
                iconName="exampleFullscreen"
                label="Full Screen"
                className={classes.btnprimary}
                href={`/iframe/${currentExample.path}`}
                target="_blank"
                rel="noopener"
            />
            <ExampleButton
                iconName="exampleStackblitz"
                label="Edit"
                className={classes.btnDark}
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
                className={classes.btnDark}
                onClick={(e) => handleSandboxClick(e, SandboxPlatform.CodeSandbox)}
                title={
                    isFrameworkVariantAvailable
                        ? `Edit ${getFrameworkContent(currentExample.title, selectedFramework)} in CodeSandbox`
                        : `Sorry, we have not got ${frameWorkName} code for this example yet, so you will see react code instead, but the actual chart code is always the same. Contact support@scichart.com to request prioritisation of this example`
                }
            />
            <ExampleButton
                iconName="exampleGithub"
                label="View Source"
                className={classes.btnGithub}
                href={`https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/Examples/src/components/Examples/${currentExample.filepath}/${selectedFile.name}`}
                target="_blank"
                rel="noopener"
            />
        </div>
    );
};

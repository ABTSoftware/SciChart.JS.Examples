import { FC, useState, useRef } from "react";
import { Loader } from "./Loader";
import styles from "./CodeSandbox.module.scss";
import { DisplayMode } from "./DisplayMode";
import { IconButton } from "../buttons/IconButton";
import { IconRadioGroup } from "../buttons/IconRadioGroup";
import { Toolbar, ToolbarGroup, ToolbarText } from "../buttons/Toolbar";
import { Icon } from "../buttons/Icon";
import { Tooltip } from "../buttons/Tooltip";
import { SandboxPlatform, getEmbedUrl, platformIcons } from "./SandboxPlatform";

type TCodeSandbox = {
    id: string;
    fontSize?: number;
    onBack?: () => void;
    title?: string;
    platform?: SandboxPlatform;
};

export const CodeSandbox: FC<TCodeSandbox> = ({
    id,
    fontSize = 10,
    onBack,
    title,
    platform = SandboxPlatform.CodeSandbox,
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.Embedded);
    const containerRef = useRef<HTMLDivElement>(null);

    const url = getEmbedUrl(platform, id, fontSize);

    const handleLoad = () => {
        setIsLoading(false);
    };

    const handleDisplayModeChange = (mode: DisplayMode) => {
        setDisplayMode(mode);
    };

    const displayModeIcons: Record<DisplayMode, string> = {
        [DisplayMode.Embedded]: "embedded",
        [DisplayMode.BrowserFill]: "fullscreen",
    };

    const displayModeDescriptions: Record<DisplayMode, string> = {
        [DisplayMode.Embedded]: "Display as embedded component",
        [DisplayMode.BrowserFill]: "Fill browser window",
    };

    const containerClassName = `${styles.container} ${
        displayMode === DisplayMode.BrowserFill ? styles.browserFill : ""
    }`;

    const handleBack = () => {
        onBack?.();
    };

    const platformTooltip =
        platform === SandboxPlatform.CodeSandbox ? "Running in CodeSandbox" : "Running in StackBlitz";

    const defaultTitle = platform === SandboxPlatform.CodeSandbox ? "CodeSandbox" : "StackBlitz";

    return (
        <div ref={containerRef} className={containerClassName}>
            <Toolbar className={styles.toolbar}>
                <ToolbarGroup>
                    <Tooltip content={platformTooltip}>
                        <div className={styles.platformIcon}>
                            <Icon name={platformIcons[platform]} />
                        </div>
                    </Tooltip>
                    <ToolbarText>{title || defaultTitle}</ToolbarText>
                </ToolbarGroup>
                <div className={styles.spacer} />
                <ToolbarGroup>
                    <IconRadioGroup
                        value={displayMode}
                        onChange={handleDisplayModeChange}
                        options={Object.values(DisplayMode)}
                        iconMap={displayModeIcons}
                        iconTitles={displayModeDescriptions}
                    />
                    <IconButton icon="close" onClick={handleBack} title="Close" />
                </ToolbarGroup>
            </Toolbar>
            {isLoading && <Loader />}
            <iframe
                key={url}
                src={url}
                title={platform === SandboxPlatform.CodeSandbox ? "CodeSandbox" : "StackBlitz"}
                className={styles.frame}
                sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                onLoad={handleLoad}
            />
        </div>
    );
};
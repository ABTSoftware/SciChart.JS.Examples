import { FC, useState, useRef, useEffect } from "react";
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
    const prevMode = useRef<DisplayMode>(displayMode);

    const url = getEmbedUrl(platform, id, fontSize);

    const handleLoad = () => {
        setIsLoading(false);
    };

    const handleDisplayModeChange = async (mode: DisplayMode) => {
        if (mode === DisplayMode.Fullscreen) {
            try {
                await containerRef.current?.requestFullscreen();
            } catch (err) {
                console.error("Could not enter fullscreen mode:", err);
            }
        } else if (displayMode === DisplayMode.Fullscreen) {
            try {
                if (document.fullscreenElement) {
                    await document.exitFullscreen();
                }
            } catch (err) {
                console.error("Could not exit fullscreen mode:", err);
            }
        }

        prevMode.current = displayMode;
        setDisplayMode(mode);
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && displayMode === DisplayMode.Fullscreen) {
                setDisplayMode(DisplayMode.Embedded);
            }
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, [displayMode]);

    const displayModeDescriptions: Record<DisplayMode, string> = {
        [DisplayMode.Embedded]: "Display as embedded component",
        [DisplayMode.BrowserFill]: "Fill browser window",
        [DisplayMode.Fullscreen]: "Show in fullscreen mode",
    };

    const containerClassName = `${styles.container} ${
        displayMode === DisplayMode.BrowserFill
            ? styles.browserFill
            : displayMode === DisplayMode.Fullscreen
            ? styles.fullscreen
            : ""
    }`;

    const handleBack = () => {
        if (displayMode === DisplayMode.Fullscreen && document.fullscreenElement) {
            document.exitFullscreen();
        }
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

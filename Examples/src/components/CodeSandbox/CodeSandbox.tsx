import { FC, useState, useRef, useEffect } from "react";
import { Loader } from "./Loader";
import styles from "./CodeSandbox.module.scss";
import { DisplayMode } from "./DisplayMode";
import { IconButton } from "../buttons/IconButton";
import { IconRadioGroup } from "../buttons/IconRadioGroup";
import { Toolbar, ToolbarGroup, ToolbarText } from "../buttons/Toolbar";

type TCodeSandbox = {
    id: string;
    fontSize?: number;
    onBack?: () => void;
    title?: string;
};

export const CodeSandbox: FC<TCodeSandbox> = ({ id, fontSize = 10, onBack, title = "Code Sandbox" }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.Embedded);
    const containerRef = useRef<HTMLDivElement>(null);
    const prevMode = useRef<DisplayMode>(displayMode);

    const url = `https://codesandbox.io/embed/${id}?fontsize=${fontSize}&view=split`;

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
        // If we're in fullscreen, exit first
        if (displayMode === DisplayMode.Fullscreen && document.fullscreenElement) {
            document.exitFullscreen();
        }
        // Call the parent's onBack handler
        onBack?.();
    };

    return (
        <div ref={containerRef} className={containerClassName}>
            <Toolbar className={styles.toolbar}>
                <ToolbarText>{title}</ToolbarText>
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
                src={url}
                title="CodeSandbox"
                className={styles.frame}
                sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                onLoad={handleLoad}
            />
        </div>
    );
};

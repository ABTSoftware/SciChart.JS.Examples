import { FC, useState, useRef, useEffect } from "react";
import { Loader } from "./Loader";
import styles from "./CodeSandbox.module.scss";
import { DisplayMode } from "./DisplayMode";
import { ButtonBar } from "../buttons/ButtonBar";
import { IconButton } from "../buttons/IconButton";
import { IconRadioGroup } from "../buttons/IconRadioGroup";

type TCodeSandbox = {
    id: string;
    fontSize?: number;
    onBack?: () => void;
};

export const CodeSandbox: FC<TCodeSandbox> = ({ id, fontSize = 10, onBack }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.Embedded);
    const [position, setPosition] = useState({ x: 20, y: 20 });
    const containerRef = useRef<HTMLDivElement>(null);

    const url = `https://codesandbox.io/embed/${id}?fontsize=${fontSize}&view=split`;

    const handleLoad = () => {
        setIsLoading(false);
    };

    const handlePositionChange = (x: number, y: number) => {
        setPosition({ x, y });
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

    return (
        <div ref={containerRef} className={containerClassName}>
            {isLoading && <Loader />}
            <iframe
                src={url}
                title="CodeSandbox"
                className={styles.frame}
                sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                onLoad={handleLoad}
            />
            <ButtonBar onPositionChange={handlePositionChange}>
                <IconButton icon="back" onClick={onBack} title="Go back" />
                <IconRadioGroup
                    value={displayMode}
                    onChange={handleDisplayModeChange}
                    options={Object.values(DisplayMode)}
                    iconTitles={displayModeDescriptions}
                />
            </ButtonBar>
        </div>
    );
};

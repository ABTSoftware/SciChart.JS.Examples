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
    const prevMode = useRef<DisplayMode>(displayMode);

    const url = `https://codesandbox.io/embed/${id}?fontsize=${fontSize}&view=split`;

    const handleLoad = () => {
        setIsLoading(false);
    };

    const handlePositionChange = (x: number, y: number) => {
        setPosition({ x, y });
    };

    const calculateAdjustedPosition = (
        fromMode: DisplayMode,
        toMode: DisplayMode,
        currentPos: { x: number; y: number }
    ) => {
        const container = containerRef.current;
        if (!container) return currentPos;

        const rect = container.getBoundingClientRect();
        const { width: newWidth, height: newHeight } = rect;

        let scaleX = 1,
            scaleY = 1;

        if (fromMode === DisplayMode.Embedded && toMode === DisplayMode.BrowserFill) {
            scaleX = window.innerWidth / newWidth;
            scaleY = window.innerHeight / newHeight;
        } else if (fromMode === DisplayMode.BrowserFill && toMode === DisplayMode.Embedded) {
            scaleX = newWidth / window.innerWidth;
            scaleY = newHeight / window.innerHeight;
        }

        return {
            x: currentPos.x * scaleX,
            y: currentPos.y * scaleY,
        };
    };

    const handleDisplayModeChange = async (mode: DisplayMode) => {
        const newPosition = calculateAdjustedPosition(displayMode, mode, position);

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
        setPosition(newPosition);
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && displayMode === DisplayMode.Fullscreen) {
                const newPosition = calculateAdjustedPosition(DisplayMode.Fullscreen, DisplayMode.Embedded, position);
                setDisplayMode(DisplayMode.Embedded);
                setPosition(newPosition);
            }
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, [displayMode, position]);

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
            {isLoading && <Loader />}
            <iframe
                src={url}
                title="CodeSandbox"
                className={styles.frame}
                sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                onLoad={handleLoad}
            />
            <ButtonBar
                onPositionChange={handlePositionChange}
                style={{ left: `${position.x}px`, top: `${position.y}px` }}
            >
                <IconButton icon="back" onClick={handleBack} title="Go back" />
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

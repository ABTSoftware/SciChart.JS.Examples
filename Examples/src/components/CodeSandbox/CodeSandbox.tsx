import { FC, useState } from "react";
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

    const url = `https://codesandbox.io/embed/${id}?fontsize=${fontSize}&view=split`;

    const handleLoad = () => {
        setIsLoading(false);
    };

    const handlePositionChange = (x: number, y: number) => {
        setPosition({ x, y });
    };

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
        <div className={containerClassName}>
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
                    onChange={setDisplayMode}
                    options={Object.values(DisplayMode)}
                    iconTitles={displayModeDescriptions}
                />
            </ButtonBar>
        </div>
    );
};

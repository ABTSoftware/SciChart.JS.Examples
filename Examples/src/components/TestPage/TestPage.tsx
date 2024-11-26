import React from "react";
import { Icon } from "./buttons/Icon";
import { IconButton } from "./buttons/IconButton";
import { IconRadioGroup } from "./buttons/IconRadioGroup";
import { ButtonBar } from "./buttons/ButtonBar";
import { DisplayMode } from "./DisplayMode";
import "./TestPage.scss";

export const TestPage: React.FC = () => {
    const [isSelected, setIsSelected] = React.useState(false);
    const [displayMode, setDisplayMode] = React.useState<DisplayMode>(DisplayMode.Embedded);
    const [position, setPosition] = React.useState({ x: 20, y: 20 });

    const handlePositionChange = (x: number, y: number) => {
        setPosition({ x, y });
    };

    const handleBack = () => {
        console.log("Back clicked");
    };

    const displayModeDescriptions: Record<DisplayMode, string> = {
        [DisplayMode.Embedded]: "Display as embedded component",
        [DisplayMode.BrowserFill]: "Fill browser window",
        [DisplayMode.Fullscreen]: "Show in fullscreen mode",
    };

    return (
        <div className="test-page">
            <h1>Component Tests</h1>

            <div className="test-section">
                <h2>Icon Example</h2>
                <Icon name="example" />
            </div>

            <div className="test-section">
                <h2>IconButton Examples</h2>
                <div className="button-container">
                    <div className="button-test">
                        <h3>Toggleable IconButton</h3>
                        <IconButton icon="example" selected={isSelected} onClick={() => setIsSelected(!isSelected)} />
                        <p>Current state: {isSelected ? "Selected" : "Not Selected"}</p>
                    </div>

                    <div className="button-test">
                        <h3>Always Selected IconButton</h3>
                        <IconButton icon="example" selected={true} />
                    </div>

                    <div className="button-test">
                        <h3>Never Selected IconButton</h3>
                        <IconButton icon="example" selected={false} />
                    </div>
                </div>
            </div>

            <div className="test-section">
                <h2>Display Mode Selection</h2>
                <div className="button-container">
                    <div className="button-test">
                        <h3>Display Mode Radio Group</h3>
                        <IconRadioGroup
                            value={displayMode}
                            onChange={setDisplayMode}
                            options={Object.values(DisplayMode)}
                            className="display-mode-group"
                            iconTitles={displayModeDescriptions}
                        />
                        <p>Current display mode: {displayMode}</p>
                    </div>
                </div>
            </div>

            <div className="test-section">
                <h2>Draggable Button Bar</h2>
                <p>The button bar can be dragged anywhere on the page using the grip area.</p>
            </div>

            <ButtonBar onPositionChange={handlePositionChange}>
                <IconButton icon="back" onClick={handleBack} title="Go back" />
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

export default TestPage;

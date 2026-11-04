import React from "react";
import { DisplayMode } from "../DisplayMode";
import { IconButton } from "../../buttons/IconButton";
import { IconRadioGroup } from "../../buttons/IconRadioGroup";
import { Toolbar, ToolbarGroup, ToolbarText } from "../../buttons/Toolbar";
import { Icon } from "../../buttons/Icon";
import { Tooltip } from "../../buttons/Tooltip";
import { SandboxPlatform, platformIcons } from "../SandboxPlatform";

interface EditorToolbarProps {
    platform: SandboxPlatform;
    title?: string;
    exampleName?: string;
    displayMode: DisplayMode;
    onDisplayModeChange: (mode: DisplayMode) => void;
    onClose: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
    platform,
    title,
    exampleName,
    displayMode,
    onDisplayModeChange,
    onClose,
}) => {
    const displayModeIcons: Record<DisplayMode, string> = {
        [DisplayMode.Embedded]: "embedded",
        [DisplayMode.BrowserFill]: "fullscreen",
    };

    const displayModeDescriptions: Record<DisplayMode, string> = {
        [DisplayMode.Embedded]: "Display as embedded component",
        [DisplayMode.BrowserFill]: "Fill browser window",
    };

    const platformTooltip =
        platform === SandboxPlatform.CodeSandbox ? "Running in CodeSandbox" : "Running in StackBlitz";

    const defaultTitle = platform === SandboxPlatform.CodeSandbox ? "CodeSandbox" : "StackBlitz";

    return (
        <Toolbar>
            <ToolbarGroup>
                <Tooltip content={platformTooltip}>
                    <div className="sc-editor-frame-platform-icon">
                        <Icon name={platformIcons[platform]} />
                    </div>
                </Tooltip>
                <div className="sc-editor-frame-title-group">
                    <ToolbarText>{title || defaultTitle}</ToolbarText>
                    {exampleName && <div className="sc-editor-frame-example-name">{exampleName}</div>}
                </div>
            </ToolbarGroup>
            <div className="sc-editor-frame-spacer" />
            <ToolbarGroup>
                <IconRadioGroup
                    value={displayMode}
                    onChange={onDisplayModeChange}
                    options={Object.values(DisplayMode)}
                    iconMap={displayModeIcons}
                    iconTitles={displayModeDescriptions}
                />
                <IconButton icon="close" onClick={onClose} title="Close" />
            </ToolbarGroup>
        </Toolbar>
    );
};

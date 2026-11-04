import React, { ReactNode } from "react";

export interface ToolbarProps {
    children: ReactNode;
    className?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({ children, className }) => {
    return <div className={`sc-editor-toolbar ${className || ""}`}>{children}</div>;
};

export interface ToolbarGroupProps {
    children: ReactNode;
    className?: string;
}

export const ToolbarGroup: React.FC<ToolbarGroupProps> = ({ children, className }) => {
    return <div className={`sc-editor-toolbar-group ${className || ""}`}>{children}</div>;
};

export interface ToolbarTextProps {
    children: ReactNode;
    className?: string;
}

export const ToolbarText: React.FC<ToolbarTextProps> = ({ children, className }) => {
    return <span className={`sc-editor-toolbar-text ${className || ""}`}>{children}</span>;
};

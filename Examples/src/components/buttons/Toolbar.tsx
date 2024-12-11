import React, { ReactNode } from "react";
import styles from "./Toolbar.module.scss";

export interface ToolbarProps {
    children: ReactNode;
    className?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({ children, className }) => {
    return <div className={`${styles.toolbar} ${className || ""}`}>{children}</div>;
};

export interface ToolbarGroupProps {
    children: ReactNode;
    className?: string;
}

export const ToolbarGroup: React.FC<ToolbarGroupProps> = ({ children, className }) => {
    return <div className={`${styles.toolbarGroup} ${className || ""}`}>{children}</div>;
};

export interface ToolbarTextProps {
    children: ReactNode;
    className?: string;
}

export const ToolbarText: React.FC<ToolbarTextProps> = ({ children, className }) => {
    return <span className={`${styles.toolbarText} ${className || ""}`}>{children}</span>;
};

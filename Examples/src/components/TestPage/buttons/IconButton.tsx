import React from "react";
import styles from "./IconButton.module.scss";
import { Icon } from "./Icon";

interface IconButtonProps {
    icon: string;
    selected?: boolean;
    onClick?: () => void;
    className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ icon, selected = false, onClick, className = "" }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const classes = [styles.iconButton, selected ? styles.selected : "", isHovered ? styles.hovered : "", className]
        .filter(Boolean)
        .join(" ");

    return (
        <button
            className={classes}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Icon name={icon} />
        </button>
    );
};

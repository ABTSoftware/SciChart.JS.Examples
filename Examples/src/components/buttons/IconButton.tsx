import React from "react";
import styles from "./IconButton.module.scss";
import { Icon } from "./Icon";
import { Tooltip } from "./Tooltip";

interface IconButtonProps {
    icon: string;
    selected?: boolean;
    onClick?: () => void;
    className?: string;
    title?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ icon, selected = false, onClick, className = "", title }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const classes = [styles.iconButton, selected ? styles.selected : "", isHovered ? styles.hovered : "", className]
        .filter(Boolean)
        .join(" ");

    const button = (
        <button
            className={classes}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label={title}
        >
            <Icon name={icon} />
        </button>
    );

    if (title) {
        return <Tooltip content={title}>{button}</Tooltip>;
    }

    return button;
};

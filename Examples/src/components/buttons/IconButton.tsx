import React from "react";
import { Icon } from "./Icon";
import { Tooltip } from "./Tooltip";

type IconButtonProps =
    | {
          icon: string;
          selected?: boolean;
          onClick?: () => void;
          className?: string;
          title?: string;
          noPadding?: boolean;
      }
    | {
          icon: React.ReactNode;
          selected?: boolean;
          onClick?: () => void;
          className?: string;
          title?: string;
          noPadding?: boolean;
      };

export const IconButton: React.FC<IconButtonProps> = ({
    icon,
    selected = false,
    onClick,
    className = "",
    title,
    noPadding = false,
}) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const classes = [
        noPadding ? "sc-editor-icon-no-padding" : "sc-editor-icon-button",
        selected ? "sc-editor-icon-selected" : "",
        isHovered ? "sc-editor-icon-hovered" : "",
        className,
    ]
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
            {typeof icon === "string" ? <Icon name={icon} /> : icon}
        </button>
    );

    if (title) {
        return <Tooltip content={title}>{button}</Tooltip>;
    }

    return button;
};

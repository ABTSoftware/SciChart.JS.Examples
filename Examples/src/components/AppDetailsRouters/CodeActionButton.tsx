import React from "react";
import classes from "./AppDetailsRouter.scss";
import { Icon } from "../buttons/Icon";

interface BaseCodeActionButtonProps {
    iconName: string;
    label: string;
    className?: string;
    title?: string;
    rel?: string;
}

interface LinkCodeActionButtonProps extends BaseCodeActionButtonProps {
    href: string;
    target?: string;
    onClick?: never;
}

interface ClickCodeActionButtonProps extends BaseCodeActionButtonProps {
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    href?: never;
    target?: never;
}

type CodeActionButtonProps = LinkCodeActionButtonProps | ClickCodeActionButtonProps;

export const CodeActionButton: React.FC<CodeActionButtonProps> = ({
    iconName,
    label,
    className = classes.btn,
    title,
    href = "#",
    target,
    onClick,
    rel,
}) => {
    return (
        <a className={className} href={href} target={target} onClick={onClick} title={title} rel={rel}>
            <div style={{ width: 30, height: 30, display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Icon name={iconName} />
            </div>
            &nbsp;{label}
        </a>
    );
};

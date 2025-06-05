import React from "react";
import classes from "./AppDetailsRouter.scss";
import { Icon, TIconType } from "../buttons/Icon";

interface BaseCodeActionButtonProps {
    iconName: TIconType;
    label?: string;
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
    href,
    target,
    onClick,
    rel,
}) => {
    return href ? (
        <a
            className={`${className} ${classes.actionButton}`}
            href={href}
            target={target}
            onClick={onClick}
            title={title}
            rel={rel}
            data-ga-ignore="true" // prevent Echo adding _gl=1... to a link
            data-ignore-ga="true"
        >
            <Icon name={iconName} />
            {label ? <p>{label}</p> : null}
        </a>
    ) : (
        <span className={`${className} ${classes.actionButton}`} onClick={onClick} title={title} rel={rel}>
            <Icon name={iconName} />
            {label ? <p>{label}</p> : null}
        </span>
    );
};

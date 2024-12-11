import React from "react";
import classes from "./AppDeatilsRouter.scss";
import { Icon } from "../buttons/Icon";

interface BaseExampleButtonProps {
    iconName: string;
    label: string;
    className?: string;
    title?: string;
    rel?: string;
}

interface LinkExampleButtonProps extends BaseExampleButtonProps {
    href: string;
    target?: string;
    onClick?: never;
}

interface ClickExampleButtonProps extends BaseExampleButtonProps {
    onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    href?: never;
    target?: never;
}

type ExampleButtonProps = LinkExampleButtonProps | ClickExampleButtonProps;

export const ExampleButton: React.FC<ExampleButtonProps> = ({
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
            <Icon name={iconName} />
            &nbsp;{label}
        </a>
    );
};

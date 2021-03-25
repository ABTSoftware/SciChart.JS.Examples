import * as React from "react";

type TProps = {
    className?: string;
    text: string;
};

const MenuListItemText: React.FC<TProps> = (props) => {
    const { className, text } = props;
    return (
        <span className={className}>
            {text}
        </span>
    );
};

export default MenuListItemText;

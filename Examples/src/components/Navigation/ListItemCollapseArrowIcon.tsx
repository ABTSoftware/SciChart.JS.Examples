import * as React from "react";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";

type TProps = {
    className?: string;
    isCollapseOpened: boolean;
};

const ListItemCollapseArrowIcon: React.FC<TProps> = props => {
    const { className, isCollapseOpened } = props;
    return <div className={className}>{isCollapseOpened ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</div>;
};

export default ListItemCollapseArrowIcon;

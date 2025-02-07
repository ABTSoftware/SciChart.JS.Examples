import * as React from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

type TProps = {
    className?: string;
    isCollapseOpened: boolean;
};

const ListItemCollapseArrowIcon: React.FC<TProps> = (props) => {
    const { className, isCollapseOpened } = props;
    return <div className={className}>{isCollapseOpened ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</div>;
};

export default ListItemCollapseArrowIcon;

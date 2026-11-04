import * as React from "react";

type TProps = {
    className?: string;
    isCollapseOpened: boolean;
};

const ListItemCollapseArrowIcon: React.FC<TProps> = (props) => {
    const { className, isCollapseOpened } = props;
    return (
        <div className={className}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                <polyline
                    points={isCollapseOpened ? "6 15 12 9 18 15" : "6 9 12 15 18 9"}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
};

export default ListItemCollapseArrowIcon;

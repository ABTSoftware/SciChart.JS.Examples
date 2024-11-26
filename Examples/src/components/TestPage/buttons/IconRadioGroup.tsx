import React from "react";
import { IconButton } from "./IconButton";
import styles from "./IconRadioGroup.module.scss";

interface IconRadioGroupProps<T extends string> {
    value: T;
    onChange: (value: T) => void;
    options: T[];
    iconMap?: Record<T, string>;
    className?: string;
}

export function IconRadioGroup<T extends string>({
    value,
    onChange,
    options,
    iconMap,
    className = "",
}: IconRadioGroupProps<T>) {
    return (
        <div className={`${styles.iconRadioGroup} ${className}`.trim()}>
            {options.map((option) => (
                <IconButton
                    key={option}
                    icon={iconMap?.[option] ?? option}
                    selected={value === option}
                    onClick={() => onChange(option)}
                />
            ))}
        </div>
    );
}

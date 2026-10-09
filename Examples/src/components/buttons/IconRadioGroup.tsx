import { IconButton } from "./IconButton";

interface IconRadioGroupProps<T extends string> {
    value: T;
    onChange: (value: T) => void;
    options: T[];
    iconMap?: Record<T, string>;
    iconTitles?: Record<T, string>;
    className?: string;
}

export function IconRadioGroup<T extends string>({
    value,
    onChange,
    options,
    iconMap,
    iconTitles,
    className = "",
}: IconRadioGroupProps<T>) {
    return (
        <div className={`sc-editor-radio-group ${className}`.trim()}>
            {options.map((option) => (
                <IconButton
                    key={option}
                    icon={iconMap?.[option] ?? option}
                    selected={value === option}
                    onClick={() => onChange(option)}
                    title={iconTitles?.[option]}
                />
            ))}
        </div>
    );
}

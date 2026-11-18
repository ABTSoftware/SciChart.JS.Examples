import { FC } from "react";
import { countErrors, type ConsoleEntry } from "./consoleLog";

/** Compile errors, uncaught errors and the draft's console output, shown under the source editor. */
export const ConsoleDrawer: FC<{ entries: ConsoleEntry[]; open: boolean; onToggle: () => void }> = ({
    entries,
    open,
    onToggle,
}) => {
    const errorCount = countErrors(entries);
    return (
        <div className="sc-live-console" data-open={open ? "" : undefined}>
            <button type="button" className="sc-live-console-handle" aria-expanded={open} onClick={onToggle}>
                Console
                {errorCount > 0 && <span className="sc-live-console-badge">{errorCount}</span>}
            </button>
            {open && (
                <ul className="sc-live-console-lines" aria-label="Console output" role="log">
                    {entries.length === 0 && <li className="sc-live-console-empty">No output</li>}
                    {entries.map((entry) => (
                        <li key={entry.id} data-kind={entry.kind}>
                            {entry.file && (
                                <span className="sc-live-console-location">
                                    {entry.file}
                                    {entry.line ? `:${entry.line}` : ""}
                                </span>
                            )}
                            {entry.text}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

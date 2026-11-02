import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { filterSearchItems, generateSearchItems, type TSearchItem } from "./searchItems";
import { ALL_MENU_ITEMS } from "../AppRouter/examples";
import { _useContext } from "../../helpers/shared/Helpers/Context";

export default function Search() {
    const navigate = useNavigate();
    const { state } = _useContext();
    const items = useMemo(() => generateSearchItems(ALL_MENU_ITEMS, state.framework), [state.framework]);
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const results = useMemo(() => filterSearchItems(items, query), [items, query]);
    const listRef = useRef<HTMLUListElement>(null);
    const id = useId();
    const selectItem = (item: TSearchItem) => {
        setQuery(item.title);
        setIsOpen(false);
        setActiveIndex(-1);
        navigate(item.link);
    };

    useEffect(() => {
        setQuery("");
        setIsOpen(false);
        setActiveIndex(-1);
    }, [state.framework]);

    useEffect(() => {
        if (isOpen) listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
    }, [activeIndex, isOpen]);

    return (
        <form
            className="sc-app-search"
            role="search"
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
            }}
            onSubmit={(event) => {
                event.preventDefault();
                if (isOpen && results[activeIndex]) selectItem(results[activeIndex]);
            }}
        >
            <label className="sc-app-search-field">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                    <circle cx="10" cy="10" r="6" />
                    <path d="m15 15 5 5" />
                </svg>
                <input
                    type="search"
                    role="combobox"
                    autoComplete="off"
                    aria-autocomplete="list"
                    aria-expanded={isOpen}
                    aria-controls={isOpen ? id : undefined}
                    aria-activedescendant={isOpen && results[activeIndex] ? `${id}-${activeIndex}` : undefined}
                    value={query}
                    aria-label="Search examples"
                    placeholder="Search for example names and chart types"
                    onClick={() => setIsOpen(true)}
                    onFocus={() => {
                        if (query) setIsOpen(true);
                    }}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setActiveIndex(-1);
                        setIsOpen(true);
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                            event.preventDefault();
                            setIsOpen(true);
                            const direction = event.key === "ArrowDown" ? 1 : -1;
                            setActiveIndex((index) => {
                                if (!results.length) return -1;
                                if (!isOpen || index < 0) return direction === 1 ? 0 : results.length - 1;
                                return (index + direction + results.length) % results.length;
                            });
                        } else if (event.key === "Escape" && isOpen) {
                            event.preventDefault();
                            event.stopPropagation();
                            setIsOpen(false);
                            setActiveIndex(-1);
                        }
                    }}
                />
            </label>
            {isOpen && (
                <ul
                    id={id}
                    ref={listRef}
                    className="sc-app-search-options"
                    role="listbox"
                    aria-label="Example suggestions"
                >
                    {results.map((item, index) => (
                        <li
                            key={item.link}
                            id={`${id}-${index}`}
                            role="option"
                            aria-selected={index === activeIndex}
                            onMouseDown={(event) => event.preventDefault()}
                            onMouseMove={() => setActiveIndex(index)}
                            onClick={() => selectItem(item)}
                        >
                            {item.title}
                        </li>
                    ))}
                    {!results.length && (
                        <li role="presentation">
                            <span role="status">No examples found</span>
                        </li>
                    )}
                </ul>
            )}
        </form>
    );
}

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { ExampleSourceFile } from "../../helpers/types/types";
import { buildFileTree, type FileTreeNode } from "./projectFiles";

export const FileIcon = ({ name }: { name: string }) => {
    const extension = name.split(".").pop();
    const label = extension === "json" ? "{}" : extension === "html" ? "<>" : extension === "css" ? "#" : extension;
    return (
        <span className="sc-editor-file-icon" data-kind={extension} aria-hidden="true">
            {label?.slice(0, 3)}
        </span>
    );
};

type Props = {
    files: ExampleSourceFile[];
    selectedName: string;
    modifiedNames: Set<string>;
    onSelect: (name: string) => void;
};

export function FileExplorer({ files, selectedName, modifiedNames, onSelect }: Props) {
    const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
    const [focusedPath, setFocusedPath] = useState(selectedName);
    const treeRef = useRef<HTMLUListElement>(null);
    const tree = useMemo(() => buildFileTree(files), [files]);
    const visible: { node: FileTreeNode; level: number }[] = [];
    const visit = (nodes: FileTreeNode[], level: number) =>
        nodes.forEach((node) => {
            visible.push({ node, level });
            if (node.children && !collapsed.has(node.path)) visit(node.children, level + 1);
        });
    visit(tree, 1);

    useEffect(() => {
        setFocusedPath(selectedName);
        setCollapsed((current) => new Set([...current].filter((path) => !selectedName?.startsWith(path + "/"))));
    }, [selectedName]);

    const toggleFolder = (path: string) =>
        setCollapsed((current) => {
            const next = new Set(current);
            next.has(path) ? next.delete(path) : next.add(path);
            return next;
        });
    const focus = (path: string) => {
        setFocusedPath(path);
        const buttons = treeRef.current?.querySelectorAll<HTMLButtonElement>("[data-path]");
        Array.from(buttons ?? [])
            .find((button) => button.dataset.path === path)
            ?.focus();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
        const index = visible.findIndex(({ node }) => node.path === focusedPath);
        const current = visible[index]?.node;
        if (!current) return;
        let target: string;
        switch (event.key) {
            case "ArrowDown":
                target = visible[Math.min(index + 1, visible.length - 1)].node.path;
                break;
            case "ArrowUp":
                target = visible[Math.max(index - 1, 0)].node.path;
                break;
            case "Home":
                target = visible[0].node.path;
                break;
            case "End":
                target = visible[visible.length - 1].node.path;
                break;
            case "ArrowRight":
                if (!current.children) return;
                if (collapsed.has(current.path)) toggleFolder(current.path);
                else target = current.children[0]?.path;
                break;
            case "ArrowLeft":
                if (current.children && !collapsed.has(current.path)) toggleFolder(current.path);
                else
                    target = current.path.includes("/")
                        ? current.path.slice(0, current.path.lastIndexOf("/"))
                        : undefined;
                break;
            default:
                return;
        }
        event.preventDefault();
        if (target) focus(target);
    };

    return (
        <nav className="sc-editor-explorer" aria-label="Project files">
            <div className="sc-editor-explorer-title">
                Explorer <span>{files.length} files</span>
            </div>
            <ul ref={treeRef} role="tree" aria-label="Example project" onKeyDown={handleKeyDown}>
                {visible.map(({ node, level }) => (
                    <li key={node.path} role="none">
                        <button
                            type="button"
                            role="treeitem"
                            aria-level={level}
                            aria-expanded={node.children ? !collapsed.has(node.path) : undefined}
                            aria-selected={node.children ? undefined : selectedName === node.path}
                            aria-label={node.name + (modifiedNames.has(node.path) ? ", modified" : "")}
                            tabIndex={focusedPath === node.path ? 0 : -1}
                            data-path={node.path}
                            style={{ paddingLeft: `${0.625 + (level - 1) * 0.875}rem` }}
                            title={node.path}
                            onFocus={() => setFocusedPath(node.path)}
                            onClick={() => (node.children ? toggleFolder(node.path) : onSelect(node.path))}
                        >
                            {node.children ? (
                                <span className="sc-editor-folder-icon" aria-hidden="true">
                                    {collapsed.has(node.path) ? "▸" : "▾"}
                                </span>
                            ) : (
                                <FileIcon name={node.name} />
                            )}
                            <span className="sc-editor-file-name">{node.name}</span>
                            {modifiedNames.has(node.path) && (
                                <span className="sc-editor-modified" aria-hidden="true">
                                    ●
                                </span>
                            )}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

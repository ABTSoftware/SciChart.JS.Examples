import { FC, useEffect, useRef } from "react";
import { Compartment, EditorState, type Extension } from "@codemirror/state";
import { EditorView, keymap, lineNumbers, highlightActiveLine, drawSelection } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { bracketMatching, HighlightStyle, indentOnInput, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { javascript } from "@codemirror/lang-javascript";
import { css } from "@codemirror/lang-css";

export type CodeMirrorEditorProps = {
    /** Changing the name starts a new document (and a new undo history). */
    name: string;
    value: string;
    isLight: boolean;
    onChange: (value: string) => void;
    onEscape: () => void;
    onRun: () => void;
};

const languageFor = (name: string): Extension =>
    name.endsWith(".css") ? css() : javascript({ typescript: /\.tsx?$/.test(name), jsx: /x$/.test(name) });

/** The classic Visual Studio / VS Code palettes: blue keywords, yellow functions, teal types, green comments. */
const palette = (
    c: Record<
        | "keyword"
        | "string"
        | "number"
        | "fn"
        | "type"
        | "variable"
        | "comment"
        | "operator"
        | "tag"
        | "attr"
        | "regexp",
        string
    >
) =>
    HighlightStyle.define([
        {
            tag: [
                t.keyword,
                t.modifier,
                t.controlKeyword,
                t.operatorKeyword,
                t.definitionKeyword,
                t.moduleKeyword,
                t.self,
                t.null,
                t.bool,
            ],
            color: c.keyword,
        },
        { tag: [t.string, t.special(t.string), t.character], color: c.string },
        { tag: t.regexp, color: c.regexp },
        { tag: [t.number, t.integer, t.float], color: c.number },
        { tag: [t.function(t.variableName), t.function(t.propertyName), t.labelName], color: c.fn },
        { tag: [t.typeName, t.className, t.namespace, t.standard(t.typeName)], color: c.type },
        { tag: [t.variableName, t.propertyName, t.attributeName, t.definition(t.variableName)], color: c.variable },
        { tag: [t.comment, t.lineComment, t.blockComment], color: c.comment, fontStyle: "italic" },
        { tag: [t.operator, t.punctuation, t.bracket, t.separator], color: c.operator },
        { tag: [t.tagName, t.angleBracket], color: c.tag },
        { tag: t.attributeValue, color: c.string },
        { tag: [t.propertyName, t.attributeName], color: c.attr },
    ]);

const darkHighlight = palette({
    keyword: "#569CD6",
    string: "#CE9178",
    number: "#B5CEA8",
    fn: "#DCDCAA",
    type: "#4EC9B0",
    variable: "#9CDCFE",
    comment: "#6A9955",
    operator: "#D4D4D4",
    tag: "#569CD6",
    attr: "#9CDCFE",
    regexp: "#D16969",
});
const lightHighlight = palette({
    keyword: "#0000FF",
    string: "#A31515",
    number: "#098658",
    fn: "#795E26",
    type: "#267F99",
    variable: "#001080",
    comment: "#008000",
    operator: "#000000",
    tag: "#800000",
    attr: "#E50000",
    regexp: "#811F3F",
});

const colors = (isLight: boolean) =>
    EditorView.theme(
        {
            "&": { color: isLight ? "#000000" : "#D4D4D4" },
            ".cm-content": { caretColor: isLight ? "#000000" : "#AEAFAD" },
            ".cm-cursor, .cm-dropCursor": { borderLeftColor: isLight ? "#000000" : "#AEAFAD" },
            "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
                { backgroundColor: isLight ? "#ADD6FF" : "#264F78" },
            ".cm-activeLine": { backgroundColor: isLight ? "#F0F0F0" : "#2A2D2E" },
            ".cm-activeLineGutter": { backgroundColor: "transparent", color: isLight ? "#0B216F" : "#C6C6C6" },
            "&.cm-focused .cm-matchingBracket": {
                backgroundColor: isLight ? "#BAD6FD" : "#0064001a",
                outline: "1px solid #888",
            },
        },
        { dark: !isLight }
    );

const layout = EditorView.theme({
    "&": { height: "100%", fontSize: "inherit" },
    ".cm-scroller": { fontFamily: "inherit", lineHeight: "inherit", overflow: "auto" },
    "&.cm-focused": { outline: "none" },
});

/** The CodeMirror 6 source editor. Loaded lazily, only after the visitor chooses to edit. */
const CodeMirrorEditor: FC<CodeMirrorEditorProps> = ({ name, value, isLight, onChange, onEscape, onRun }) => {
    const host = useRef<HTMLDivElement>(null);
    const view = useRef<EditorView | null>(null);
    // Each file keeps its own state, so undo history survives switching files.
    const states = useRef(new Map<string, EditorState>());
    const theme = useRef(new Compartment());
    const current = useRef({ name, isLight });
    // Handlers change on every render; the view is created once.
    const handlers = useRef({ onChange, onEscape, onRun });
    handlers.current = { onChange, onEscape, onRun };

    const themeExtension = (light: boolean) => [
        colors(light),
        syntaxHighlighting(light ? lightHighlight : darkHighlight),
    ];
    const createState = (fileName: string, doc: string, light: boolean) =>
        EditorState.create({
            doc,
            extensions: [
                lineNumbers(),
                history(),
                drawSelection(),
                indentOnInput(),
                bracketMatching(),
                closeBrackets(),
                highlightActiveLine(),
                languageFor(fileName),
                theme.current.of(themeExtension(light)),
                layout,
                EditorView.contentAttributes.of({
                    "aria-label": `Edit ${fileName}`,
                    "aria-description": "Tab indents · Shift+Tab unindents · Escape exits editing",
                    spellcheck: "false",
                    autocapitalize: "off",
                    autocorrect: "off",
                }),
                keymap.of([
                    { key: "Escape", run: () => (handlers.current.onEscape(), true) },
                    { key: "Mod-Enter", run: () => (handlers.current.onRun(), true) },
                    indentWithTab,
                    ...closeBracketsKeymap,
                    ...defaultKeymap,
                    ...historyKeymap,
                ]),
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) handlers.current.onChange(update.state.doc.toString());
                }),
            ],
        });

    useEffect(() => {
        const editor = new EditorView({ parent: host.current!, state: createState(name, value, isLight) });
        view.current = editor;
        editor.focus();
        return () => {
            editor.destroy();
            view.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Switching file: park the current state and bring back (or create) the next one.
    useEffect(() => {
        const editor = view.current;
        if (!editor || current.current.name === name) return;
        states.current.set(current.current.name, editor.state);
        current.current.name = name;
        editor.setState(states.current.get(name) ?? createState(name, value, current.current.isLight));
        editor.dispatch({ effects: theme.current.reconfigure(themeExtension(current.current.isLight)) });
        editor.focus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name]);

    // A theme change restyles the editor in place; selection, focus and undo history stay.
    useEffect(() => {
        current.current.isLight = isLight;
        view.current?.dispatch({ effects: theme.current.reconfigure(themeExtension(isLight)) });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLight]);

    // The draft can change from outside (Reset): replace the document without losing the editor.
    useEffect(() => {
        const editor = view.current;
        if (editor && editor.state.doc.toString() !== value)
            editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: value } });
    }, [value, name]);

    return <div ref={host} className="sc-editor-cm" />;
};

export default CodeMirrorEditor;

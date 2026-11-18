import { baseAppPath } from "../../constants";
import { FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { DraftGuardContext } from "../LivePreview/DraftGuardContext";
import { EPageFramework, getFrameworkContent } from "../../helpers/shared/Helpers/frameworkParametrization";
import { EPageLayout, ExampleSourceFile } from "../../helpers/types/types";
import DrawerContent from "../DrawerContent/DrawerContent";
import ExamplesRoot from "../Examples/ExampleRootDetails";
import GalleryItems from "../GalleryItems";
import MarkdownContent from "./MarkdownContent";
import { CodeSandbox } from "../CodeSandbox";
import { StackblitzEditor } from "../CodeSandbox/StackblitzEditor";
import { SandboxPlatform } from "../CodeSandbox/SandboxPlatform";
import { CodeActionButtons } from "./CodeActionButtons";
import { CodePreview } from "../CodePreview/CodePreview";
import { LivePreview } from "../LivePreview/LivePreview";
import type { ConsoleEntry } from "../LivePreview/consoleLog";
import { warmLiveRuntime } from "../LivePreview/warmLiveRuntime";
import { useDraftGuard } from "../LivePreview/useDraftGuard";
import { editableFiles, getLiveEditAvailability, hasDraft, toRouterPath } from "../CodePreview/liveEditing";
import { ConfirmDialog } from "../CodeSandbox/components/ConfirmDialog";
import { ExamplesSubtitle } from "./ExamplesSubtitle";
import { SourceFilesContext } from "./SourceFilesLoading/SourceFilesContext";
import type { StackBlitzResponse } from "../../helpers/types/types";
import { _useContext } from "../../helpers/shared/Helpers/Context";
import { ALL_MENU_ITEMS } from "../AppRouter/examples";
import { getSeeAlsoGalleryItems } from "../../helpers/SciChartExamples";
import { ExampleBreadcrumbs } from "../Breadcrumbs/ExampleBreadcrumbs";
import MenuIcon from "@mui/icons-material/Menu";

const EXAMPLE_LAYOUT_STORAGE_KEY = "scichart-demo-example-layout";
const AUTO_RUN_STORAGE_KEY = "scichart-demo-live-auto-run";

const getSavedAutoRun = () => {
    try {
        return window.localStorage.getItem(AUTO_RUN_STORAGE_KEY) !== "false";
    } catch {
        return true;
    }
};

const getSavedPageLayout = (fallback: EPageLayout): EPageLayout => {
    if (typeof window === "undefined") return fallback;
    try {
        const savedLayout = window.localStorage.getItem(EXAMPLE_LAYOUT_STORAGE_KEY);
        return savedLayout === EPageLayout.Default || savedLayout === EPageLayout.MaxWidth ? savedLayout : fallback;
    } catch {
        return fallback;
    }
};

const AppDetailsRouter: FC<{
    isExampleNavigationOpen: boolean;
    isNarrowViewport: boolean;
    toggleExampleNavigation: () => void;
}> = ({
    isExampleNavigationOpen,
    isNarrowViewport,
    toggleExampleNavigation,
}) => {
    const { state } = _useContext();
    const { currentExample, framework: selectedFramework } = state;
    const seeAlso = currentExample.seeAlso ?? getSeeAlsoGalleryItems(ALL_MENU_ITEMS, currentExample, selectedFramework);
    const pageTitle = getFrameworkContent(currentExample.title, selectedFramework);

    const initialSourceFilesVariant = useContext(SourceFilesContext);
    const [sourceFiles, setSourceFiles] = useState<ExampleSourceFile[]>(initialSourceFilesVariant.files);
    const [pageLayout, setPageLayout] = useState<EPageLayout>(() =>
        getSavedPageLayout(currentExample.pageLayout ?? EPageLayout.Default)
    );
    const exampleNavigationRef = useRef<HTMLDivElement>(null);
    const previousNavigationOpen = useRef(isExampleNavigationOpen);
    const [embedCode, setEmbedCode] = useState<boolean>(false);
    const [sandboxPlatform, setSandboxPlatform] = useState<SandboxPlatform>(SandboxPlatform.CodeSandbox);
    const [sandboxId, setSandboxId] = useState<string>("");
    const [projectFiles, setProjectFiles] = useState<StackBlitzResponse>(null);
    const navigate = useNavigate();
    const [draft, setDraft] = useState<ExampleSourceFile[] | null>(null);
    const [autoRun, setAutoRun] = useState(getSavedAutoRun);
    const [runRequest, setRunRequest] = useState(0);
    const [consoleEntries, setConsoleEntries] = useState<ConsoleEntry[]>([]);
    const [ranFiles, setRanFiles] = useState<ExampleSourceFile[] | null>(null);
    // A navigation waiting for the visitor to confirm that the draft may be discarded.
    const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
    const [sourceFramework, setSourceFramework] = useState<EPageFramework | null>(initialSourceFilesVariant.framework);

    useEffect(() => {
        setDraft(null);
        setRanFiles(null);
        setPageLayout(getSavedPageLayout(currentExample.pageLayout ?? EPageLayout.Default));
        window.scrollTo({
            top: 0,
        });
        // Reset sandbox state when example changes
        setEmbedCode(false);
        setSandboxId("");
        setProjectFiles(null);

        const controller = new AbortController();
        fetch(`${baseAppPath}/source/${currentExample.path}?framework=${selectedFramework}`, {
            signal: controller.signal,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((json: { files: { name: string; content: string }[]; framework: EPageFramework }) => {
                setSourceFiles(json.files);
                setSourceFramework(json.framework);
            })
            .catch((error) => {
                if (error.name !== "AbortError") console.error("Unable to load example source", error);
            });
        return () => controller.abort();
    }, [currentExample, selectedFramework]);

    useEffect(() => {
        const navigationChanged = previousNavigationOpen.current !== isExampleNavigationOpen;
        previousNavigationOpen.current = isExampleNavigationOpen;
        if (!navigationChanged) return;
        requestAnimationFrame(() => {
            if (isExampleNavigationOpen && isNarrowViewport) {
                exampleNavigationRef.current?.querySelector<HTMLElement>("a, button")?.focus();
            }
        });
    }, [isExampleNavigationOpen, isNarrowViewport]);

    const handleBack = () => {
        setEmbedCode(false);
        setSandboxId("");
        setProjectFiles(null);
    };

    const handlePageLayoutChange = (layout: EPageLayout) => {
        setPageLayout(layout);
        try {
            window.localStorage.setItem(EXAMPLE_LAYOUT_STORAGE_KEY, layout);
        } catch {
            // Keep layout switching available when browser storage is unavailable.
        }
    };

    const handleSandboxOpen = (platform: SandboxPlatform, id: string, files?: StackBlitzResponse) => {
        setSandboxPlatform(platform);
        setSandboxId(id);
        if (files) {
            setProjectFiles(files);
        }
        setEmbedCode(true);
    };

    const liveFramework =
        sourceFramework === EPageFramework.React || sourceFramework === EPageFramework.Vanilla
            ? sourceFramework
            : null;
    const liveAvailability = getLiveEditAvailability({
        framework: sourceFramework || selectedFramework,
        liveEdit: currentExample.liveEdit,
        narrow: isNarrowViewport,
    }).status;
    const draftActive = !!draft && hasDraft(draft, sourceFiles);
    const showLivePreview = draftActive && liveFramework !== null && liveAvailability === "available";
    const askBeforeLeaving = useCallback((proceed: () => void) => setPendingNavigation(() => proceed), []);
    // Links are caught here; code that calls `navigate` goes through useGuardedNavigate.
    const handleBlockedLink = useCallback(
        (href: string) => askBeforeLeaving(() => navigate(toRouterPath(href, baseAppPath))),
        [askBeforeLeaving, navigate]
    );
    useDraftGuard(draftActive, handleBlockedLink);
    const draftGuard = useMemo(() => ({ active: draftActive, ask: askBeforeLeaving }), [draftActive, askBeforeLeaving]);
    // With auto-run off, the play button appears once the draft has changed since the last run.
    const runPending = !autoRun && showLivePreview && draft !== ranFiles;
    const liveControls = useMemo(
        () => ({
            availability: liveAvailability,
            autoRun,
            onAutoRunChange: (value: boolean) => {
                setAutoRun(value);
                try {
                    window.localStorage.setItem(AUTO_RUN_STORAGE_KEY, String(value));
                } catch {
                    // The switch still works for this visit.
                }
            },
            onRun: () => setRunRequest((count) => count + 1),
            onPrepare: warmLiveRuntime,
            runPending,
        }),
        [liveAvailability, autoRun, runPending]
    );

    const renderEditor = () => {
        return sandboxPlatform === SandboxPlatform.CodeSandbox ? (
            <CodeSandbox
                id={sandboxId}
                onBack={handleBack}
                platform={sandboxPlatform}
                exampleName={pageTitle}
            />
        ) : (
            <StackblitzEditor id={sandboxId} onBack={handleBack} exampleName={pageTitle} projectFiles={projectFiles} />
        );
    };

    return (
        <DraftGuardContext.Provider value={draftGuard}>
        <div className={`sc-app-details-layout ${isExampleNavigationOpen ? "sc-app-details-nav-open" : ""}`}>
            <div
                id="EXAMPLE_NAVIGATION"
                className="sc-app-details-drawer"
                ref={exampleNavigationRef}
                aria-hidden={!isExampleNavigationOpen}
                inert={!isExampleNavigationOpen}
            >
                <DrawerContent />
            </div>
            <button
                className="sc-app-details-nav-backdrop"
                type="button"
                onClick={toggleExampleNavigation}
                aria-label="Close example navigation"
                aria-hidden={!isExampleNavigationOpen}
                inert={!isExampleNavigationOpen}
            />
            <div className="sc-app-details-main" inert={isNarrowViewport && isExampleNavigationOpen}>
                <div
                    id="EXAMPLE_CONTENT_WRAPPER"
                    className="sc-app-details-content"
                    data-layout={pageLayout}
                    data-sandbox-open={embedCode ? "" : undefined}
                >
                    <div className="sc-app-details-header">
                        <div className="sc-app-details-header-actions">
                            <div className="sc-app-details-breadcrumbs">
                                <button
                                    type="button"
                                    className="sc-button sc-button-icon"
                                    onClick={toggleExampleNavigation}
                                    aria-controls="EXAMPLE_NAVIGATION"
                                    aria-expanded={isExampleNavigationOpen}
                                    aria-label={`${isExampleNavigationOpen ? "Hide" : "Show"} example navigation`}
                                    title={`${isExampleNavigationOpen ? "Hide" : "Show"} example navigation`}
                                >
                                    <MenuIcon />
                                </button>
                                <ExampleBreadcrumbs />
                            </div>

                            <div
                                className="sc-button-group sc-app-layout-buttons"
                                role="group"
                                aria-label="Example layout"
                            >
                                <button
                                    type="button"
                                    className="sc-button sc-button-icon"
                                    onClick={() => handlePageLayoutChange(EPageLayout.Default)}
                                    aria-label="Side by side layout"
                                    title="Side by side layout"
                                    aria-pressed={pageLayout === EPageLayout.Default}
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        aria-hidden="true"
                                    >
                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                        <path d="M12 3v18" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    className="sc-button sc-button-icon"
                                    onClick={() => handlePageLayoutChange(EPageLayout.MaxWidth)}
                                    aria-label="Stacked layout"
                                    title="Stacked layout"
                                    aria-pressed={pageLayout === EPageLayout.MaxWidth}
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        aria-hidden="true"
                                    >
                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                        <path d="M3 12h18" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <h1 id="EXAMPLE_TITLE">{pageTitle}</h1>

                        <ExamplesSubtitle
                            content={currentExample.subtitle(selectedFramework)}
                            alsoKnownAs={currentExample?.alsoKnownAs}
                        />
                    </div>

                    {/* Main example section */}
                    {embedCode && renderEditor()}
                    {/* While a hosted sandbox is open the source editor stays mounted (hidden) if there is a draft,
                        so coming back does not show the original code over the edited chart. */}
                    {(!embedCode || draftActive) && (
                        <div className="sc-app-chart-code" style={embedCode ? { display: "none" } : undefined}>
                            <ExamplesRoot
                                preview={
                                    showLivePreview ? (
                                        <LivePreview
                                            files={draft!}
                                            framework={liveFramework === EPageFramework.React ? "react" : "javascript"}
                                            autoRun={autoRun}
                                            runRequest={runRequest}
                                            onConsole={setConsoleEntries}
                                            onRan={setRanFiles}
                                        />
                                    ) : undefined
                                }
                            />
                            <CodeActionButtons
                                draftFiles={draftActive && draft ? editableFiles(draft) : null}
                                onSandboxOpen={handleSandboxOpen} className="sc-editor-actions" />
                            <CodePreview
                                key={`${currentExample.path}:${sourceFramework}`}
                                files={sourceFiles}
                                framework={sourceFramework || selectedFramework}
                                examplePath={currentExample.path}
                                onFilesChange={setDraft}
                                live={liveControls}
                                consoleEntries={showLivePreview ? consoleEntries : null}
                            />
                        </div>
                    )}
                    <ConfirmDialog
                        isOpen={pendingNavigation !== null}
                        title="Discard your changes?"
                        message="You have edited this example. Leaving this page will discard your changes."
                        onCancel={() => setPendingNavigation(null)}
                        onConfirm={() => {
                            const proceed = pendingNavigation!;
                            setPendingNavigation(null);
                            setDraft(null);
                            proceed();
                        }}
                    />
                    <MarkdownContent />
                </div>
                <GalleryItems examples={seeAlso} needsH1={false} />
            </div>
        </div>
        </DraftGuardContext.Provider>
    );
};

export default AppDetailsRouter;

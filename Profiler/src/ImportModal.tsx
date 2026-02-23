import * as React from "react";
import "./ImportModal.css";

interface ImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (data: string) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport }) => {
    const [jsonText, setJsonText] = React.useState("");
    const [dragActive, setDragActive] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleImportText = () => {
        if (jsonText.trim()) {
            try {
                JSON.parse(jsonText);
                onImport(jsonText);
                setJsonText("");
                onClose();
            } catch (error) {
                alert("Invalid JSON format. Please check your input.");
            }
        }
    };

    const handleFileRead = (file: File) => {
        const reader = new FileReader();
        reader.onload = e => {
            const content = e.target?.result as string;
            try {
                JSON.parse(content);
                onImport(content);
                onClose();
            } catch (error) {
                alert("Invalid JSON file. Please check the file content.");
            }
        };
        reader.readAsText(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type === "application/json" || file.name.endsWith(".json")) {
                handleFileRead(file);
            } else {
                alert("Please drop a JSON file.");
            }
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileRead(e.target.files[0]);
        }
    };

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Import JSON Data</h2>
                    <div className="modal-header-actions">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json,application/json"
                            onChange={handleFileSelect}
                            style={{ display: "none" }}
                        />
                        <button className="browse-file-button" onClick={handleBrowseClick}>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                                <polyline points="13 2 13 9 20 9" />
                            </svg>
                            Browse File
                        </button>
                        <button className="modal-close" onClick={onClose}>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="modal-body">
                    <div className="import-section">
                        <div
                            className={`textarea-wrapper ${dragActive ? "drag-active" : ""}`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                        >
                            <textarea
                                className="json-editor"
                                placeholder="Paste your JSON data here or drop a JSON file..."
                                value={jsonText}
                                onChange={e => setJsonText(e.target.value)}
                            />
                        </div>
                        <button className="import-button" onClick={handleImportText} disabled={!jsonText.trim()}>
                            Import JSON
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

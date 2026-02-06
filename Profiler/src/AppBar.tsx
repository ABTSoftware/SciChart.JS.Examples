import * as React from "react";
import { ThemeToggle } from "./ThemeToggle";
import { ImportModal } from "./ImportModal";
import Logo from "./scichart-logo-app-bar.svg";
import LogoSmall from "./scichart-logo-app-bar-mobile.svg";
import "./AppBar.css";

interface AppBarProps {
    onImport?: (data: string) => void;
}

export const AppBar: React.FC<AppBarProps> = ({ onImport }) => {
    const [isImportModalOpen, setIsImportModalOpen] = React.useState(false);

    const handleImport = (data: string) => {
        if (onImport) {
            onImport(data);
        }
    };
    return (
        <div className="app-bar">
            <div className="app-bar-left">
                <img
                    src={typeof window !== "undefined" && window?.innerWidth <= 768 ? LogoSmall : Logo}
                    alt="SciChart Logo"
                    className="app-bar-logo"
                />
                <h1 className="app-bar-title">Profiler</h1>
            </div>
            <div className="app-bar-center">
                <button className="app-bar-button" onClick={() => setIsImportModalOpen(true)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Import
                </button>
                <button className="app-bar-button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    Help
                </button>
            </div>
            <div className="app-bar-right">
                <ThemeToggle />
            </div>
            <ImportModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImport}
            />
        </div>
    );
};

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

const NavigationContext = createContext<{
    isCategoryCollapsed: (id: string) => boolean;
    toggleCategory: (id: string) => void;
    expandCategory: (id: string) => void;
    mostVisibleCategory?: string;
} | null>(null);

export function NavigationProvider({
    children,
    mostVisibleCategory,
}: {
    children: ReactNode;
    mostVisibleCategory?: string;
}) {
    const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
    const toggleCategory = useCallback((id: string) => {
        setCollapsedCategories((current) => ({ ...current, [id]: !(current[id] ?? true) }));
    }, []);

    const expandCategory = useCallback((id: string) => {
        setCollapsedCategories((current) => (current[id] === false ? current : { ...current, [id]: false }));
    }, []);

    return (
        <NavigationContext.Provider
            value={{
                isCategoryCollapsed: (id) => collapsedCategories[id] ?? true,
                toggleCategory,
                expandCategory,
                mostVisibleCategory,
            }}
        >
            {children}
        </NavigationContext.Provider>
    );
}

export function useNavigationContext() {
    const context = useContext(NavigationContext);
    if (!context) throw new Error("useNavigationContext must be used within a NavigationProvider");
    return context;
}

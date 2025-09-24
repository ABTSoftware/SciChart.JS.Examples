import type { GridItemHTMLElement, GridStack, GridStackOptions, GridStackWidget } from "../gridStack/gridstack";
import { type PropsWithChildren, useCallback, useState } from "react";
import { GridStackContext } from "./grid-stack-context";

export function GridStackProvider({
  children,
  initialOptions,
}: PropsWithChildren<{ initialOptions: GridStackOptions }>) {
  const [gridStack, setGridStack] = useState<GridStack | null>(null);
  const [rawWidgetMetaMap, setRawWidgetMetaMap] = useState(() => {
    const map = new Map<string, GridStackWidget>();
    const deepFindNodeWithContent = (obj: GridStackWidget) => {
      if (obj.id && obj.content) {
        map.set(obj.id, obj);
      }
      if (obj.subGridOpts?.children) {
        obj.subGridOpts.children.forEach((child: GridStackWidget) => {
          deepFindNodeWithContent(child);
        });
      }
    };
    initialOptions.children?.forEach((child: GridStackWidget) => {
      deepFindNodeWithContent(child);
    });
    return map;
  });

  const addWidget = useCallback(
    (fn: (id: string) => Omit<GridStackWidget, "id">) => {
      const newId = `widget-${Math.random().toString(36).substring(2, 15)}`;
      const widget = fn(newId);
      gridStack?.addWidget({ ...widget, id: newId });
      setRawWidgetMetaMap((prev) => {
        const newMap = new Map<string, GridStackWidget>(prev);
        newMap.set(newId, widget);
        return newMap;
      });
    },
    [gridStack]
  );

  const addSubGrid = useCallback(
    (
      fn: (
        id: string,
        withWidget: (w: Omit<GridStackWidget, "id">) => GridStackWidget
      ) => Omit<GridStackWidget, "id">
    ) => {
      const newId = `sub-grid-${Math.random().toString(36).substring(2, 15)}`;
      const subWidgetIdMap = new Map<string, GridStackWidget>();

      const widget = fn(newId, (w) => {
        const subWidgetId = `widget-${Math.random()
          .toString(36)
          .substring(2, 15)}`;
        subWidgetIdMap.set(subWidgetId, w);
        return { ...w, id: subWidgetId };
      });

      gridStack?.addWidget({ ...widget, id: newId });

      setRawWidgetMetaMap((prev) => {
        const newMap = new Map<string, GridStackWidget>(prev);
        subWidgetIdMap.forEach((meta, id) => {
          newMap.set(id, meta);
        });
        return newMap;
      });
    },
    [gridStack]
  );

  const removeWidget = useCallback(
    (id: string) => {
      console.log(`Removing widget with ID: ${id}`);
      
      // Check if this is a subgrid title by ID pattern (e.g., "sub-grid-1-title")
      const isSubgridTitle = id.includes('-title');
      
      if (isSubgridTitle) {
        console.log('This appears to be a subgrid title based on ID pattern');
        
        // Try to find the parent subgrid ID by removing the "-title" suffix
        const possibleSubgridId = id.replace('-title', '');
        console.log(`Looking for parent subgrid with ID: ${possibleSubgridId}`);
        
        // Find the subgrid element
        const subgridElement = document.querySelector<GridItemHTMLElement>(`[gs-id="${possibleSubgridId}"]`);
        
        if (subgridElement) {
          console.log('Found parent subgrid element');
          
          // Get all child elements before removing the subgrid
          const childElements = Array.from(subgridElement.querySelectorAll('.grid-stack-item[gs-id]'))
            .map(el => el.getAttribute('gs-id'))
            .filter(id => id !== null) as string[];
          
          console.log(`Child elements to remove: ${childElements.join(', ')}`);
          
          // Remove the subgrid using the main grid instance
          if (gridStack) {
            console.log('Removing subgrid using main gridStack instance');
            gridStack.removeWidget(subgridElement);
          }
          
          // Clean up the widget meta map
          setRawWidgetMetaMap(prev => {
            const newMap = new Map<string, GridStackWidget>(prev);
            
            // Remove all child elements
            childElements.forEach(childId => {
              if (childId) newMap.delete(childId);
            });
            
            // Remove the subgrid itself
            newMap.delete(possibleSubgridId);
            
            // Remove the title element
            newMap.delete(id);
            
            return newMap;
          });
          
          return; // Exit early as we've handled everything
        }
      }
      
      // Get the widget element
      const element = document.querySelector<GridItemHTMLElement>(`[gs-id="${id}"]`);
      
      if (!element) {
        console.warn(`Element with id ${id} not found`);
        return;
      }
      
      // Determine the appropriate grid instance to use
      const nestedGrid = element.closest('.grid-stack-nested');
      let gridInstance = gridStack;
      
      if (nestedGrid && (nestedGrid as any).gridstack) {
        // If it's in a nested grid, use that grid's instance
        gridInstance = (nestedGrid as any).gridstack;
      } else {
        // Otherwise try to find the closest grid
        const closestGrid = element.closest('.grid-stack');
        if (closestGrid && (closestGrid as any).gridstack) {
          gridInstance = (closestGrid as any).gridstack;
        }
      }
      
      // Remove the widget using the appropriate grid instance
      if (gridInstance) {
        console.log('Removing widget using grid instance');
        gridInstance.removeWidget(element);
      } else {
        console.warn('No grid instance found to remove widget');
      }
      
      // Update our internal map
      setRawWidgetMetaMap(prev => {
        const newMap = new Map<string, GridStackWidget>(prev);
        newMap.delete(id);
        return newMap;
      });
    },
    [gridStack]
  );

  const saveOptions = useCallback(() => {
    // Explicitly save the current grid state, not the initial options
    if (!gridStack) return undefined;
    return gridStack.save(true, true, (_, widget) => widget);
  }, [gridStack]);

  const saveOptionsToFile = useCallback(() => {
    // Get the current layout state, not the initial options
    const currentLayout = saveOptions();
    if (currentLayout) {
      const jsonString = JSON.stringify(currentLayout, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'grid-current-layout.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, [saveOptions]);

  const loadOptionsFromFile = useCallback(() => {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    
    fileInput.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonContent = e.target?.result as string;
          const layout = JSON.parse(jsonContent);
          
          if (!gridStack) return;
          
          // Clear the current grid
          gridStack.removeAll();
          setRawWidgetMetaMap(new Map<string, GridStackWidget>());
          
          // Load the new layout
          if (Array.isArray(layout)) {
            // Handle array of widgets
            gridStack.load(layout);
            
            // Update the widget meta map
            const newMap = new Map<string, GridStackWidget>();
            const deepFindNodeWithContent = (obj: GridStackWidget) => {
              if (obj.id && obj.content) {
                newMap.set(obj.id, obj);
              }
              if (obj.subGridOpts?.children) {
                obj.subGridOpts.children.forEach((child: GridStackWidget) => {
                  deepFindNodeWithContent(child);
                });
              }
            };
            
            layout.forEach((widget: GridStackWidget) => {
              deepFindNodeWithContent(widget);
            });
            
            setRawWidgetMetaMap(newMap);
          } else if (layout.children) {
            // Handle GridStackOptions object
            gridStack.load(layout.children);
            
            // Update the widget meta map
            const newMap = new Map<string, GridStackWidget>();
            const deepFindNodeWithContent = (obj: GridStackWidget) => {
              if (obj.id && obj.content) {
                newMap.set(obj.id, obj);
              }
              if (obj.subGridOpts?.children) {
                obj.subGridOpts.children.forEach((child: GridStackWidget) => {
                  deepFindNodeWithContent(child);
                });
              }
            };
            
            layout.children.forEach((child: GridStackWidget) => {
              deepFindNodeWithContent(child);
            });
            
            setRawWidgetMetaMap(newMap);
          }
        } catch (error) {
          console.error('Error loading layout:', error);
          alert('Error loading layout. Please check the file format.');
        }
      };
      
      reader.readAsText(file);
    };
    
    // Trigger the file input click
    fileInput.click();
  }, [gridStack]);

  const removeAll = useCallback(() => {
    gridStack?.removeAll();
    setRawWidgetMetaMap(new Map<string, GridStackWidget>());
  }, [gridStack]);

  return (
    <GridStackContext.Provider
      value={{
        initialOptions,
        gridStack,

        addWidget,
        removeWidget,
        addSubGrid,
        saveOptions,
        saveOptionsToFile,
        loadOptionsFromFile,
        removeAll,

        _gridStack: {
          value: gridStack,
          set: setGridStack,
        },
        _rawWidgetMetaMap: {
          value: rawWidgetMetaMap,
          set: setRawWidgetMetaMap,
        },
      }}
    >
      {children}
    </GridStackContext.Provider>
  );
}

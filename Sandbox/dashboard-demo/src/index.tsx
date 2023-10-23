import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import SciChartMemoryDebugWrapper from './SciChartMemoryDebugWrapper';

// Clear the existing HTML content
document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
const root = createRoot(document.getElementById('app'));
root.render(
    // <SciChartMemoryDebugWrapper>
        <App />
    // </SciChartMemoryDebugWrapper>
);

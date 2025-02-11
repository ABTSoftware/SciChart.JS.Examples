import { createRoot } from "react-dom/client";
import App from "./App";
import React from "react";

function Main() {
  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

const root = createRoot(rootElement);
root.render(<Main />);

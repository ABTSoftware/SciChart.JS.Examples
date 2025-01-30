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
const root = createRoot(document.getElementById("root"));
root.render(<Main />);

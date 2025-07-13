// frontend/src/index.js
import React from "react";
import { SelectedItemProvider } from "./SelectedItemContext";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";        // tailwind directives live here

createRoot(document.getElementById("root")).render(
  <SelectedItemProvider>
    <App />
  </SelectedItemProvider>
);

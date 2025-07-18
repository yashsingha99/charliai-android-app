import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ModalProvider } from "./Models/ModalContext.jsx";
import GlobalModal from "./Models/GlobalModal.jsx";
import { ThemeProvider } from "./context/theme-comtext";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ModalProvider>
          <App />
          <GlobalModal />
        </ModalProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);

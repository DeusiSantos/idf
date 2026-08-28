import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Limpa service workers antigos do sistema anterior
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((regs) => regs.forEach((r) => r.unregister()))
    .catch(() => {});
}

createRoot(document.getElementById("root")!).render(<App />);

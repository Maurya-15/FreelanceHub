import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Theme initialization: set dark/light mode before app renders
const storedTheme = localStorage.getItem('theme');
if (storedTheme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

createRoot(document.getElementById("root")!).render(<App />);

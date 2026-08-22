import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import Reveal from "./components/Reveal.jsx";
import ProjectLore from "./pages/ProjectLore.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Reveal />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/project/lore" element={<ProjectLore />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

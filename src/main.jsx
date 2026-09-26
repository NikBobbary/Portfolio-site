import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import Reveal from "./components/Reveal.jsx";
import CaseStudyDetail from "./pages/CaseStudyDetail.jsx";
import ProjectLore from "./pages/ProjectLore.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Reveal />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/work" element={<App isWorkView={true} />} />
        <Route path="/project/lore" element={<ProjectLore />} />
        <Route path="/:slug" element={<CaseStudyDetail />} />
        <Route path="/work/:slug" element={<CaseStudyDetail />} />
        <Route path="/case/:slug" element={<CaseStudyDetail />} />
        <Route path="/~:slug" element={<CaseStudyDetail />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

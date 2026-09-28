import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App.jsx";
import Reveal from "./components/Reveal.jsx";
import CaseStudyDetail from "./pages/CaseStudyDetail.jsx";
import ProjectLore from "./pages/ProjectLore.jsx";
import { isWorkSubdomain, redirectToMain } from "./utils/domain.js";
import "./styles.css";

function NotFoundRedirect() {
  useEffect(() => {
    redirectToMain();
  }, []);

  return null;
}

function RootRoutes() {
  const isWork = isWorkSubdomain();

  if (isWork) {
    return (
      <Routes>
        <Route path="/" element={<App isWorkView={true} />} />
        <Route path="/work" element={<Navigate to="/" replace />} />
        <Route path="/:slug" element={<CaseStudyDetail />} />
        <Route path="/work/:slug" element={<CaseStudyDetail />} />
        <Route path="/case/:slug" element={<CaseStudyDetail />} />
        <Route path="/project/:slug" element={<CaseStudyDetail />} />
        <Route path="/~:slug" element={<CaseStudyDetail />} />
        <Route path="*" element={<NotFoundRedirect />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<App isWorkView={false} />} />
      <Route path="/project/lore" element={<ProjectLore />} />
      <Route path="/work" element={<Navigate to="/" replace />} />
      <Route path="/work/*" element={<NotFoundRedirect />} />
      <Route path="/case/*" element={<NotFoundRedirect />} />
      <Route path="/~*" element={<NotFoundRedirect />} />
      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Reveal />
      <RootRoutes />
    </BrowserRouter>
  </StrictMode>
);

import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import App from "./App.jsx";
import Reveal from "./components/Reveal.jsx";
import CaseStudyDetail from "./pages/CaseStudyDetail.jsx";
import ProjectLore from "./pages/ProjectLore.jsx";
import { isLocalhost, isWorkSubdomain, redirectToMain, redirectToWork } from "./utils/domain.js";
import "./styles.css";

function NotFoundRedirect() {
  useEffect(() => {
    redirectToMain();
  }, []);

  return null;
}

function WorkRedirect() {
  useEffect(() => {
    redirectToWork();
  }, []);

  return null;
}

function RootRoutes() {
  const isWork = isWorkSubdomain();
  const isLocal = isLocalhost();

  if (isWork) {
    // work.nikbobbary.com landing:
    // hero -> cases -> about -> snapshots -> footer
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

  // www.nikbobbary.com landing:
  // hero -> snapshots -> about -> footer
  return (
    <Routes>
      <Route path="/" element={<App isWorkView={false} />} />
      <Route path="/work" element={isLocal ? <App isWorkView={true} /> : <WorkRedirect />} />
      <Route path="/:slug" element={isLocal ? <CaseStudyDetail /> : <NotFoundRedirect />} />
      <Route path="/work/:slug" element={isLocal ? <CaseStudyDetail /> : <WorkRedirect />} />
      <Route path="/case/:slug" element={isLocal ? <CaseStudyDetail /> : <WorkRedirect />} />
      <Route path="/project/lore" element={<ProjectLore />} />
      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Reveal />
      <RootRoutes />
      <Analytics />
    </BrowserRouter>
  </StrictMode>
);

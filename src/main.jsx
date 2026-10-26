import { StrictMode, Suspense, lazy, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import App from "./App.jsx";
import Reveal from "./components/Reveal.jsx";
import StageGL from "./components/StageGL.jsx";
import CaseStudyDetail from "./pages/CaseStudyDetail.jsx";
import ProjectLore from "./pages/ProjectLore.jsx";
const PlayWarp = lazy(() => import("./pages/PlayWarp.jsx"));
import {
  isLocalhost,
  isPlaySubdomain,
  isWorkSubdomain,
  redirectToMain,
  redirectToWork,
} from "./utils/domain.js";
import "./styles.css";

// Initialize Lenis smooth scroll instance with autoRaf: true
export const lenis = new Lenis({
  autoRaf: true,
});

let isScrollTriggerSynced = false;

// Synchronize Lenis scrolling with GSAP ScrollTrigger if applicable
export function syncScrollTrigger(customScrollTrigger) {
  if (isScrollTriggerSynced) return true;
  const st =
    customScrollTrigger ||
    (typeof window !== "undefined" &&
      (window.ScrollTrigger || (window.gsap && window.gsap.ScrollTrigger)));

  if (st && typeof st.update === "function") {
    lenis.on("scroll", st.update);
    isScrollTriggerSynced = true;
    return true;
  }
  return false;
}

if (typeof window !== "undefined") {
  window.lenis = lenis;

  if (!syncScrollTrigger()) {
    window.addEventListener("DOMContentLoaded", () => syncScrollTrigger(), {
      once: true,
    });
    window.addEventListener("load", () => syncScrollTrigger(), {
      once: true,
    });
  }
}

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
  const isPlay = isPlaySubdomain();
  const isWork = isWorkSubdomain();
  const isLocal = isLocalhost();

  // play.nikbobbary.com (or ?subdomain=play / play.localhost)
  if (isPlay) {
    return (
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={null}>
              <PlayWarp />
            </Suspense>
          }
        />
        <Route path="/play" element={<Navigate to="/" replace />} />
        <Route
          path="*"
          element={
            <Suspense fallback={null}>
              <PlayWarp />
            </Suspense>
          }
        />
      </Routes>
    );
  }

  if (isWork) {
    // work.nikbobbary.com landing (or local testing with ?subdomain=work / work.localhost):
    // hero -> cases -> about -> snapshots -> footer
    return (
      <Routes>
        <Route path="/" element={<App isWorkView={true} />} />
        <Route path="/work" element={<Navigate to="/" replace />} />
        <Route
          path="/play"
          element={
            <Suspense fallback={null}>
              <PlayWarp />
            </Suspense>
          }
        />
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
      <Route
        path="/play"
        element={
          <Suspense fallback={null}>
            <PlayWarp />
          </Suspense>
        }
      />
      <Route path="/work" element={isLocal ? <App isWorkView={true} /> : <WorkRedirect />} />
      <Route path="/:slug" element={isLocal ? <CaseStudyDetail /> : <NotFoundRedirect />} />
      <Route path="/work/:slug" element={isLocal ? <CaseStudyDetail /> : <WorkRedirect />} />
      <Route path="/case/:slug" element={isLocal ? <CaseStudyDetail /> : <WorkRedirect />} />
      <Route path="/project/lore" element={<ProjectLore />} />
      <Route path="*" element={<NotFoundRedirect />} />
    </Routes>
  );
}

function AppShell() {
  const isPlay = isPlaySubdomain();
  const location = useLocation();
  const isPlayActive = isPlay || location.pathname === "/play";

  return (
    <>
      {!isPlayActive && <StageGL />}
      {!isPlayActive && <Reveal />}
      <RootRoutes />
      <Analytics />
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  </StrictMode>
);


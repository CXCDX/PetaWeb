import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { C } from "./constants";
import { MediaProvider } from "./hooks/useMedia";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import IssuesPage from "./pages/Issues";
import ArticleDetail from "./pages/ArticleDetail";
import Contact from "./pages/Contact";

function ScrollToTop({ containerRef }) {
  const { pathname } = useLocation();
  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = 0;
  }, [pathname, containerRef]);
  return null;
}

function AppShell() {
  const ref = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const h = () => setScrollY(el.scrollTop);
    el.addEventListener("scroll", h, { passive: true });
    return () => el.removeEventListener("scroll", h);
  }, []);

  return (
    <div ref={ref} style={{ width: "100%", height: "100vh", overflow: "auto", background: C.cream, cursor: "default", WebkitOverflowScrolling: "touch" }}>
      <ScrollToTop containerRef={ref} />
      <Nav scrollY={scrollY} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/issues" element={<IssuesPage />} />
        <Route path="/issues/:issueNum" element={<IssuesPage />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <MediaProvider>
      <BrowserRouter>
        <style>{`
          * { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
          html { -webkit-text-size-adjust:100%; }
          ::selection { background:${C.green}; color:${C.white}; }
          ::-webkit-scrollbar { width:6px; height:0; }
          ::-webkit-scrollbar-track { background:${C.cream}; }
          ::-webkit-scrollbar-thumb { background:${C.greyLight}; border-radius:3px; }
          ::-webkit-scrollbar-thumb:hover { background:${C.greyMed}; }
          img { -webkit-user-drag:none; user-select:none; }
          input, textarea { font-family: inherit; }
          button:focus-visible { outline: 2px solid ${C.green}; outline-offset: 2px; }
          a:focus-visible { outline: 2px solid ${C.green}; outline-offset: 2px; }
          @media (max-width:768px) {
            ::-webkit-scrollbar { display:none; }
            * { scrollbar-width:none; }
          }
        `}</style>
        <AppShell />
      </BrowserRouter>
    </MediaProvider>
  );
}

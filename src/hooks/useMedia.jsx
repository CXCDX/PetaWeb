import { useState, useEffect, createContext, useContext } from "react";

const MediaContext = createContext({ mob: false, tab: false, w: 1200 });

export function MediaProvider({ children }) {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  const value = { mob: w < 768, tab: w < 1024, w };
  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
}

export function useMedia() {
  return useContext(MediaContext);
}

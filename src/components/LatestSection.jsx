import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { C, FONT } from "../constants";
import { useMedia } from "../hooks/useMedia";
import { ARTICLES } from "../data/articles";
import ArrowBtn from "./ArrowBtn";

const CARD_LAYOUTS = [
  { w: 360, h: 520, mw: 260, mh: 360, type: "tall" },
  { w: 300, h: 380, mw: 240, mh: 320, type: "medium" },
  { w: 440, h: 340, mw: 280, mh: 280, type: "wide" },
  { w: 320, h: 500, mw: 260, mh: 360, type: "tall" },
  { w: 380, h: 300, mw: 260, mh: 280, type: "wide" },
  { w: 280, h: 440, mw: 240, mh: 340, type: "medium" },
  { w: 400, h: 520, mw: 260, mh: 360, type: "tall" },
  { w: 340, h: 360, mw: 240, mh: 320, type: "medium" },
  { w: 420, h: 320, mw: 280, mh: 280, type: "wide" },
  { w: 340, h: 500, mw: 260, mh: 360, type: "tall" },
  { w: 300, h: 400, mw: 240, mh: 320, type: "medium" },
  { w: 380, h: 340, mw: 280, mh: 280, type: "wide" },
];

export default function LatestSection() {
  const { mob } = useMedia();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [canL, setCanL] = useState(false);
  const [canR, setCanR] = useState(true);
  const pad = mob ? 20 : 56;

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanL(el.scrollLeft > 10);
    setCanR(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };
  useEffect(() => {
    const el = scrollRef.current;
    if (el) { el.addEventListener("scroll", checkScroll, { passive: true }); checkScroll(); }
    return () => el?.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (el) el.scrollBy({ left: dir * (mob ? 280 : 600), behavior: "smooth" });
  };

  return (
    <section aria-label="Latest articles" style={{ background: C.green, padding: mob ? "48px 0 56px" : "80px 0 88px", position: "relative" }}>
      <div style={{ padding: `0 ${pad}px`, marginBottom: mob ? 28 : 48 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: mob ? "flex-start" : "flex-end", flexDirection: mob ? "column" : "row", gap: mob ? 16 : 0 }}>
          <div>
            <div style={{ fontFamily: FONT.sans, fontSize: mob ? 11 : 13, fontWeight: 600, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: mob ? 10 : 16 }}>Latest</div>
            <h2 style={{ fontFamily: FONT.serif, fontSize: mob ? 28 : "clamp(36px, 4vw, 56px)", fontWeight: 400, color: C.white, lineHeight: 1.05, letterSpacing: "-0.02em", margin: 0 }}>
              Issue 39 <span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.5)" }}>— Winter 2025</span>
            </h2>
            <div style={{ fontFamily: FONT.sans, fontSize: mob ? 12 : 14, color: "rgba(255,255,255,0.35)", marginTop: mob ? 8 : 12, fontWeight: 300 }}>
              12 Stories · {mob ? "Swipe" : "Scroll"} to explore
            </div>
          </div>
          {!mob && <div style={{ display: "flex", gap: 8 }}>
            <ArrowBtn dir="left" onClick={() => scroll(-1)} light disabled={!canL} label="Scroll left" />
            <ArrowBtn dir="right" onClick={() => scroll(1)} light disabled={!canR} label="Scroll right" />
          </div>}
        </div>
      </div>

      <div ref={scrollRef} role="list" style={{
        display: "flex", gap: mob ? 14 : 24, overflowX: "auto", paddingLeft: pad, paddingRight: pad, paddingBottom: 16,
        scrollbarWidth: "none", msOverflowStyle: "none", alignItems: "flex-end",
        WebkitOverflowScrolling: "touch", scrollSnapType: mob ? "x mandatory" : "none",
      }}>
        {ARTICLES.map((a, i) => {
          const layout = CARD_LAYOUTS[i % CARD_LAYOUTS.length];
          const cw = mob ? layout.mw : layout.w;
          const ch = mob ? layout.mh : layout.h;
          return (
            <article key={a.id} role="listitem" onClick={() => navigate(`/article/${a.id}`)} style={{
              minWidth: cw, flex: `0 0 ${cw}px`, cursor: "pointer",
              alignSelf: layout.type === "wide" ? "flex-end" : layout.type === "tall" ? "flex-start" : "center",
              scrollSnapAlign: mob ? "start" : "none",
            }}>
              <div style={{ position: "relative", overflow: "hidden", height: ch, boxShadow: "0 8px 40px rgba(0,0,0,0.3)", borderRadius: mob ? 8 : 0 }}>
                <img src={`https://images.unsplash.com/${a.img}?w=${cw * 2}&h=${ch * 2}&fit=crop&q=80`} alt={`${a.t} — ${a.sub}`} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 25%, rgba(0,0,0,0.7) 100%)" }} />
                <div style={{ position: "absolute", top: mob ? 14 : 20, left: mob ? 14 : 20, fontFamily: FONT.sans, fontSize: mob ? 9 : 10, fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>{a.cat}</div>
                <div style={{ position: "absolute", bottom: mob ? 16 : 24, left: mob ? 16 : 24, right: mob ? 16 : 24 }}>
                  <h3 style={{ fontFamily: FONT.serif, fontSize: mob ? 20 : (layout.type === "tall" ? 32 : layout.type === "wide" ? 28 : 24), fontWeight: 400, color: C.white, margin: 0, lineHeight: 1.05 }}>{a.t}</h3>
                  <p style={{ fontFamily: FONT.sans, fontSize: mob ? 11 : 12, color: "rgba(255,255,255,0.55)", margin: "8px 0 0", fontWeight: 300, lineHeight: 1.5 }}>{a.sub}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {canR && !mob && <div style={{ position: "absolute", top: 160, right: 0, bottom: 0, width: 120, background: `linear-gradient(90deg, transparent, ${C.green})`, pointerEvents: "none" }} />}
    </section>
  );
}

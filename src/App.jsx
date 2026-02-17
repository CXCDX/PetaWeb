import { useState, useEffect, useRef, useCallback } from "react";

/*
  PETALS MAGAZINE V6.0 — Mobile-First Responsive Redesign

  Changes from V5.0:
  - Added useMedia hook for responsive breakpoints (mobile < 768, tablet < 1024)
  - All sections now fully responsive with proper mobile layouts
  - Touch-friendly: larger tap targets, swipe-friendly scrollers
  - Adaptive grids: 1-col mobile, 2-col tablet, 3-col desktop
  - Proper mobile typography scaling
  - Nav: compact mobile bar, safe area support
  - Hero: 100svh, mobile-optimized text positioning
  - Editor's Picks: stacked cards on mobile
  - Footer: stacked on mobile
  - Smooth scroll snap on horizontal scrollers
  - Viewport meta handled via CSS
*/

const C = {
  green: "#1B3D2F",
  greenDeep: "#0F2A1E",
  cream: "#F5F0EB",
  warmWhite: "#FAF8F5",
  charcoal: "#1A1A1A",
  darkGrey: "#333",
  grey: "#888",
  greyLight: "#C8C4BE",
  greyMed: "#A8A49E",
  white: "#FFF",
  gold: "#C4A35A",
  shadow: "rgba(27,61,47,0.10)",
  shadowMid: "rgba(27,61,47,0.14)",
  shadowDeep: "rgba(27,61,47,0.22)",
};

const FONT = {
  serif: "'Bodoni Moda','Didot','Times New Roman',Georgia,serif",
  sans: "'DM Sans','Helvetica Neue',Helvetica,sans-serif",
};

// ─── Responsive hook ───
function useMedia() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return { mob: w < 768, tab: w < 1024, w };
}

const ARTICLES = [
  { id:1, t:"Tobacco", sub:"Memory & Ritual in Perfumery", desc:"From sacred smoke to synthetic molecule, tobacco's paradox endures across centuries of fragrance making.", cat:"Ingredients", issue:39, img:"photo-1559825481-12a05cc00344" },
  { id:2, t:"The Coconut Illusion", sub:"Why Your Brain Lies About Lactones", desc:"The molecule that smells tropical has never touched a palm tree.", cat:"Science", issue:39, img:"photo-1501443762994-82bd5dace89a" },
  { id:3, t:"Istanbul to Grasse", sub:"A Fragrance Corridor", desc:"The ancient rose road, still breathing between two worlds.", cat:"Culture", issue:39, img:"photo-1524231757912-21f4fe3a7200" },
  { id:4, t:"Biodiversity in the Bottle", sub:"When the Source Disappears", desc:"What happens to perfumery when the ecosystems it depends on begin to vanish?", cat:"Sustainability", issue:39, img:"photo-1441974231531-c6227db76b6e" },
  { id:5, t:"AI Meets the Nose", sub:"Machine Learning in the Lab", desc:"Algorithms are writing formulas. The question is whether they can write poetry.", cat:"Innovation", issue:39, img:"photo-1518770660439-4636190af475" },
  { id:6, t:"Vetiver", sub:"Earth's Signature", desc:"The roots beneath everything.", cat:"Ingredients", issue:39, img:"photo-1416879595882-3373a0480b5b" },
  { id:7, t:"The New Orientalism", sub:"Rewriting the Olfactive East", desc:"A postcolonial reckoning with perfumery's most loaded category.", cat:"Culture", issue:38, img:"photo-1541643600914-78b084683601" },
  { id:8, t:"Nabil Achour", sub:"A Perfumer Between Two Continents", desc:"The nose who bridges Tunis and Paris.", cat:"Profile", issue:38, img:"photo-1547887538-e3a2f32cb1cc" },
  { id:9, t:"Synthetic vs Natural", sub:"The Eternal Debate", desc:"Where chemistry meets philosophy, and neither side yields.", cat:"Innovation", issue:38, img:"photo-1588405748880-12d1d2a59f75" },
  { id:10, t:"Myrrh", sub:"Ancient Tears", desc:"Resin, ritual, and revival.", cat:"Ingredients", issue:37, img:"photo-1595425964272-fc617fa19dfa" },
  { id:11, t:"The Proust Effect", sub:"Scent & Memory", desc:"How a single molecule can unlock an entire lifetime.", cat:"Culture", issue:37, img:"photo-1563170351-be82bc888aa4" },
  { id:12, t:"Green Chemistry 2025", sub:"Lab-Grown Ingredients", desc:"Synthetic biology is rewriting the supply chain.", cat:"Innovation", issue:37, img:"photo-1615634260167-c8cdede054de" },
];

const HERO_SLIDES = [
  { ...ARTICLES[0] },
  { ...ARTICLES[1] },
  { ...ARTICLES[3] },
  { ...ARTICLES[6] },
  { ...ARTICLES[4] },
];

const ISSUES = Array.from({length:39},(_,i)=>({
  num:39-i,
  season:["Winter","Autumn","Summer","Spring"][(39-i-1)%4],
  year:2025-Math.floor(i/4),
  img:["photo-1615634260167-c8cdede054de","photo-1541643600914-78b084683601","photo-1588405748880-12d1d2a59f75","photo-1595425964272-fc617fa19dfa","photo-1547887538-e3a2f32cb1cc","photo-1563170351-be82bc888aa4"][i%6],
}));

// ─── Utility: Scroll-triggered fade ───
function Reveal({ children, delay = 0, style = {} }) {
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.08 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      ...style,
    }}>{children}</div>
  );
}

// ─── Image with parallax-lite on hover ───
function Img({ src, h = 500, style = {} }) {
  return (
    <div style={{ overflow: "hidden", height: h, ...style }}>
      <img src={`https://images.unsplash.com/${src}?w=1200&h=${h + 200}&fit=crop&q=80`} alt=""
        style={{ width: "100%", height: "110%", objectFit: "cover", display: "block" }} />
    </div>
  );
}

// ═══════════════════════════════════════
// NAV
// ═══════════════════════════════════════
function Nav({ view, setView, scrollY, scrollToSection }) {
  const { mob } = useMedia();
  const solid = scrollY > 60;
  const [menuOpen, setMenuOpen] = useState(false);
  const pad = mob ? 20 : 48;
  const navH = mob ? 64 : 84;

  const menuItems = [
    { k: "home", l: "Latest Issue", action: () => { setView("home"); setMenuOpen(false); } },
    { k: "issues", l: "Issues", action: () => { setView("issues"); setMenuOpen(false); } },
    { k: "editorpicks", l: "Editor's Picks", action: () => { setView("home"); setMenuOpen(false); setTimeout(() => scrollToSection && scrollToSection("editorpicks"), 100); } },
    { k: "sustainability", l: "Sustainability", action: () => { setView("home"); setMenuOpen(false); setTimeout(() => scrollToSection && scrollToSection("sustainability"), 100); } },
    { k: "donotmiss", l: "Do Not Miss", action: () => { setView("home"); setMenuOpen(false); setTimeout(() => scrollToSection && scrollToSection("donotmiss"), 100); } },
    { k: "contact", l: "Contact", action: () => { setView("home"); setMenuOpen(false); setTimeout(() => scrollToSection && scrollToSection("footer"), 100); } },
  ];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: `0 ${pad}px`, height: navH,
        background: solid ? "rgba(245,240,235,0.96)" : "transparent",
        backdropFilter: solid ? "blur(28px)" : "none",
        WebkitBackdropFilter: solid ? "blur(28px)" : "none",
        borderBottom: solid ? "1.5px solid rgba(200,196,190,0.5)" : "1.5px solid transparent",
        transition: "all 0.5s ease",
      }}>
        <div onClick={() => setView("home")} style={{ cursor: "pointer", display: "flex", alignItems: "baseline", gap: mob ? 8 : 12 }}>
          <span style={{
            fontFamily: FONT.serif, fontSize: mob ? 22 : 28, fontWeight: 500,
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: solid ? C.charcoal : C.white, transition: "color 0.5s",
          }}>Petals</span>
          {!mob && <span style={{
            fontFamily: FONT.sans, fontSize: 9, fontWeight: 500,
            letterSpacing: "0.25em", textTransform: "uppercase",
            color: solid ? C.greyMed : "rgba(255,255,255,0.35)", transition: "color 0.5s",
          }}>Home</span>}
        </div>
        <div style={{ display: "flex", gap: mob ? 16 : 28, alignItems: "center" }}>
          {!mob && <a href="https://gulcicek.com" target="_blank" rel="noopener noreferrer" style={{
            fontFamily: FONT.sans, fontSize: 11, fontWeight: 400,
            color: solid ? C.greyMed : "rgba(255,255,255,0.35)",
            textDecoration: "none", letterSpacing: "0.06em", transition: "color 0.4s",
          }}>Gülçiçek ↗</a>}
          <div onClick={() => setMenuOpen(!menuOpen)} style={{
            cursor: "pointer", width: 44, height: 44,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
            position: "relative", zIndex: 1002,
            WebkitTapHighlightColor: "transparent",
          }}>
            <span style={{
              display: "block", width: 24, height: 2,
              background: menuOpen ? C.white : (solid ? C.charcoal : C.white),
              transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
              transform: menuOpen ? "rotate(45deg) translateY(4px)" : "none",
            }} />
            <span style={{
              display: "block", width: 24, height: 2,
              background: menuOpen ? C.white : (solid ? C.charcoal : C.white),
              transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
              transform: menuOpen ? "rotate(-45deg) translateY(-4px)" : "none",
            }} />
          </div>
        </div>
      </nav>

      {/* Fullscreen menu overlay */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 998,
        background: C.greenDeep,
        opacity: menuOpen ? 1 : 0,
        pointerEvents: menuOpen ? "auto" : "none",
        transition: "opacity 0.5s cubic-bezier(0.16,1,0.3,1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflowY: "auto", WebkitOverflowScrolling: "touch",
      }}>
        <div style={{ textAlign: "center", padding: mob ? "80px 24px 40px" : "0" }}>
          {menuItems.map((item, i) => (
            <div key={item.k}
              onClick={item.action}
              style={{
                fontFamily: FONT.serif, fontSize: mob ? 28 : "clamp(32px, 5vw, 56px)", fontWeight: 400,
                color: C.white, cursor: "pointer",
                padding: mob ? "14px 0" : "16px 0", lineHeight: 1.3,
                letterSpacing: "-0.01em",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(24px)",
                transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.06}s`,
                WebkitTapHighlightColor: "transparent",
              }}>
              {item.l}
            </div>
          ))}
          <div style={{
            marginTop: 36, opacity: menuOpen ? 1 : 0,
            transition: `opacity 0.6s ease ${0.5}s`,
          }}>
            <a href="https://gulcicek.com" target="_blank" rel="noopener noreferrer" style={{
              fontFamily: FONT.sans, fontSize: 13, color: "rgba(255,255,255,0.3)",
              textDecoration: "none", letterSpacing: "0.1em",
            }}>gulcicek.com ↗</a>
          </div>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════
// HERO SLIDER
// ═══════════════════════════════════════
function HeroSlider({ goDetail }) {
  const { mob, tab } = useMedia();
  const [current, setCurrent] = useState(0);
  const [entered, setEntered] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const touchRef = useRef({ startX: 0 });
  const DURATION = 6000;
  const pad = mob ? 20 : 56;

  useEffect(() => { setTimeout(() => setEntered(true), 150); }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    setProgress(0);
    let elapsed = 0;
    progressRef.current = setInterval(() => {
      elapsed += 50;
      setProgress(elapsed / DURATION);
      if (elapsed >= DURATION) {
        setCurrent(p => (p + 1) % HERO_SLIDES.length);
        elapsed = 0;
        setProgress(0);
      }
    }, 50);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      clearInterval(timerRef.current);
      clearInterval(progressRef.current);
    };
  }, [startTimer]);

  const go = (dir) => {
    setCurrent(p => (p + dir + HERO_SLIDES.length) % HERO_SLIDES.length);
    startTimer();
  };

  const slide = HERO_SLIDES[current];

  return (
    <section style={{ height: "100svh", minHeight: 500, position: "relative", overflow: "hidden", cursor: "pointer" }}
      onClick={() => goDetail(slide)}
      onTouchStart={e => { touchRef.current.startX = e.touches[0].clientX; }}
      onTouchEnd={e => {
        const diff = e.changedTouches[0].clientX - touchRef.current.startX;
        if (Math.abs(diff) > 50) { go(diff > 0 ? -1 : 1); e.preventDefault(); }
      }}>

      {HERO_SLIDES.map((s, i) => (
        <div key={s.id} style={{
          position: "absolute", inset: 0,
          opacity: i === current ? 1 : 0,
          transition: "opacity 1.6s cubic-bezier(0.4,0,0.2,1)",
          zIndex: i === current ? 1 : 0,
        }}>
          <img src={`https://images.unsplash.com/${s.img}?w=${mob ? 800 : 2000}&h=${mob ? 1200 : 1200}&fit=crop&q=${mob ? 75 : 90}`} alt=""
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              transform: i === current ? "scale(1.08)" : "scale(1)",
              transition: "transform 8s cubic-bezier(0.25,0.1,0.25,1)",
            }} />
        </div>
      ))}

      {/* Gradient overlay */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2,
        background: mob
          ? "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.75) 100%)"
          : "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.7) 100%)",
      }} />

      {/* Content */}
      <div style={{
        position: "absolute", bottom: mob ? 40 : 72, left: pad, right: pad, zIndex: 10,
        opacity: entered ? 1 : 0, transform: entered ? "translateY(0)" : "translateY(60px)",
        transition: "all 1.4s cubic-bezier(0.16,1,0.3,1) 0.4s",
      }}>
        <div style={{
          fontFamily: FONT.sans, fontSize: mob ? 10 : 12, fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.6)", marginBottom: mob ? 12 : 20,
        }}>
          Issue {slide.issue} · {slide.cat}
        </div>
        <h1 key={slide.id} style={{
          fontFamily: FONT.serif, fontWeight: 400, fontStyle: "italic",
          fontSize: mob ? "clamp(40px, 14vw, 72px)" : "clamp(72px, 12vw, 160px)",
          lineHeight: 0.88, letterSpacing: "-0.03em",
          color: C.white, margin: 0,
          textShadow: "0 4px 40px rgba(0,0,0,0.3)",
        }}>
          {slide.t}
        </h1>
        {!mob && <p style={{
          fontFamily: FONT.sans, fontSize: 16, color: "rgba(255,255,255,0.55)",
          marginTop: 22, maxWidth: 500, lineHeight: 1.65, fontWeight: 300,
        }}>
          {slide.desc}
        </p>}
      </div>

      {/* Navigation arrows — desktop only */}
      {!mob && (
        <div style={{
          position: "absolute", top: "50%", left: 0, right: 0, zIndex: 10,
          display: "flex", justifyContent: "space-between", padding: "0 24px",
          transform: "translateY(-50%)",
        }}
          onClick={e => e.stopPropagation()}>
          <button onClick={() => go(-1)} style={{
            width: 56, height: 56, borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.3)", background: "rgba(0,0,0,0.25)",
            backdropFilter: "blur(16px)", color: C.white, fontSize: 20, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>←</button>
          <button onClick={() => go(1)} style={{
            width: 56, height: 56, borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.3)", background: "rgba(0,0,0,0.25)",
            backdropFilter: "blur(16px)", color: C.white, fontSize: 20, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>→</button>
        </div>
      )}

      {/* Progress bar at bottom */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 12, display: "flex", gap: 3, padding: `0 ${pad}px`, height: 3 }}
        onClick={e => e.stopPropagation()}>
        {HERO_SLIDES.map((_, i) => (
          <div key={i} onClick={() => { setCurrent(i); startTimer(); }} style={{
            flex: 1, background: "rgba(255,255,255,0.15)", cursor: "pointer", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0,
              background: C.white,
              width: i === current ? `${progress * 100}%` : i < current ? "100%" : "0%",
              transition: i === current ? "none" : "width 0.4s ease",
            }} />
          </div>
        ))}
      </div>

      {/* Issue badge — top right, hide on mobile */}
      {!mob && <div style={{
        position: "absolute", top: 110, right: 56, zIndex: 10,
        opacity: entered ? 1 : 0, transition: "opacity 1.5s ease 0.8s",
      }}>
        <div style={{ fontFamily: FONT.serif, fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.35)", letterSpacing: "0.15em", textTransform: "uppercase", textAlign: "right" }}>
          Winter 2025<br />
          <span style={{ fontSize: 64, lineHeight: 1, color: "rgba(255,255,255,0.12)", fontWeight: 400 }}>39</span>
        </div>
      </div>}
    </section>
  );
}

// ═══════════════════════════════════════
// LATEST SECTION
// ═══════════════════════════════════════
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

function LatestSection({ goDetail }) {
  const { mob, tab } = useMedia();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const pad = mob ? 20 : 56;

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
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
    <section style={{ background: C.green, padding: mob ? "48px 0 56px" : "80px 0 88px", position: "relative" }}>
      <div style={{ padding: `0 ${pad}px`, marginBottom: mob ? 28 : 48 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: mob ? "flex-start" : "flex-end", flexDirection: mob ? "column" : "row", gap: mob ? 16 : 0 }}>
          <div>
            <div style={{
              fontFamily: FONT.sans, fontSize: mob ? 11 : 13, fontWeight: 600,
              letterSpacing: "0.4em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)", marginBottom: mob ? 10 : 16,
            }}>Latest</div>
            <div style={{
              fontFamily: FONT.serif, fontSize: mob ? 28 : "clamp(36px, 4vw, 56px)", fontWeight: 400,
              color: C.white, lineHeight: 1.05, letterSpacing: "-0.02em",
            }}>
              Issue 39 <span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.5)" }}>— Winter 2025</span>
            </div>
            <div style={{
              fontFamily: FONT.sans, fontSize: mob ? 12 : 14, color: "rgba(255,255,255,0.35)",
              marginTop: mob ? 8 : 12, fontWeight: 300,
            }}>
              12 Stories · {mob ? "Swipe" : "Scroll"} to explore
            </div>
          </div>
          {!mob && <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => scroll(-1)} style={{
              width: 48, height: 48,
              border: `2px solid ${canScrollLeft ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)"}`,
              background: "transparent",
              color: canScrollLeft ? C.white : "rgba(255,255,255,0.2)",
              fontSize: 18, cursor: canScrollLeft ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>←</button>
            <button onClick={() => scroll(1)} style={{
              width: 48, height: 48,
              border: `2px solid ${canScrollRight ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)"}`,
              background: "transparent",
              color: canScrollRight ? C.white : "rgba(255,255,255,0.2)",
              fontSize: 18, cursor: canScrollRight ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>→</button>
          </div>}
        </div>
      </div>

      <div ref={scrollRef} style={{
        display: "flex", gap: mob ? 14 : 24, overflowX: "auto", paddingLeft: pad, paddingRight: pad, paddingBottom: 16,
        scrollbarWidth: "none", msOverflowStyle: "none",
        alignItems: "flex-end",
        WebkitOverflowScrolling: "touch",
        scrollSnapType: mob ? "x mandatory" : "none",
      }}>
        {ARTICLES.map((a, i) => {
          const layout = CARD_LAYOUTS[i % CARD_LAYOUTS.length];
          const cw = mob ? layout.mw : layout.w;
          const ch = mob ? layout.mh : layout.h;
          return (
            <div key={a.id} onClick={() => goDetail(a)} style={{
              minWidth: cw, flex: `0 0 ${cw}px`, cursor: "pointer",
              alignSelf: layout.type === "wide" ? "flex-end" : layout.type === "tall" ? "flex-start" : "center",
              scrollSnapAlign: mob ? "start" : "none",
            }}>
              <div style={{
                position: "relative", overflow: "hidden", height: ch,
                boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
                borderRadius: mob ? 8 : 0,
              }}>
                <img src={`https://images.unsplash.com/${a.img}?w=${cw * 2}&h=${ch * 2}&fit=crop&q=80`} alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(180deg, transparent 25%, rgba(0,0,0,0.7) 100%)",
                }} />
                <div style={{
                  position: "absolute", top: mob ? 14 : 20, left: mob ? 14 : 20,
                  fontFamily: FONT.sans, fontSize: mob ? 9 : 10, fontWeight: 600,
                  letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)",
                }}>{a.cat}</div>
                <div style={{ position: "absolute", bottom: mob ? 16 : 24, left: mob ? 16 : 24, right: mob ? 16 : 24 }}>
                  <h3 style={{
                    fontFamily: FONT.serif,
                    fontSize: mob ? 20 : (layout.type === "tall" ? 32 : layout.type === "wide" ? 28 : 24),
                    fontWeight: 400, color: C.white, margin: 0,
                    lineHeight: 1.05, letterSpacing: "-0.02em",
                  }}>{a.t}</h3>
                  <p style={{
                    fontFamily: FONT.sans, fontSize: mob ? 11 : 12, color: "rgba(255,255,255,0.55)",
                    margin: "8px 0 0", fontWeight: 300, lineHeight: 1.5,
                  }}>{a.sub}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {canScrollRight && !mob && (
        <div style={{
          position: "absolute", top: 160, right: 0, bottom: 0, width: 120,
          background: `linear-gradient(90deg, transparent, ${C.green})`,
          pointerEvents: "none",
        }} />
      )}
    </section>
  );
}

// ═══════════════════════════════════════
// HOME
// ═══════════════════════════════════════
function Home({ goDetail }) {
  const { mob, tab } = useMedia();
  const pad = mob ? 20 : 56;

  return (
    <div style={{ background: C.cream }}>
      <HeroSlider goDetail={goDetail} />

      {/* ───── ISSUE 39 BANNER ───── */}
      <Reveal>
        <section style={{
          position: "relative", overflow: "hidden", cursor: "pointer",
          background: C.greenDeep,
        }}>
          <img src={`https://images.unsplash.com/${ARTICLES[0].img}?w=${mob ? 800 : 2000}&h=600&fit=crop&q=80`} alt=""
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
              opacity: 0.15, mixBlendMode: "luminosity",
            }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg, ${C.greenDeep} 0%, transparent 50%, ${C.greenDeep}ee 100%)` }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(15,42,30,0.7) 0%, transparent 100%)" }} />

          {!mob && <div style={{
            position: "absolute", right: -20, top: "50%", transform: "translateY(-50%)",
            fontFamily: FONT.serif, fontSize: "clamp(200px, 30vw, 400px)", fontWeight: 400, fontStyle: "italic",
            color: "rgba(255,255,255,0.04)", lineHeight: 0.85, letterSpacing: "-0.05em", userSelect: "none",
          }}>39</div>}

          <div style={{
            position: "relative", zIndex: 2,
            padding: mob ? `40px ${pad}px` : `72px ${pad}px`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexDirection: mob ? "column" : "row", gap: mob ? 24 : 0,
            alignItems: mob ? "flex-start" : "center",
          }}>
            <div>
              <div style={{
                display: "inline-block", padding: "6px 16px", marginBottom: mob ? 16 : 24,
                border: `1px solid ${C.gold}`, color: C.gold,
                fontFamily: FONT.sans, fontSize: 10, fontWeight: 600, letterSpacing: "0.35em", textTransform: "uppercase",
              }}>Now Available</div>
              <h2 style={{
                fontFamily: FONT.serif, fontSize: mob ? 32 : "clamp(42px, 5vw, 72px)", fontWeight: 400,
                color: C.white, margin: 0, lineHeight: 1, letterSpacing: "-0.02em",
              }}>
                Petals <span style={{ fontStyle: "italic", color: C.gold }}>Issue 39</span>
              </h2>
              <p style={{
                fontFamily: FONT.sans, fontSize: mob ? 13 : 15, color: "rgba(255,255,255,0.4)", marginTop: mob ? 12 : 16,
                fontWeight: 300, letterSpacing: "0.04em", maxWidth: 400,
              }}>
                Winter 2025 · 84 Pages · 12 Stories exploring the boundaries of scent, science, and culture.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              {!mob && <div style={{ width: 56, height: 1, background: "rgba(255,255,255,0.2)" }} />}
              <div style={{
                fontFamily: FONT.sans, fontSize: mob ? 11 : 12, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase",
                color: C.white, padding: mob ? "12px 28px" : "16px 40px",
                border: "2px solid rgba(255,255,255,0.25)",
                whiteSpace: "nowrap", WebkitTapHighlightColor: "transparent",
              }}>Read This Issue →</div>
            </div>
          </div>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${C.gold}, transparent 60%)` }} />
        </section>
      </Reveal>

      {/* ───── LATEST ───── */}
      <LatestSection goDetail={goDetail} />

      {/* ───── EDITOR'S PICKS ───── */}
      <section id="section-editorpicks" style={{ padding: mob ? `56px ${pad}px 72px` : `100px ${pad}px 120px` }}>
        <Reveal>
          <div style={{ marginBottom: mob ? 32 : 56 }}>
            <div style={{
              fontFamily: FONT.sans, fontSize: mob ? 12 : 14, fontWeight: 600,
              letterSpacing: "0.35em", textTransform: "uppercase", color: C.green,
              marginBottom: 16, paddingBottom: 16,
              borderBottom: `3px solid ${C.green}`, display: "inline-block",
            }}>Editor's Picks</div>
            <div style={{ fontFamily: FONT.sans, fontSize: mob ? 12 : 14, color: C.grey, fontWeight: 300, marginTop: 8 }}>
              Curated by the editors · Issue 39
            </div>
          </div>
        </Reveal>

        {/* Responsive grid */}
        {mob ? (
          // Mobile: stacked full-width cards
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {ARTICLES.slice(0, 6).map((a, i) => (
              <Reveal key={a.id} delay={i * 0.06}>
                <div onClick={() => goDetail(a)} style={{
                  position: "relative", overflow: "hidden",
                  height: i === 0 ? 320 : 220, cursor: "pointer",
                  borderRadius: 8,
                  boxShadow: `0 6px 24px ${C.shadowMid}`,
                }}>
                  <img src={`https://images.unsplash.com/${a.img}?w=800&h=${i === 0 ? 640 : 440}&fit=crop&q=80`} alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.7) 100%)" }} />
                  <div style={{ position: "absolute", top: 14, left: 16 }}>
                    <span style={{ fontFamily: FONT.sans, fontSize: 9, fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>{a.cat}</span>
                  </div>
                  <div style={{ position: "absolute", bottom: 18, left: 18, right: 18 }}>
                    <span style={{ fontFamily: FONT.serif, fontSize: 12, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>{String(i + 1).padStart(2, "0")}</span>
                    <h4 style={{ fontFamily: FONT.serif, fontSize: i === 0 ? 26 : 20, fontWeight: 400, color: C.white, margin: "4px 0 2px", lineHeight: 1.1 }}>{a.t}</h4>
                    <p style={{ fontFamily: FONT.sans, fontSize: 11, color: "rgba(255,255,255,0.5)", margin: 0, fontWeight: 300 }}>{a.sub}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          // Desktop: mosaic grid
          <div style={{ display: "grid", gridTemplateColumns: tab ? "1fr 1fr" : "1.4fr 1fr 1fr", gridTemplateRows: tab ? "auto" : "380px 380px", gap: 20 }}>
            {ARTICLES.slice(0, 6).map((a, i) => {
              const gridPos = tab ? {} : [
                { gridColumn: "1 / 2", gridRow: "1 / 3" },
                { gridColumn: "2 / 3", gridRow: "1 / 2" },
                { gridColumn: "3 / 4", gridRow: "1 / 2" },
                { gridColumn: "2 / 3", gridRow: "2 / 3" },
                { gridColumn: "3 / 4", gridRow: "2 / 3" },
                null,
              ][i];
              const isTall = i === 0 && !tab;

              if (i === 5 && !tab) return (
                <Reveal key={a.id} delay={i * 0.08} style={{ gridColumn: "1 / 4", marginTop: 12 }}>
                  <div onClick={() => goDetail(a)} style={{
                    position: "relative", overflow: "hidden", height: 220, cursor: "pointer",
                    boxShadow: `0 8px 32px ${C.shadowMid}`,
                  }}>
                    <img src={`https://images.unsplash.com/${a.img}?w=1600&h=500&fit=crop&q=85`} alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)" }} />
                    <div style={{ position: "absolute", bottom: 28, left: 36, right: 36 }}>
                      <span style={{ fontFamily: FONT.sans, fontSize: 9, fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>{a.cat}</span>
                      <h4 style={{ fontFamily: FONT.serif, fontSize: 30, fontWeight: 400, color: C.white, margin: "8px 0 6px", lineHeight: 1.05 }}>{a.t}</h4>
                      <p style={{ fontFamily: FONT.sans, fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0, fontWeight: 300 }}>{a.sub}</p>
                    </div>
                  </div>
                </Reveal>
              );
              if (!gridPos && !tab) return null;

              return (
                <Reveal key={a.id} delay={i * 0.08} style={gridPos}>
                  <div onClick={() => goDetail(a)} style={{
                    position: "relative", overflow: "hidden", height: tab ? 280 : "100%", cursor: "pointer",
                    boxShadow: `0 8px 32px ${C.shadowMid}`,
                  }}>
                    <img src={`https://images.unsplash.com/${a.img}?w=${isTall ? 1000 : 800}&h=${isTall ? 1400 : 800}&fit=crop&q=85`} alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", inset: 0, background: isTall
                      ? "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.75) 100%)"
                      : "linear-gradient(180deg, transparent 20%, rgba(0,0,0,0.7) 100%)" }} />
                    <div style={{ position: "absolute", top: 20, left: 22 }}>
                      <span style={{ fontFamily: FONT.sans, fontSize: 9, fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>{a.cat}</span>
                    </div>
                    <div style={{ position: "absolute", bottom: isTall ? 36 : 22, left: isTall ? 32 : 22, right: isTall ? 32 : 22 }}>
                      <span style={{ fontFamily: FONT.serif, fontSize: isTall ? 18 : 14, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>{String(i + 1).padStart(2, "0")}</span>
                      <h4 style={{
                        fontFamily: FONT.serif, fontSize: isTall ? 36 : 22, fontWeight: 400, color: C.white,
                        margin: "8px 0 6px", lineHeight: 1.08,
                      }}>{a.t}</h4>
                      <p style={{ fontFamily: FONT.sans, fontSize: isTall ? 14 : 12, color: "rgba(255,255,255,0.5)", margin: 0, fontWeight: 300, lineHeight: 1.4 }}>{a.sub}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>

      {/* ───── SUSTAINABILITY ───── */}
      <Reveal>
        <section id="section-sustainability" onClick={() => goDetail(ARTICLES[3])} style={{
          position: "relative", height: mob ? "50vh" : "64vh", minHeight: mob ? 320 : 400, overflow: "hidden", cursor: "pointer",
        }}>
          <img src={`https://images.unsplash.com/${ARTICLES[3].img}?w=${mob ? 800 : 2000}&h=1000&fit=crop&q=80`} alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: mob
            ? "linear-gradient(180deg, rgba(15,42,30,0.4) 0%, rgba(15,42,30,0.92) 100%)"
            : "linear-gradient(90deg, rgba(15,42,30,0.92) 0%, rgba(15,42,30,0.4) 55%, transparent 100%)"
          }} />
          <div style={{
            position: "absolute",
            ...(mob ? { bottom: pad, left: pad, right: pad } : { top: "50%", left: pad, transform: "translateY(-50%)" }),
            zIndex: 2, maxWidth: mob ? "none" : 560,
          }}>
            <div style={{ fontFamily: FONT.sans, fontSize: mob ? 10 : 12, fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: mob ? 12 : 24 }}>Sustainability · Issue 39</div>
            <h2 style={{
              fontFamily: FONT.serif, fontSize: mob ? 32 : "clamp(48px, 5.5vw, 72px)", fontWeight: 400,
              color: C.white, margin: "0 0 12px", lineHeight: 0.95, letterSpacing: "-0.02em",
            }}>
              Biodiversity<br />in the Bottle
            </h2>
            {!mob && <p style={{ fontFamily: FONT.sans, fontSize: 15, color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.7, fontWeight: 300, maxWidth: 420 }}>
              {ARTICLES[3].desc}
            </p>}
            <div style={{ marginTop: mob ? 16 : 36, width: 56, height: 3, background: "rgba(255,255,255,0.4)" }} />
          </div>
        </section>
      </Reveal>

      <div style={{ height: mob ? 40 : 80, background: C.cream }} />

      {/* ───── DO NOT MISS ───── */}
      <section id="section-donotmiss" style={{ padding: mob ? `24px ${pad}px 72px` : `40px ${pad}px 120px` }}>
        <Reveal>
          <div style={{
            fontFamily: FONT.sans, fontSize: mob ? 12 : 14, fontWeight: 600,
            letterSpacing: "0.35em", textTransform: "uppercase", color: C.green,
            marginBottom: mob ? 28 : 48, paddingBottom: 16,
            borderBottom: `3px solid ${C.green}`, display: "inline-block",
          }}>Do Not Miss</div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "1fr 1fr 1fr", gap: mob ? 20 : 36 }}>
          {ARTICLES.slice(5, 8).map((a, i) => (
            <Reveal key={a.id} delay={i * 0.12}>
              <div onClick={() => goDetail(a)} style={{
                cursor: "pointer",
                marginTop: !mob && i === 1 ? 72 : 0,
                background: C.cream,
                borderRadius: mob ? 8 : 0,
                overflow: "hidden",
                boxShadow: `0 8px 32px ${C.shadowMid}, 0 2px 8px ${C.shadow}`,
              }}>
                <Img src={a.img} h={mob ? 240 : (i === 1 ? 480 : 400)} />
                <div style={{ padding: mob ? "20px 20px 24px" : "28px 28px 32px" }}>
                  <div style={{ fontFamily: FONT.sans, fontSize: 11, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: C.green, marginBottom: 12 }}>{a.cat}</div>
                  <h3 style={{ fontFamily: FONT.serif, fontSize: mob ? 22 : 28, fontWeight: 400, color: C.charcoal, margin: "0 0 10px", lineHeight: 1.1 }}>{a.t}</h3>
                  <p style={{ fontFamily: FONT.sans, fontSize: 13, color: C.grey, margin: 0, lineHeight: 1.55, fontWeight: 300 }}>{a.sub}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───── QUOTE ───── */}
      <Reveal>
        <section style={{ padding: mob ? `48px ${pad}px` : "88px 56px", borderTop: `3px solid ${C.greyLight}`, borderBottom: `3px solid ${C.greyLight}` }}>
          <h2 style={{
            fontFamily: FONT.serif, fontSize: mob ? 28 : "clamp(48px, 5.5vw, 80px)", fontWeight: 400, fontStyle: "italic",
            color: C.green, margin: 0, lineHeight: 1.1, letterSpacing: "-0.02em", maxWidth: "90%",
          }}>
            "Perfume is the most intense form of memory."
          </h2>
          <div style={{ fontFamily: FONT.sans, fontSize: 13, fontWeight: 500, color: C.grey, marginTop: mob ? 16 : 28, letterSpacing: "0.12em" }}>Jean-Paul Guerlain</div>
        </section>
      </Reveal>

      <IssuesSlider />
      <Footer />
    </div>
  );
}

// ═══════════════════════════════════════
// ISSUES SLIDER
// ═══════════════════════════════════════
function IssuesSlider() {
  const { mob, tab } = useMedia();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const pad = mob ? 20 : 56;

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) { el.addEventListener("scroll", checkScroll, { passive: true }); checkScroll(); }
    return () => el?.removeEventListener("scroll", checkScroll);
  }, []);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (el) el.scrollBy({ left: dir * (mob ? 320 : 700), behavior: "smooth" });
  };

  const cardW = mob ? 160 : 240;

  return (
    <section style={{ padding: mob ? `56px 0 56px ${pad}px` : `100px 0 100px ${pad}px`, borderTop: `3px solid ${C.greyLight}`, position: "relative" }}>
      <Reveal>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: mob ? "flex-start" : "flex-end", marginBottom: mob ? 28 : 56, paddingRight: pad, flexDirection: mob ? "column" : "row", gap: mob ? 12 : 0 }}>
          <div>
            <div style={{
              fontFamily: FONT.sans, fontSize: mob ? 12 : 14, fontWeight: 600,
              letterSpacing: "0.35em", textTransform: "uppercase", color: C.green,
              marginBottom: mob ? 10 : 16, paddingBottom: 12,
              borderBottom: `3px solid ${C.green}`, display: "inline-block",
            }}>Issues</div>
            <div style={{
              fontFamily: FONT.serif, fontSize: mob ? 32 : "clamp(48px, 5vw, 76px)", fontWeight: 400,
              color: C.charcoal, lineHeight: 1, letterSpacing: "-0.02em",
            }}>The Archive</div>
            <div style={{ fontFamily: FONT.sans, fontSize: mob ? 12 : 14, color: C.grey, marginTop: mob ? 8 : 14, fontWeight: 400 }}>
              39 issues · 2010 – 2025 · {mob ? "Swipe" : "Swipe to explore"}
            </div>
          </div>
          {!mob && <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => scroll(-1)} style={{
              width: 52, height: 52,
              border: `2px solid ${canScrollLeft ? C.charcoal : C.greyLight}`,
              background: canScrollLeft ? C.charcoal : "transparent",
              color: canScrollLeft ? C.white : C.greyLight,
              fontSize: 18, cursor: canScrollLeft ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>←</button>
            <button onClick={() => scroll(1)} style={{
              width: 52, height: 52,
              border: `2px solid ${canScrollRight ? C.charcoal : C.greyLight}`,
              background: canScrollRight ? C.charcoal : "transparent",
              color: canScrollRight ? C.white : C.greyLight,
              fontSize: 18, cursor: canScrollRight ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>→</button>
          </div>}
        </div>
      </Reveal>

      <div ref={scrollRef} style={{
        display: "flex", gap: mob ? 12 : 24, overflowX: "auto", paddingBottom: 28, paddingRight: pad,
        scrollbarWidth: "none", msOverflowStyle: "none",
        WebkitOverflowScrolling: "touch",
        scrollSnapType: mob ? "x mandatory" : "none",
      }}>
        {ISSUES.map((iss) => (
          <div key={iss.num} style={{
            minWidth: cardW, flex: `0 0 ${cardW}px`, cursor: "pointer",
            scrollSnapAlign: mob ? "start" : "none",
          }}>
            <div style={{
              position: "relative", overflow: "hidden",
              borderRadius: mob ? 6 : 0,
              boxShadow: `0 8px 32px ${C.shadowMid}, 0 2px 8px ${C.shadow}`,
            }}>
              <img src={`https://images.unsplash.com/${iss.img}?w=${cardW * 2}&h=${Math.round(cardW * 1.4 * 2)}&fit=crop`} alt=""
                style={{ width: "100%", aspectRatio: "5/7", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.4) 100%)" }} />
              <div style={{
                position: "absolute", bottom: mob ? 12 : 18, left: mob ? 12 : 18,
                fontFamily: FONT.serif, fontSize: mob ? 48 : 72, color: "rgba(255,255,255,0.15)", lineHeight: 1, fontWeight: 400,
              }}>{iss.num}</div>
            </div>
            <div style={{ marginTop: mob ? 10 : 16 }}>
              <div style={{ fontFamily: FONT.sans, fontSize: mob ? 12 : 13, color: C.charcoal, fontWeight: 500 }}>No. {iss.num}</div>
              <div style={{ fontFamily: FONT.sans, fontSize: 11, color: C.grey, marginTop: 4, fontWeight: 400 }}>{iss.season} {iss.year}</div>
            </div>
          </div>
        ))}
      </div>

      {canScrollRight && !mob && (
        <div style={{
          position: "absolute", top: 180, right: 0, bottom: 0, width: 100,
          background: `linear-gradient(90deg, transparent, ${C.cream})`,
          pointerEvents: "none",
        }} />
      )}
    </section>
  );
}

// ═══════════════════════════════════════
// ISSUES ARCHIVE PAGE
// ═══════════════════════════════════════
const ISSUE_THEMES = [
  { bg: "#1B3D2F", accent: "#C4A35A", label: "Winter 2025" },
  { bg: "#2C1810", accent: "#D4896A", label: "Autumn 2024" },
  { bg: "#1A1A2E", accent: "#7B8CDE", label: "Summer 2024" },
  { bg: "#3D2B1B", accent: "#E8C87A", label: "Spring 2024" },
  { bg: "#0D2137", accent: "#6BBCD4", label: "Winter 2024" },
  { bg: "#2D1F3D", accent: "#B88AD4", label: "Autumn 2023" },
];

function IssueDetailView({ issue, onBack }) {
  const { mob, tab } = useMedia();
  const [entered, setEntered] = useState(false);
  useEffect(() => { setTimeout(() => setEntered(true), 100); }, []);
  const theme = ISSUE_THEMES[(39 - issue.num) % ISSUE_THEMES.length];
  const issueArticles = ARTICLES.filter(a => a.issue === issue.num).length > 0
    ? ARTICLES.filter(a => a.issue === issue.num)
    : ARTICLES.slice(0, 6);
  const pad = mob ? 20 : 56;

  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <section style={{
        height: mob ? "60vh" : "70vh", minHeight: mob ? 360 : 400, position: "relative", overflow: "hidden",
        background: theme.bg,
      }}>
        <img src={`https://images.unsplash.com/${issue.img}?w=${mob ? 800 : 2000}&h=1200&fit=crop&q=85`} alt=""
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            opacity: entered ? 0.4 : 0, transition: "opacity 1.5s ease",
            mixBlendMode: "luminosity",
          }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${theme.bg}dd 0%, transparent 40%, ${theme.bg}ee 100%)` }} />
        <div style={{
          position: "absolute", ...(mob ? { bottom: pad, left: pad, right: pad } : { top: "50%", left: pad, transform: "translateY(-50%)" }),
          zIndex: 2, opacity: entered ? 1 : 0, transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.3s",
        }}>
          <div style={{ fontFamily: FONT.sans, fontSize: mob ? 10 : 12, fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: theme.accent, marginBottom: mob ? 12 : 20 }}>
            {issue.season} {issue.year}
          </div>
          <h1 style={{
            fontFamily: FONT.serif, fontSize: mob ? 36 : "clamp(48px, 7vw, 88px)", fontWeight: 400,
            color: C.white, margin: 0, lineHeight: 0.95, letterSpacing: "-0.03em", position: "relative",
          }}>
            Petals<br /><span style={{ fontStyle: "italic", color: theme.accent }}>No. {issue.num}</span>
          </h1>
          <p style={{ fontFamily: FONT.sans, fontSize: mob ? 12 : 15, color: "rgba(255,255,255,0.4)", marginTop: mob ? 12 : 20, fontWeight: 300 }}>
            84 Pages · 12 Stories · {issue.season} Edition
          </p>
        </div>
        <div onClick={onBack} style={{
          position: "absolute", top: mob ? 74 : 110, left: pad, zIndex: 10,
          fontFamily: FONT.sans, fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.5)",
          cursor: "pointer", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 8,
          padding: "10px 20px", border: "1.5px solid rgba(255,255,255,0.2)",
          WebkitTapHighlightColor: "transparent",
        }}>← All Issues</div>
        <div style={{ position: "absolute", bottom: 0, left: pad, right: pad, height: 3, background: theme.accent, opacity: 0.6 }} />
      </section>

      <section style={{ padding: mob ? `48px ${pad}px 72px` : `80px ${pad}px 120px` }}>
        <Reveal>
          <div style={{ fontFamily: FONT.sans, fontSize: mob ? 12 : 14, fontWeight: 600, letterSpacing: "0.35em", textTransform: "uppercase", color: C.green, marginBottom: mob ? 28 : 48 }}>
            In This Issue
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "1fr 1fr 1fr", gap: mob ? 20 : 32 }}>
          {issueArticles.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.1}>
              <div style={{ cursor: "pointer", marginTop: !mob && i % 3 === 1 ? 48 : 0 }}>
                <div style={{
                  position: "relative", overflow: "hidden", height: mob ? 220 : 320,
                  borderRadius: mob ? 8 : 0,
                  boxShadow: `0 8px 32px ${C.shadowMid}`,
                }}>
                  <img src={`https://images.unsplash.com/${a.img}?w=800&h=700&fit=crop&q=80`} alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.6) 100%)" }} />
                  <div style={{ position: "absolute", bottom: mob ? 16 : 22, left: mob ? 16 : 22, right: mob ? 16 : 22 }}>
                    <span style={{ fontFamily: FONT.sans, fontSize: 9, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: theme.accent }}>{a.cat}</span>
                    <h4 style={{ fontFamily: FONT.serif, fontSize: mob ? 20 : 24, fontWeight: 400, color: C.white, margin: "6px 0 0", lineHeight: 1.1 }}>{a.t}</h4>
                  </div>
                </div>
                <div style={{ padding: "12px 0" }}>
                  <p style={{ fontFamily: FONT.sans, fontSize: 13, color: C.grey, margin: 0, fontWeight: 300, lineHeight: 1.5 }}>{a.sub}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}

function IssuesPage({ onSelectIssue }) {
  const { mob, tab } = useMedia();
  const featured = ISSUES[0];
  const recent = ISSUES.slice(1, 5);
  const older = ISSUES.slice(5);
  const pad = mob ? 20 : 56;

  return (
    <div style={{ background: C.cream, minHeight: "100vh", paddingTop: mob ? 80 : 120 }}>
      <div style={{ padding: `0 ${pad}px 24px` }}>
        <Reveal>
          <div style={{
            fontFamily: FONT.sans, fontSize: mob ? 12 : 14, fontWeight: 600,
            letterSpacing: "0.35em", textTransform: "uppercase", color: C.green,
            marginBottom: 16, paddingBottom: 16,
            borderBottom: `3px solid ${C.green}`, display: "inline-block",
          }}>Issues</div>
          <h1 style={{ fontFamily: FONT.serif, fontSize: mob ? 40 : "clamp(56px, 8vw, 100px)", fontWeight: 400, color: C.charcoal, margin: "0 0 8px", lineHeight: 0.95, letterSpacing: "-0.03em" }}>
            The Archive
          </h1>
          <p style={{ fontFamily: FONT.sans, fontSize: mob ? 13 : 15, color: C.grey, margin: 0, fontWeight: 300 }}>39 issues · 2010 – 2025 · Every story preserved.</p>
        </Reveal>
      </div>

      {/* Featured */}
      <Reveal>
        <div onClick={() => onSelectIssue(featured)} style={{
          margin: `${mob ? 24 : 48}px ${pad}px 0`, position: "relative", height: mob ? "35vh" : "50vh", minHeight: mob ? 220 : 300, overflow: "hidden", cursor: "pointer",
          borderRadius: mob ? 8 : 0,
          boxShadow: `0 16px 64px ${C.shadowDeep}`,
        }}>
          <img src={`https://images.unsplash.com/${featured.img}?w=${mob ? 800 : 2000}&h=1000&fit=crop&q=85`} alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: mob
            ? "linear-gradient(180deg, transparent 30%, rgba(15,42,30,0.88) 100%)"
            : "linear-gradient(90deg, rgba(15,42,30,0.88) 0%, rgba(15,42,30,0.3) 60%, transparent 100%)" }} />
          <div style={{ position: "absolute", ...(mob ? { bottom: 20, left: 20 } : { top: "50%", left: 48, transform: "translateY(-50%)" }), zIndex: 2 }}>
            <div style={{ fontFamily: FONT.sans, fontSize: 11, fontWeight: 600, letterSpacing: "0.35em", textTransform: "uppercase", color: C.gold, marginBottom: mob ? 8 : 16 }}>Latest Issue</div>
            <h2 style={{ fontFamily: FONT.serif, fontSize: mob ? 36 : "clamp(48px, 6vw, 80px)", fontWeight: 400, color: C.white, margin: 0, lineHeight: 0.95 }}>
              No. {featured.num}
            </h2>
            <p style={{ fontFamily: FONT.sans, fontSize: mob ? 12 : 14, color: "rgba(255,255,255,0.45)", marginTop: mob ? 6 : 14, fontWeight: 300 }}>
              {featured.season} {featured.year} · 84 Pages
            </p>
          </div>
        </div>
      </Reveal>

      {/* Recent */}
      <div style={{ padding: `${mob ? 24 : 48}px ${pad}px 0`, display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: mob ? 14 : 24 }}>
        {recent.map((iss, i) => (
          <Reveal key={iss.num} delay={i * 0.1}>
            <div onClick={() => onSelectIssue(iss)} style={{
              cursor: "pointer", marginTop: !mob && i % 2 === 1 ? 40 : 0,
            }}>
              <div style={{
                position: "relative", overflow: "hidden",
                borderRadius: mob ? 6 : 0,
                boxShadow: `0 8px 32px ${C.shadowMid}`,
              }}>
                <img src={`https://images.unsplash.com/${iss.img}?w=600&h=840&fit=crop`} alt=""
                  style={{ width: "100%", aspectRatio: "5/7", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.5) 100%)" }} />
                <div style={{ position: "absolute", bottom: mob ? 14 : 20, left: mob ? 14 : 20, right: mob ? 14 : 20 }}>
                  <div style={{ fontFamily: FONT.serif, fontSize: mob ? 28 : 36, color: C.white, fontWeight: 400, lineHeight: 1 }}>{iss.num}</div>
                  <div style={{ fontFamily: FONT.sans, fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 6, fontWeight: 400 }}>{iss.season} {iss.year}</div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Divider */}
      <div style={{ padding: `${mob ? 36 : 64}px ${pad}px 0` }}>
        <Reveal>
          <div style={{ borderTop: `2px solid ${C.greyLight}`, paddingTop: mob ? 24 : 40 }}>
            <span style={{ fontFamily: FONT.sans, fontSize: 13, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: C.greyMed }}>
              All Issues · {older.length} more
            </span>
          </div>
        </Reveal>
      </div>

      {/* Older — single column on mobile */}
      <div style={{ padding: `24px ${pad}px ${mob ? 72 : 120}px` }}>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: mob ? 4 : 20 }}>
          {older.map((iss, i) => (
            <Reveal key={iss.num} delay={Math.min(i * 0.03, 0.4)}>
              <div onClick={() => onSelectIssue(iss)} style={{
                cursor: "pointer", display: "flex", gap: mob ? 14 : 20, alignItems: "center",
                padding: mob ? "12px 0" : 16,
                borderBottom: `1px solid ${C.greyLight}`,
                WebkitTapHighlightColor: "transparent",
              }}>
                <div style={{
                  width: mob ? 56 : 72, height: mob ? 78 : 100, overflow: "hidden", flexShrink: 0,
                  borderRadius: mob ? 4 : 0,
                  boxShadow: `0 4px 16px ${C.shadow}`,
                }}>
                  <img src={`https://images.unsplash.com/${iss.img}?w=144&h=200&fit=crop`} alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FONT.serif, fontSize: mob ? 18 : 22, color: C.charcoal, fontWeight: 400 }}>No. {iss.num}</div>
                  <div style={{ fontFamily: FONT.sans, fontSize: 12, color: C.grey, marginTop: 4, fontWeight: 400 }}>{iss.season} {iss.year}</div>
                </div>
                <span style={{ fontFamily: FONT.sans, fontSize: 18, color: C.greyMed, fontWeight: 300 }}>→</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

// ═══════════════════════════════════════
// ARTICLE DETAIL
// ═══════════════════════════════════════
function Detail({ article, onBack }) {
  const { mob } = useMedia();
  const [entered, setEntered] = useState(false);
  useEffect(() => { setTimeout(() => setEntered(true), 100); }, []);
  if (!article) return null;
  const pad = mob ? 20 : 56;

  return (
    <div style={{ background: C.cream }}>
      <section style={{ height: mob ? "70vh" : "90vh", minHeight: mob ? 400 : 500, position: "relative", overflow: "hidden" }}>
        <img src={`https://images.unsplash.com/${article.img}?w=${mob ? 800 : 2000}&h=1200&fit=crop&q=85`} alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: entered ? 1 : 0.2, transition: "opacity 1.8s ease" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.65) 100%)" }} />
        <div style={{
          position: "absolute", bottom: mob ? 32 : 60, left: pad, right: pad, zIndex: 2,
          opacity: entered ? 1 : 0, transform: entered ? "translateY(0)" : "translateY(40px)",
          transition: "all 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s",
        }}>
          <div style={{ fontFamily: FONT.sans, fontSize: mob ? 10 : 12, fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: mob ? 12 : 20 }}>
            {article.cat} · Issue {article.issue}
          </div>
          <h1 style={{
            fontFamily: FONT.serif, fontSize: mob ? "clamp(36px, 10vw, 56px)" : "clamp(48px, 8vw, 100px)", fontWeight: 400, fontStyle: "italic",
            color: C.white, margin: 0, lineHeight: 0.92, letterSpacing: "-0.03em",
          }}>{article.t}</h1>
          {article.sub && (
            <p style={{ fontFamily: FONT.sans, fontSize: mob ? 14 : 17, color: "rgba(255,255,255,0.5)", marginTop: mob ? 10 : 18, fontWeight: 300 }}>{article.sub}</p>
          )}
        </div>
        <div onClick={onBack} style={{
          position: "absolute", top: mob ? 74 : 100, left: pad, zIndex: 10,
          fontFamily: FONT.sans, fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.5)",
          cursor: "pointer", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 8,
          padding: "10px 20px", border: "1.5px solid rgba(255,255,255,0.2)",
          WebkitTapHighlightColor: "transparent",
        }}>← Back</div>
      </section>

      <section style={{ padding: mob ? `40px ${pad}px` : "80px 56px", maxWidth: 700, margin: "0 auto" }}>
        <p style={{ fontFamily: FONT.serif, fontSize: mob ? 19 : 23, lineHeight: 1.6, color: C.darkGrey, margin: "0 0 36px", fontStyle: "italic" }}>
          {article.desc}
        </p>
        <div style={{ width: 56, height: 3, background: C.green, marginBottom: mob ? 32 : 48 }} />
        {[
          "The scent of tobacco is one of perfumery's great paradoxes: at once warm and cool, sweet and bitter, comforting and unsettling. It carries the weight of ritual; the pipe after dinner, the ceremonial offering, the quiet moment of reflection.",
          "In the gardens of 17th century Istanbul, tobacco was celebrated through elaborate rituals. The Ottoman tobacco ceremony created an olfactive landscape that perfumers would later seek to capture. The smoky sweetness, the honeyed warmth, the leathery depth: memories encoded in the molecule.",
          "Modern tobacco accords rely on a carefully orchestrated symphony of molecules. At the heart lies coumarin, responsible for that distinctive hay-like sweetness. Around it, perfumers layer vanillin for warmth, iso-quinoline for the smoky bite, and various musks for the lingering trail.",
        ].map((txt, i) => (
          <p key={i} style={{ fontFamily: FONT.sans, fontSize: mob ? 15 : 16, lineHeight: 1.9, color: "rgba(44,44,44,0.8)", margin: "0 0 24px", fontWeight: 300 }}>{txt}</p>
        ))}
        <div style={{ margin: mob ? "36px 0" : "56px -80px", overflow: "hidden", borderRadius: mob ? 8 : 0, boxShadow: `0 12px 56px ${C.shadowDeep}` }}>
          <img src="https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=1400&h=500&fit=crop" alt="" style={{ width: "100%", height: mob ? 200 : 380, objectFit: "cover", display: "block" }} />
        </div>
        <h2 style={{ fontFamily: FONT.serif, fontSize: mob ? 28 : 38, fontWeight: 400, color: C.charcoal, margin: "0 0 24px", lineHeight: 1.1 }}>The Molecular Architecture</h2>
        {[
          "What makes tobacco compelling in perfumery is its ability to evoke specific memories. A tobacco note can transport the wearer to a grandfather's study, a Havana street, or an autumn evening by the fire.",
          "The challenge for modern perfumers lies in recreation without reproduction. Natural tobacco absolute carries regulatory restrictions. The art is in constructing an accord that feels authentic while being entirely synthetic.",
        ].map((txt, i) => (
          <p key={i} style={{ fontFamily: FONT.sans, fontSize: mob ? 15 : 16, lineHeight: 1.9, color: "rgba(44,44,44,0.8)", margin: "0 0 24px", fontWeight: 300 }}>{txt}</p>
        ))}
        <div style={{ marginTop: mob ? 48 : 80, paddingTop: mob ? 28 : 40, borderTop: `3px solid ${C.greyLight}` }}>
          <div style={{ fontFamily: FONT.sans, fontSize: 11, fontWeight: 500, color: C.grey, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 12 }}>Next</div>
          <span onClick={() => {}} style={{ fontFamily: FONT.serif, fontSize: mob ? 24 : 32, color: C.charcoal, cursor: "pointer", lineHeight: 1.1 }}>
            The Coconut Illusion →
          </span>
        </div>
      </section>
      <Footer />
    </div>
  );
}

// ═══════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════
function Footer() {
  const { mob } = useMedia();
  const pad = mob ? 20 : 56;
  return (
    <footer id="section-footer" style={{
      padding: mob ? `40px ${pad}px` : `64px ${pad}px`, background: C.charcoal,
      display: "flex", justifyContent: "space-between", alignItems: mob ? "flex-start" : "flex-end",
      flexDirection: mob ? "column" : "row", gap: mob ? 20 : 0,
    }}>
      <div>
        <span style={{ fontFamily: FONT.serif, fontSize: mob ? 20 : 24, fontWeight: 500, color: C.white, letterSpacing: "0.12em", textTransform: "uppercase" }}>Petals</span>
        <div style={{ fontFamily: FONT.sans, fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 12, fontWeight: 400 }}>A publication by MG International Fragrance Company</div>
      </div>
      <div style={{ fontFamily: FONT.sans, fontSize: 12, color: "rgba(255,255,255,0.3)", display: "flex", gap: 18, alignItems: "center", fontWeight: 400 }}>
        <a href="https://gulcicek.com" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>gulcicek.com</a>
        <span>·</span><span>Since 1961</span>
      </div>
    </footer>
  );
}

// ═══════════════════════════════════════
// APP
// ═══════════════════════════════════════
export default function App() {
  const [view, setView] = useState("home");
  const [detail, setDetail] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const ref = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const h = () => setScrollY(el.scrollTop);
    el.addEventListener("scroll", h, { passive: true });
    return () => el.removeEventListener("scroll", h);
  }, []);

  useEffect(() => { if (ref.current) ref.current.scrollTop = 0; }, [view, detail, selectedIssue]);

  const goDetail = (a) => { setDetail(a); setView("detail"); };

  const scrollToSection = (sectionId) => {
    const el = ref.current;
    if (!el) return;
    const target = el.querySelector(`#section-${sectionId}`);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={ref} style={{
      width: "100%", height: "100vh", overflow: "auto", background: C.cream,
      cursor: "default", WebkitOverflowScrolling: "touch",
    }}>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
        html { -webkit-text-size-adjust:100%; }
        ::selection { background:${C.green}; color:${C.white}; }
        ::-webkit-scrollbar { width:6px; height:0; }
        ::-webkit-scrollbar-track { background:${C.cream}; }
        ::-webkit-scrollbar-thumb { background:${C.greyLight}; border-radius:3px; }
        ::-webkit-scrollbar-thumb:hover { background:${C.greyMed}; }
        img { -webkit-user-drag:none; user-select:none; }
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        @media (max-width:768px) {
          ::-webkit-scrollbar { display:none; }
          * { scrollbar-width:none; }
        }
      `}</style>
      <Nav view={view} setView={(v) => { setView(v); setDetail(null); setSelectedIssue(null); }} scrollY={scrollY} scrollToSection={scrollToSection} />
      {view === "home" && <Home goDetail={goDetail} />}
      {view === "issues" && !selectedIssue && <IssuesPage onSelectIssue={(iss) => setSelectedIssue(iss)} />}
      {view === "issues" && selectedIssue && <IssueDetailView issue={selectedIssue} onBack={() => setSelectedIssue(null)} />}
      {view === "detail" && <Detail article={detail} onBack={() => { setView("home"); setDetail(null); }} />}
    </div>
  );
}

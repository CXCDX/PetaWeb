import { useState, useEffect, useRef, useCallback } from "react";

/*
  PETALS MAGAZINE V5.0 — Bold Editorial Redesign

  Changes from V4.1:
  - Hero: Enhanced 5-image slider with progress bar, Ken Burns effect, bolder overlays
  - Latest: Full magazine cover horizontal slider (i-d.co inspired)
  - Banner: Separated from biodiversity section with proper spacing
  - All floating elements: Deep layered shadows for depth
  - 3-article grid: Stronger depth & elevation
  - Issues section: Bolder cards, deeper shadows, stronger typography
  - Quote: Kept as-is per request
  - Right-side text: i-d.co inspired vertical text element
  - Overall: Bolder design — thicker borders, heavier weights, more contrast
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
      transform: vis ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      ...style,
    }}>{children}</div>
  );
}

// ─── Image with parallax-lite on hover ───
function Img({ src, h = 500, style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ overflow: "hidden", height: h, ...style }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <img src={`https://images.unsplash.com/${src}?w=1600&h=${h + 200}&fit=crop&q=85`} alt=""
        style={{
          width: "100%", height: "110%", objectFit: "cover", display: "block",
          transform: hov ? "scale(1.03)" : "scale(1)",
          transition: "transform 1.2s cubic-bezier(0.16,1,0.3,1)",
        }} />
    </div>
  );
}

// ═══════════════════════════════════════
// NAV — With hamburger menu, no "Journal"
// ═══════════════════════════════════════
function Nav({ view, setView, scrollY, scrollToSection }) {
  const solid = scrollY > 60;
  const [menuOpen, setMenuOpen] = useState(false);

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
        padding: "0 48px", height: 84,
        background: solid ? "rgba(245,240,235,0.96)" : "transparent",
        backdropFilter: solid ? "blur(28px)" : "none",
        borderBottom: solid ? `1.5px solid rgba(200,196,190,0.5)` : "1.5px solid transparent",
        transition: "all 0.5s ease",
      }}>
        <div onClick={() => setView("home")} style={{ cursor: "pointer", display: "flex", alignItems: "baseline", gap: 12 }}>
          <span style={{
            fontFamily: FONT.serif, fontSize: 28, fontWeight: 500,
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: solid ? C.charcoal : C.white,
            transition: "color 0.5s",
          }}>Petals</span>
          <span style={{
            fontFamily: FONT.sans, fontSize: 9, fontWeight: 500,
            letterSpacing: "0.25em", textTransform: "uppercase",
            color: solid ? C.greyMed : "rgba(255,255,255,0.35)",
            transition: "color 0.5s",
          }}>Home</span>
        </div>
        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          <a href="https://gulcicek.com" target="_blank" rel="noopener noreferrer" style={{
            fontFamily: FONT.sans, fontSize: 11, fontWeight: 400,
            color: solid ? C.greyMed : "rgba(255,255,255,0.35)",
            textDecoration: "none", letterSpacing: "0.06em", transition: "color 0.4s",
          }}>Gülçiçek ↗</a>
          {/* Hamburger button */}
          <div onClick={() => setMenuOpen(!menuOpen)} style={{
            cursor: "pointer", width: 36, height: 36,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
            position: "relative", zIndex: 1002,
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
              opacity: menuOpen ? 1 : 1,
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
      }}>
        <div style={{ textAlign: "center" }}>
          {menuItems.map((item, i) => (
            <div key={item.k}
              onClick={item.action}
              style={{
                fontFamily: FONT.serif, fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 400,
                color: C.white, cursor: "pointer",
                padding: "16px 0", lineHeight: 1.3,
                letterSpacing: "-0.01em",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(24px)",
                transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.06}s`,
              }}
              onMouseEnter={e => { e.currentTarget.style.color = C.gold; e.currentTarget.style.fontStyle = "italic"; }}
              onMouseLeave={e => { e.currentTarget.style.color = C.white; e.currentTarget.style.fontStyle = "normal"; }}>
              {item.l}
            </div>
          ))}
          <div style={{
            marginTop: 48, opacity: menuOpen ? 1 : 0,
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
// HERO SLIDER — 5 images, Ken Burns, progress bar
// ═══════════════════════════════════════
function HeroSlider({ goDetail }) {
  const [current, setCurrent] = useState(0);
  const [entered, setEntered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const DURATION = 6000;

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
    <section style={{ height: "100vh", position: "relative", overflow: "hidden", cursor: "pointer" }}
      onClick={() => goDetail(slide)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>

      {/* All images stacked with Ken Burns effect */}
      {HERO_SLIDES.map((s, i) => (
        <div key={s.id} style={{
          position: "absolute", inset: 0,
          opacity: i === current ? 1 : 0,
          transition: "opacity 1.6s cubic-bezier(0.4,0,0.2,1)",
          zIndex: i === current ? 1 : 0,
        }}>
          <img src={`https://images.unsplash.com/${s.img}?w=2000&h=1200&fit=crop&q=90`} alt=""
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              transform: i === current ? "scale(1.08)" : "scale(1)",
              transition: "transform 8s cubic-bezier(0.25,0.1,0.25,1)",
            }} />
        </div>
      ))}

      {/* Gradient overlay — bolder */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2,
        background: "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.7) 100%)",
      }} />

      {/* Content */}
      <div style={{
        position: "absolute", bottom: 72, left: 56, right: 56, zIndex: 10,
        opacity: entered ? 1 : 0, transform: entered ? "translateY(0)" : "translateY(60px)",
        transition: "all 1.4s cubic-bezier(0.16,1,0.3,1) 0.4s",
      }}>
        <div style={{
          fontFamily: FONT.sans, fontSize: 12, fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.6)", marginBottom: 20,
        }}>
          Issue {slide.issue} · {slide.cat}
        </div>
        <h1 key={slide.id} style={{
          fontFamily: FONT.serif, fontWeight: 400, fontStyle: "italic",
          fontSize: "clamp(72px, 12vw, 160px)", lineHeight: 0.88, letterSpacing: "-0.03em",
          color: C.white, margin: 0,
          textShadow: "0 4px 40px rgba(0,0,0,0.3)",
        }}>
          {slide.t}
        </h1>
        <p style={{
          fontFamily: FONT.sans, fontSize: 16, color: "rgba(255,255,255,0.55)",
          marginTop: 22, maxWidth: 500, lineHeight: 1.65, fontWeight: 300,
        }}>
          {slide.desc}
        </p>
      </div>

      {/* Navigation arrows — appear on hover */}
      <div style={{
        position: "absolute", top: "50%", left: 0, right: 0, zIndex: 10,
        display: "flex", justifyContent: "space-between", padding: "0 24px",
        transform: "translateY(-50%)",
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.4s ease",
        pointerEvents: hovered ? "auto" : "none",
      }}
        onClick={e => e.stopPropagation()}>
        <button onClick={() => go(-1)} style={{
          width: 56, height: 56, borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.3)", background: "rgba(0,0,0,0.25)",
          backdropFilter: "blur(16px)", color: C.white, fontSize: 20, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.35s ease",
        }}
          onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.2)"; e.target.style.borderColor = "rgba(255,255,255,0.6)"; e.target.style.transform = "scale(1.1)"; }}
          onMouseLeave={e => { e.target.style.background = "rgba(0,0,0,0.25)"; e.target.style.borderColor = "rgba(255,255,255,0.3)"; e.target.style.transform = "scale(1)"; }}>
          ←
        </button>
        <button onClick={() => go(1)} style={{
          width: 56, height: 56, borderRadius: "50%",
          border: "2px solid rgba(255,255,255,0.3)", background: "rgba(0,0,0,0.25)",
          backdropFilter: "blur(16px)", color: C.white, fontSize: 20, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.35s ease",
        }}
          onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.2)"; e.target.style.borderColor = "rgba(255,255,255,0.6)"; e.target.style.transform = "scale(1.1)"; }}
          onMouseLeave={e => { e.target.style.background = "rgba(0,0,0,0.25)"; e.target.style.borderColor = "rgba(255,255,255,0.3)"; e.target.style.transform = "scale(1)"; }}>
          →
        </button>
      </div>

      {/* Progress bar at bottom */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 12, display: "flex", gap: 3, padding: "0 56px", height: 3 }}
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

      {/* Issue badge — top right, bolder */}
      <div style={{
        position: "absolute", top: 110, right: 56, zIndex: 10,
        opacity: entered ? 1 : 0, transition: "opacity 1.5s ease 0.8s",
      }}>
        <div style={{ fontFamily: FONT.serif, fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.35)", letterSpacing: "0.15em", textTransform: "uppercase", textAlign: "right" }}>
          Winter 2025<br />
          <span style={{ fontSize: 64, lineHeight: 1, color: "rgba(255,255,255,0.12)", fontWeight: 400 }}>39</span>
        </div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════
// LATEST — i-d.co inspired, green bg, 12 articles, dynamic layout
// ═══════════════════════════════════════
// Card size patterns for visual dynamism
const CARD_LAYOUTS = [
  { w: 360, h: 520, type: "tall" },
  { w: 300, h: 380, type: "medium" },
  { w: 440, h: 340, type: "wide" },
  { w: 320, h: 500, type: "tall" },
  { w: 380, h: 300, type: "wide" },
  { w: 280, h: 440, type: "medium" },
  { w: 400, h: 520, type: "tall" },
  { w: 340, h: 360, type: "medium" },
  { w: 420, h: 320, type: "wide" },
  { w: 340, h: 500, type: "tall" },
  { w: 300, h: 400, type: "medium" },
  { w: 380, h: 340, type: "wide" },
];

function LatestSection({ goDetail }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
    if (el) el.scrollBy({ left: dir * 600, behavior: "smooth" });
  };

  return (
    <section style={{ background: C.green, padding: "80px 0 88px", position: "relative" }}>
      {/* Header */}
      <div style={{ padding: "0 56px", marginBottom: 48 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div style={{
              fontFamily: FONT.sans, fontSize: 13, fontWeight: 600,
              letterSpacing: "0.4em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)", marginBottom: 16,
            }}>
              Latest
            </div>
            <div style={{
              fontFamily: FONT.serif, fontSize: "clamp(36px, 4vw, 56px)", fontWeight: 400,
              color: C.white, lineHeight: 1.05, letterSpacing: "-0.02em",
            }}>
              Issue 39 <span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.5)" }}>— Winter 2025</span>
            </div>
            <div style={{
              fontFamily: FONT.sans, fontSize: 14, color: "rgba(255,255,255,0.35)",
              marginTop: 12, fontWeight: 300,
            }}>
              12 Stories · Scroll to explore
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => scroll(-1)} style={{
              width: 48, height: 48,
              border: `2px solid ${canScrollLeft ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)"}`,
              background: "transparent",
              color: canScrollLeft ? C.white : "rgba(255,255,255,0.2)",
              fontSize: 18, cursor: canScrollLeft ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.35s ease",
            }}
              onMouseEnter={e => { if (canScrollLeft) { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = C.white; }}}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; if (canScrollLeft) e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; }}>
              ←
            </button>
            <button onClick={() => scroll(1)} style={{
              width: 48, height: 48,
              border: `2px solid ${canScrollRight ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.15)"}`,
              background: "transparent",
              color: canScrollRight ? C.white : "rgba(255,255,255,0.2)",
              fontSize: 18, cursor: canScrollRight ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.35s ease",
            }}
              onMouseEnter={e => { if (canScrollRight) { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = C.white; }}}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; if (canScrollRight) e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; }}>
              →
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal dynamic article cards */}
      <div ref={scrollRef} style={{
        display: "flex", gap: 24, overflowX: "auto", paddingLeft: 56, paddingRight: 56, paddingBottom: 16,
        scrollbarWidth: "none", msOverflowStyle: "none",
        alignItems: "flex-end",
      }}>
        {ARTICLES.map((a, i) => {
          const layout = CARD_LAYOUTS[i % CARD_LAYOUTS.length];
          return (
            <div key={a.id} onClick={() => goDetail(a)} style={{
              minWidth: layout.w, flex: `0 0 ${layout.w}px`, cursor: "pointer",
              transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
              alignSelf: layout.type === "wide" ? "flex-end" : layout.type === "tall" ? "flex-start" : "center",
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-10px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{
                position: "relative", overflow: "hidden", height: layout.h,
                boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
                transition: "box-shadow 0.5s ease",
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.5)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "0 8px 40px rgba(0,0,0,0.3)"}>
                <img src={`https://images.unsplash.com/${a.img}?w=${layout.w * 2}&h=${layout.h * 2}&fit=crop&q=85`} alt=""
                  style={{
                    width: "100%", height: "100%", objectFit: "cover", display: "block",
                    transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)",
                  }}
                  onMouseEnter={e => e.target.style.transform = "scale(1.06)"}
                  onMouseLeave={e => e.target.style.transform = "scale(1)"} />
                {/* Gradient overlay */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: layout.type === "tall"
                    ? "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.65) 100%)"
                    : "linear-gradient(180deg, transparent 20%, rgba(0,0,0,0.7) 100%)",
                }} />
                {/* Category tag */}
                <div style={{
                  position: "absolute", top: 20, left: 20,
                  fontFamily: FONT.sans, fontSize: 10, fontWeight: 600,
                  letterSpacing: "0.25em", textTransform: "uppercase",
                  color: "rgba(255,255,255,0.6)",
                }}>
                  {a.cat}
                </div>
                {/* Title & subtitle */}
                <div style={{ position: "absolute", bottom: 24, left: 24, right: 24 }}>
                  <h3 style={{
                    fontFamily: FONT.serif,
                    fontSize: layout.type === "tall" ? 32 : layout.type === "wide" ? 28 : 24,
                    fontWeight: 400, color: C.white, margin: 0,
                    lineHeight: 1.05, letterSpacing: "-0.02em",
                    textShadow: "0 2px 16px rgba(0,0,0,0.4)",
                  }}>
                    {a.t}
                  </h3>
                  <p style={{
                    fontFamily: FONT.sans, fontSize: 12, color: "rgba(255,255,255,0.55)",
                    margin: "10px 0 0", fontWeight: 300, lineHeight: 1.5,
                  }}>
                    {a.sub}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fade edge */}
      {canScrollRight && (
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
  return (
    <div style={{ background: C.cream }}>

      <HeroSlider goDetail={goDetail} />

      {/* ───── SECTION: Latest — i-d.co style, green bg, 12 articles ───── */}
      <LatestSection goDetail={goDetail} />

      {/* ───── SECTION: Editor's Picks — image cards with text overlay ───── */}
      <section id="section-editorpicks" style={{ padding: "100px 56px 120px" }}>
        <Reveal>
          <div style={{ marginBottom: 56, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{
                fontFamily: FONT.sans, fontSize: 14, fontWeight: 600,
                letterSpacing: "0.35em", textTransform: "uppercase", color: C.green,
                marginBottom: 16, paddingBottom: 16,
                borderBottom: `3px solid ${C.green}`,
                display: "inline-block",
              }}>
                Editor's Picks
              </div>
              <div style={{ fontFamily: FONT.sans, fontSize: 14, color: C.grey, fontWeight: 300, marginTop: 8 }}>
                Curated by the editors · Issue 39
              </div>
            </div>
          </div>
        </Reveal>

        {/* Dynamic mosaic grid — first row: 1 large + 2 stacked, second row: 3 equal */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gridTemplateRows: "380px 380px", gap: 20 }}>
          {ARTICLES.slice(0, 6).map((a, i) => {
            const gridPos = [
              { gridColumn: "1 / 2", gridRow: "1 / 3" },   // tall left
              { gridColumn: "2 / 3", gridRow: "1 / 2" },   // top mid
              { gridColumn: "3 / 4", gridRow: "1 / 2" },   // top right
              { gridColumn: "2 / 3", gridRow: "2 / 3" },   // bottom mid
              { gridColumn: "3 / 4", gridRow: "2 / 3" },   // bottom right (will be replaced)
              null,
            ][i];
            // Last item spans bottom right as a wide banner
            if (i === 4) return (
              <Reveal key={a.id} delay={i * 0.08} style={{ gridColumn: "3 / 4", gridRow: "2 / 3" }}>
                <div onClick={() => goDetail(a)} style={{
                  position: "relative", overflow: "hidden", height: "100%", cursor: "pointer",
                  boxShadow: `0 8px 32px ${C.shadowMid}`,
                  transition: "box-shadow 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)",
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 20px 56px ${C.shadowDeep}`; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 8px 32px ${C.shadowMid}`; e.currentTarget.style.transform = "translateY(0)"; }}>
                  <img src={`https://images.unsplash.com/${a.img}?w=800&h=800&fit=crop&q=85`} alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 1s cubic-bezier(0.16,1,0.3,1)" }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
                    onMouseLeave={e => e.target.style.transform = "scale(1)"} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.7) 100%)" }} />
                  <div style={{ position: "absolute", top: 20, left: 22 }}>
                    <span style={{ fontFamily: FONT.sans, fontSize: 9, fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>{a.cat}</span>
                  </div>
                  <div style={{ position: "absolute", bottom: 24, left: 24, right: 24 }}>
                    <span style={{ fontFamily: FONT.serif, fontSize: 14, color: "rgba(255,255,255,0.35)", fontStyle: "italic" }}>{String(i + 1).padStart(2, "0")}</span>
                    <h4 style={{ fontFamily: FONT.serif, fontSize: 22, fontWeight: 400, color: C.white, margin: "6px 0 4px", lineHeight: 1.1, letterSpacing: "-0.01em" }}>{a.t}</h4>
                    <p style={{ fontFamily: FONT.sans, fontSize: 12, color: "rgba(255,255,255,0.5)", margin: 0, fontWeight: 300, lineHeight: 1.4 }}>{a.sub}</p>
                  </div>
                </div>
              </Reveal>
            );
            if (i === 5) return (
              <Reveal key={a.id} delay={i * 0.08} style={{ gridColumn: "1 / 4", marginTop: 12 }}>
                <div onClick={() => goDetail(a)} style={{
                  position: "relative", overflow: "hidden", height: 220, cursor: "pointer",
                  boxShadow: `0 8px 32px ${C.shadowMid}`,
                  display: "flex",
                  transition: "box-shadow 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)",
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 20px 56px ${C.shadowDeep}`; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 8px 32px ${C.shadowMid}`; e.currentTarget.style.transform = "translateY(0)"; }}>
                  <img src={`https://images.unsplash.com/${a.img}?w=1600&h=500&fit=crop&q=85`} alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 1s cubic-bezier(0.16,1,0.3,1)" }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.03)"}
                    onMouseLeave={e => e.target.style.transform = "scale(1)"} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)" }} />
                  <div style={{ position: "absolute", bottom: 28, left: 36, right: 36 }}>
                    <span style={{ fontFamily: FONT.sans, fontSize: 9, fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>{a.cat}</span>
                    <h4 style={{ fontFamily: FONT.serif, fontSize: 30, fontWeight: 400, color: C.white, margin: "8px 0 6px", lineHeight: 1.05, letterSpacing: "-0.01em" }}>{a.t}</h4>
                    <p style={{ fontFamily: FONT.sans, fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0, fontWeight: 300, lineHeight: 1.4 }}>{a.sub}</p>
                  </div>
                </div>
              </Reveal>
            );
            if (!gridPos) return null;
            const isTall = i === 0;
            return (
              <Reveal key={a.id} delay={i * 0.08} style={gridPos}>
                <div onClick={() => goDetail(a)} style={{
                  position: "relative", overflow: "hidden", height: "100%", cursor: "pointer",
                  boxShadow: `0 8px 32px ${C.shadowMid}`,
                  transition: "box-shadow 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)",
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 20px 56px ${C.shadowDeep}`; e.currentTarget.style.transform = "translateY(-4px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 8px 32px ${C.shadowMid}`; e.currentTarget.style.transform = "translateY(0)"; }}>
                  <img src={`https://images.unsplash.com/${a.img}?w=${isTall ? 1000 : 800}&h=${isTall ? 1400 : 800}&fit=crop&q=85`} alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 1s cubic-bezier(0.16,1,0.3,1)" }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
                    onMouseLeave={e => e.target.style.transform = "scale(1)"} />
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
                      margin: "8px 0 6px", lineHeight: 1.08, letterSpacing: "-0.01em",
                      textShadow: "0 2px 16px rgba(0,0,0,0.4)",
                    }}>{a.t}</h4>
                    <p style={{ fontFamily: FONT.sans, fontSize: isTall ? 14 : 12, color: "rgba(255,255,255,0.5)", margin: 0, fontWeight: 300, lineHeight: 1.4 }}>{a.sub}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ───── FULL BLEED: Sustainability banner ───── */}
      <Reveal>
        <section id="section-sustainability" onClick={() => goDetail(ARTICLES[3])} style={{
          position: "relative", height: "64vh", overflow: "hidden", cursor: "pointer",
        }}>
          <img src={`https://images.unsplash.com/${ARTICLES[3].img}?w=2000&h=1000&fit=crop&q=85`} alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(15,42,30,0.92) 0%, rgba(15,42,30,0.4) 55%, transparent 100%)" }} />
          <div style={{ position: "absolute", top: "50%", left: 56, transform: "translateY(-50%)", zIndex: 2, maxWidth: 560 }}>
            <div style={{ fontFamily: FONT.sans, fontSize: 12, fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>Sustainability · Issue 39</div>
            <h2 style={{
              fontFamily: FONT.serif, fontSize: "clamp(48px, 5.5vw, 72px)", fontWeight: 400,
              color: C.white, margin: "0 0 24px", lineHeight: 0.95, letterSpacing: "-0.02em",
            }}>
              Biodiversity<br />in the Bottle
            </h2>
            <p style={{ fontFamily: FONT.sans, fontSize: 15, color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.7, fontWeight: 300, maxWidth: 420 }}>
              {ARTICLES[3].desc}
            </p>
            <div style={{ marginTop: 36, width: 56, height: 3, background: "rgba(255,255,255,0.4)" }} />
          </div>
        </section>
      </Reveal>

      {/* ───── SPACER ───── */}
      <div style={{ height: 80, background: C.cream }} />

      {/* ───── NEW ISSUE BANNER — Separated, clean, bold ───── */}
      <Reveal>
        <section style={{
          margin: "0 56px", padding: "64px 48px",
          background: C.charcoal,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0, opacity: 0.04,
            backgroundImage: `repeating-linear-gradient(45deg, ${C.white} 0, ${C.white} 1px, transparent 0, transparent 50%)`,
            backgroundSize: "18px 18px",
          }} />
          <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <div style={{
              fontFamily: FONT.sans, fontSize: 11, fontWeight: 500, letterSpacing: "0.4em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.35)", marginBottom: 20,
            }}>
              Now Available
            </div>
            <div style={{
              fontFamily: FONT.serif, fontSize: "clamp(36px, 4.5vw, 64px)", fontWeight: 400,
              color: C.white, lineHeight: 1.05, letterSpacing: "-0.02em",
            }}>
              Petals <span style={{ fontWeight: 500, fontStyle: "italic" }}>Issue 39</span> is Out.
            </div>
            <div style={{
              fontFamily: FONT.sans, fontSize: 14, color: "rgba(255,255,255,0.4)", marginTop: 16,
              letterSpacing: "0.1em", fontWeight: 300,
            }}>
              Winter 2025 · 84 Pages · 12 Stories
            </div>
            <div style={{
              marginTop: 32, display: "inline-block",
              fontFamily: FONT.sans, fontSize: 12, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase",
              color: C.white, padding: "14px 36px",
              border: `2px solid rgba(255,255,255,0.3)`,
              transition: "all 0.4s ease",
            }}
              onMouseEnter={e => { e.target.style.background = C.white; e.target.style.color = C.charcoal; e.target.style.borderColor = C.white; }}
              onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = C.white; e.target.style.borderColor = "rgba(255,255,255,0.3)"; }}>
              Read This Issue →
            </div>
          </div>
        </section>
      </Reveal>

      <div style={{ height: 80, background: C.cream }} />

      {/* ───── SECTION: Do Not Miss — 3-article stagger with depth ───── */}
      <section id="section-donotmiss" style={{ padding: "40px 56px 120px" }}>
        <Reveal>
          <div style={{
            fontFamily: FONT.sans, fontSize: 14, fontWeight: 600,
            letterSpacing: "0.35em", textTransform: "uppercase", color: C.green,
            marginBottom: 48, paddingBottom: 16,
            borderBottom: `3px solid ${C.green}`,
            display: "inline-block",
          }}>
            Do Not Miss
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 36 }}>
          {ARTICLES.slice(5, 8).map((a, i) => (
            <Reveal key={a.id} delay={i * 0.12}>
              <div onClick={() => goDetail(a)} style={{
                cursor: "pointer",
                marginTop: i === 1 ? 72 : 0,
                background: C.cream,
                boxShadow: `0 8px 32px ${C.shadowMid}, 0 2px 8px ${C.shadow}, 0 0 0 1px rgba(200,196,190,0.2)`,
                transition: "box-shadow 0.5s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1)",
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 20px 64px ${C.shadowDeep}, 0 8px 24px ${C.shadowMid}, 0 0 0 1px rgba(200,196,190,0.3)`; e.currentTarget.style.transform = "translateY(-8px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 8px 32px ${C.shadowMid}, 0 2px 8px ${C.shadow}, 0 0 0 1px rgba(200,196,190,0.2)`; e.currentTarget.style.transform = "translateY(0)"; }}>
                <Img src={a.img} h={i === 1 ? 480 : 400} />
                <div style={{ padding: "28px 28px 32px" }}>
                  <div style={{ fontFamily: FONT.sans, fontSize: 11, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: C.green, marginBottom: 12 }}>{a.cat}</div>
                  <h3 style={{ fontFamily: FONT.serif, fontSize: 28, fontWeight: 400, color: C.charcoal, margin: "0 0 10px", lineHeight: 1.1, letterSpacing: "-0.01em" }}>{a.t}</h3>
                  <p style={{ fontFamily: FONT.sans, fontSize: 13, color: C.grey, margin: 0, lineHeight: 1.55, fontWeight: 300 }}>{a.sub}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───── GIANT QUOTE STRIP — stays as is ───── */}
      <Reveal>
        <section style={{ padding: "88px 56px", borderTop: `3px solid ${C.greyLight}`, borderBottom: `3px solid ${C.greyLight}` }}>
          <h2 style={{
            fontFamily: FONT.serif, fontSize: "clamp(48px, 5.5vw, 80px)", fontWeight: 400, fontStyle: "italic",
            color: C.green, margin: 0, lineHeight: 1.05, letterSpacing: "-0.02em", maxWidth: "80%",
          }}>
            "Perfume is the most intense form of memory."
          </h2>
          <div style={{ fontFamily: FONT.sans, fontSize: 13, fontWeight: 500, color: C.grey, marginTop: 28, letterSpacing: "0.12em" }}>Jean-Paul Guerlain</div>
        </section>
      </Reveal>

      {/* ───── SECTION: Issues — horizontal slider ───── */}
      <IssuesSlider />

      <Footer />
    </div>
  );
}

// ═══════════════════════════════════════
// ISSUES SLIDER — Bolder, deeper, stronger
// ═══════════════════════════════════════
function IssuesSlider() {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
    if (el) el.scrollBy({ left: dir * 700, behavior: "smooth" });
  };

  return (
    <section style={{ padding: "100px 0 100px 56px", borderTop: `3px solid ${C.greyLight}`, position: "relative" }}>
      <Reveal>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56, paddingRight: 56 }}>
          <div>
            <div style={{
              fontFamily: FONT.sans, fontSize: 14, fontWeight: 600,
              letterSpacing: "0.35em", textTransform: "uppercase", color: C.green,
              marginBottom: 16, paddingBottom: 12,
              borderBottom: `3px solid ${C.green}`,
              display: "inline-block",
            }}>
              Issues
            </div>
            <div style={{
              fontFamily: FONT.serif, fontSize: "clamp(48px, 5vw, 76px)", fontWeight: 400,
              color: C.charcoal, lineHeight: 1, letterSpacing: "-0.02em",
            }}>
              The Archive
            </div>
            <div style={{ fontFamily: FONT.sans, fontSize: 14, color: C.grey, marginTop: 14, fontWeight: 400, letterSpacing: "0.02em" }}>
              39 issues · 2010 – 2025 · Swipe to explore
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => scroll(-1)} style={{
              width: 52, height: 52,
              border: `2px solid ${canScrollLeft ? C.charcoal : C.greyLight}`,
              background: canScrollLeft ? C.charcoal : "transparent",
              color: canScrollLeft ? C.white : C.greyLight,
              fontSize: 18, cursor: canScrollLeft ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.35s ease",
            }}
              onMouseEnter={e => { if (canScrollLeft) { e.currentTarget.style.background = C.green; e.currentTarget.style.borderColor = C.green; }}}
              onMouseLeave={e => { if (canScrollLeft) { e.currentTarget.style.background = C.charcoal; e.currentTarget.style.borderColor = C.charcoal; }}}>
              ←
            </button>
            <button onClick={() => scroll(1)} style={{
              width: 52, height: 52,
              border: `2px solid ${canScrollRight ? C.charcoal : C.greyLight}`,
              background: canScrollRight ? C.charcoal : "transparent",
              color: canScrollRight ? C.white : C.greyLight,
              fontSize: 18, cursor: canScrollRight ? "pointer" : "default",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.35s ease",
            }}
              onMouseEnter={e => { if (canScrollRight) { e.currentTarget.style.background = C.green; e.currentTarget.style.borderColor = C.green; }}}
              onMouseLeave={e => { if (canScrollRight) { e.currentTarget.style.background = C.charcoal; e.currentTarget.style.borderColor = C.charcoal; }}}>
              →
            </button>
          </div>
        </div>
      </Reveal>

      <div ref={scrollRef} style={{
        display: "flex", gap: 24, overflowX: "auto", paddingBottom: 28, paddingRight: 56,
        scrollbarWidth: "none", msOverflowStyle: "none",
      }}>
        {ISSUES.map((iss, i) => (
          <div key={iss.num} style={{
            minWidth: 240, flex: "0 0 240px", cursor: "pointer",
            transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-10px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
            <div style={{
              position: "relative", overflow: "hidden",
              boxShadow: `0 8px 32px ${C.shadowMid}, 0 2px 8px ${C.shadow}`,
              transition: "box-shadow 0.5s ease",
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 20px 56px ${C.shadowDeep}, 0 6px 20px ${C.shadowMid}`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = `0 8px 32px ${C.shadowMid}, 0 2px 8px ${C.shadow}`}>
              <img src={`https://images.unsplash.com/${iss.img}?w=480&h=672&fit=crop`} alt=""
                style={{
                  width: "100%", aspectRatio: "5/7", objectFit: "cover", display: "block",
                  transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)",
                }}
                onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
                onMouseLeave={e => e.target.style.transform = "scale(1)"} />
              {/* Dark overlay for number */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.4) 100%)",
              }} />
              <div style={{
                position: "absolute", bottom: 18, left: 18,
                fontFamily: FONT.serif, fontSize: 72, color: "rgba(255,255,255,0.15)", lineHeight: 1, fontWeight: 400,
              }}>{iss.num}</div>
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ fontFamily: FONT.sans, fontSize: 13, color: C.charcoal, fontWeight: 500, letterSpacing: "0.02em" }}>No. {iss.num}</div>
              <div style={{ fontFamily: FONT.sans, fontSize: 11, color: C.grey, marginTop: 4, fontWeight: 400 }}>{iss.season} {iss.year}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Fade edges */}
      {canScrollRight && (
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
// ISSUES ARCHIVE PAGE — Creative, dynamic layout
// ═══════════════════════════════════════

// Color themes per issue — unique visual identity
const ISSUE_THEMES = [
  { bg: "#1B3D2F", accent: "#C4A35A", label: "Winter 2025" },
  { bg: "#2C1810", accent: "#D4896A", label: "Autumn 2024" },
  { bg: "#1A1A2E", accent: "#7B8CDE", label: "Summer 2024" },
  { bg: "#3D2B1B", accent: "#E8C87A", label: "Spring 2024" },
  { bg: "#0D2137", accent: "#6BBCD4", label: "Winter 2024" },
  { bg: "#2D1F3D", accent: "#B88AD4", label: "Autumn 2023" },
];

function IssueDetailView({ issue, onBack }) {
  const [entered, setEntered] = useState(false);
  useEffect(() => { setTimeout(() => setEntered(true), 100); }, []);
  const theme = ISSUE_THEMES[(39 - issue.num) % ISSUE_THEMES.length];
  const issueArticles = ARTICLES.filter(a => a.issue === issue.num).length > 0
    ? ARTICLES.filter(a => a.issue === issue.num)
    : ARTICLES.slice(0, 6);

  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      {/* Hero banner for this specific issue */}
      <section style={{
        height: "70vh", position: "relative", overflow: "hidden",
        background: theme.bg,
      }}>
        <img src={`https://images.unsplash.com/${issue.img}?w=2000&h=1200&fit=crop&q=85`} alt=""
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            opacity: entered ? 0.4 : 0, transition: "opacity 1.5s ease",
            mixBlendMode: "luminosity",
          }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${theme.bg}dd 0%, transparent 40%, ${theme.bg}ee 100%)` }} />
        <div style={{
          position: "absolute", top: "50%", left: 56, transform: "translateY(-50%)", zIndex: 2,
          opacity: entered ? 1 : 0, transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.3s",
        }}>
          <div style={{ fontFamily: FONT.sans, fontSize: 12, fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: theme.accent, marginBottom: 20 }}>
            {issue.season} {issue.year}
          </div>
          <div style={{
            fontFamily: FONT.serif, fontSize: "clamp(80px, 15vw, 200px)", fontWeight: 400, fontStyle: "italic",
            color: "rgba(255,255,255,0.08)", lineHeight: 0.85, letterSpacing: "-0.04em",
            position: "absolute", top: -40, left: -8,
          }}>{issue.num}</div>
          <h1 style={{
            fontFamily: FONT.serif, fontSize: "clamp(48px, 7vw, 88px)", fontWeight: 400,
            color: C.white, margin: 0, lineHeight: 0.95, letterSpacing: "-0.03em", position: "relative",
          }}>
            Petals<br /><span style={{ fontStyle: "italic", color: theme.accent }}>No. {issue.num}</span>
          </h1>
          <p style={{ fontFamily: FONT.sans, fontSize: 15, color: "rgba(255,255,255,0.4)", marginTop: 20, fontWeight: 300 }}>
            84 Pages · 12 Stories · {issue.season} Edition
          </p>
        </div>
        <div onClick={onBack} style={{
          position: "absolute", top: 110, left: 56, zIndex: 10,
          fontFamily: FONT.sans, fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.5)",
          cursor: "pointer", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 8,
          padding: "10px 20px", border: `1.5px solid rgba(255,255,255,0.2)`,
          transition: "all 0.3s ease",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}>
          ← All Issues
        </div>
        {/* Accent line */}
        <div style={{ position: "absolute", bottom: 0, left: 56, right: 56, height: 3, background: theme.accent, opacity: 0.6 }} />
      </section>

      {/* Articles in this issue */}
      <section style={{ padding: "80px 56px 120px" }}>
        <Reveal>
          <div style={{ fontFamily: FONT.sans, fontSize: 14, fontWeight: 600, letterSpacing: "0.35em", textTransform: "uppercase", color: C.green, marginBottom: 48 }}>
            In This Issue
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32 }}>
          {issueArticles.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.1}>
              <div style={{
                cursor: "pointer",
                marginTop: i % 3 === 1 ? 48 : 0,
                transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-8px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                <div style={{
                  position: "relative", overflow: "hidden", height: 320,
                  boxShadow: `0 8px 32px ${C.shadowMid}`,
                  transition: "box-shadow 0.5s ease",
                }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = `0 20px 56px ${C.shadowDeep}`}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = `0 8px 32px ${C.shadowMid}`}>
                  <img src={`https://images.unsplash.com/${a.img}?w=800&h=700&fit=crop&q=85`} alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)" }}
                    onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
                    onMouseLeave={e => e.target.style.transform = "scale(1)"} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.6) 100%)" }} />
                  <div style={{ position: "absolute", bottom: 22, left: 22, right: 22 }}>
                    <span style={{ fontFamily: FONT.sans, fontSize: 9, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: theme.accent }}>{a.cat}</span>
                    <h4 style={{ fontFamily: FONT.serif, fontSize: 24, fontWeight: 400, color: C.white, margin: "6px 0 0", lineHeight: 1.1 }}>{a.t}</h4>
                  </div>
                </div>
                <div style={{ padding: "16px 0" }}>
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
  // Group issues into featured (latest), recent, and older
  const featured = ISSUES[0];
  const recent = ISSUES.slice(1, 5);
  const older = ISSUES.slice(5);

  return (
    <div style={{ background: C.cream, minHeight: "100vh", paddingTop: 120 }}>
      {/* Header */}
      <div style={{ padding: "0 56px 24px" }}>
        <Reveal>
          <div style={{
            fontFamily: FONT.sans, fontSize: 14, fontWeight: 600,
            letterSpacing: "0.35em", textTransform: "uppercase", color: C.green,
            marginBottom: 16, paddingBottom: 16,
            borderBottom: `3px solid ${C.green}`, display: "inline-block",
          }}>Issues</div>
          <h1 style={{ fontFamily: FONT.serif, fontSize: "clamp(56px, 8vw, 100px)", fontWeight: 400, color: C.charcoal, margin: "0 0 8px", lineHeight: 0.95, letterSpacing: "-0.03em" }}>
            The Archive
          </h1>
          <p style={{ fontFamily: FONT.sans, fontSize: 15, color: C.grey, margin: 0, fontWeight: 300 }}>39 issues · 2010 – 2025 · Every story preserved.</p>
        </Reveal>
      </div>

      {/* Featured latest issue — full width hero */}
      <Reveal>
        <div onClick={() => onSelectIssue(featured)} style={{
          margin: "48px 56px 0", position: "relative", height: "50vh", overflow: "hidden", cursor: "pointer",
          boxShadow: `0 16px 64px ${C.shadowDeep}`,
          transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
        }}
          onMouseEnter={e => e.currentTarget.style.transform = "translateY(-6px)"}
          onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
          <img src={`https://images.unsplash.com/${featured.img}?w=2000&h=1000&fit=crop&q=90`} alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 1.2s cubic-bezier(0.16,1,0.3,1)" }}
            onMouseEnter={e => e.target.style.transform = "scale(1.03)"}
            onMouseLeave={e => e.target.style.transform = "scale(1)"} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(15,42,30,0.88) 0%, rgba(15,42,30,0.3) 60%, transparent 100%)" }} />
          <div style={{ position: "absolute", top: "50%", left: 48, transform: "translateY(-50%)", zIndex: 2 }}>
            <div style={{ fontFamily: FONT.sans, fontSize: 11, fontWeight: 600, letterSpacing: "0.35em", textTransform: "uppercase", color: C.gold, marginBottom: 16 }}>Latest Issue</div>
            <h2 style={{ fontFamily: FONT.serif, fontSize: "clamp(48px, 6vw, 80px)", fontWeight: 400, color: C.white, margin: 0, lineHeight: 0.95, letterSpacing: "-0.02em" }}>
              No. {featured.num}
            </h2>
            <p style={{ fontFamily: FONT.sans, fontSize: 14, color: "rgba(255,255,255,0.45)", marginTop: 14, fontWeight: 300 }}>
              {featured.season} {featured.year} · 84 Pages
            </p>
          </div>
          <div style={{
            position: "absolute", bottom: 32, right: 48,
            fontFamily: FONT.serif, fontSize: 140, color: "rgba(255,255,255,0.06)", lineHeight: 1, fontWeight: 400,
          }}>{featured.num}</div>
        </div>
      </Reveal>

      {/* Recent 4 issues — asymmetric grid */}
      <div style={{ padding: "48px 56px 0", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 24 }}>
        {recent.map((iss, i) => (
          <Reveal key={iss.num} delay={i * 0.1}>
            <div onClick={() => onSelectIssue(iss)} style={{
              cursor: "pointer",
              marginTop: i % 2 === 1 ? 40 : 0,
              transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-8px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{
                position: "relative", overflow: "hidden",
                boxShadow: `0 8px 32px ${C.shadowMid}`,
                transition: "box-shadow 0.5s ease",
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 20px 56px ${C.shadowDeep}`}
                onMouseLeave={e => e.currentTarget.style.boxShadow = `0 8px 32px ${C.shadowMid}`}>
                <img src={`https://images.unsplash.com/${iss.img}?w=600&h=840&fit=crop`} alt=""
                  style={{ width: "100%", aspectRatio: "5/7", objectFit: "cover", display: "block", transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)" }}
                  onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.target.style.transform = "scale(1)"} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.5) 100%)" }} />
                <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
                  <div style={{ fontFamily: FONT.serif, fontSize: 36, color: C.white, fontWeight: 400, lineHeight: 1 }}>{iss.num}</div>
                  <div style={{ fontFamily: FONT.sans, fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 6, fontWeight: 400, letterSpacing: "0.08em" }}>{iss.season} {iss.year}</div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Divider */}
      <div style={{ padding: "64px 56px 0" }}>
        <Reveal>
          <div style={{ borderTop: `2px solid ${C.greyLight}`, paddingTop: 40 }}>
            <span style={{ fontFamily: FONT.sans, fontSize: 13, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: C.greyMed }}>
              All Issues · {older.length} more
            </span>
          </div>
        </Reveal>
      </div>

      {/* Older issues — compact horizontal rows, 2 per row with image + text */}
      <div style={{ padding: "32px 56px 120px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {older.map((iss, i) => (
            <Reveal key={iss.num} delay={Math.min(i * 0.03, 0.4)}>
              <div onClick={() => onSelectIssue(iss)} style={{
                cursor: "pointer", display: "flex", gap: 20, alignItems: "center",
                padding: 16, transition: "all 0.35s ease",
                borderBottom: `1px solid ${C.greyLight}`,
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(27,61,47,0.03)"; e.currentTarget.style.paddingLeft = "24px"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.paddingLeft = "16px"; }}>
                <div style={{
                  width: 72, height: 100, overflow: "hidden", flexShrink: 0,
                  boxShadow: `0 4px 16px ${C.shadow}`,
                }}>
                  <img src={`https://images.unsplash.com/${iss.img}?w=144&h=200&fit=crop`} alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FONT.serif, fontSize: 22, color: C.charcoal, fontWeight: 400 }}>No. {iss.num}</div>
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
  const [entered, setEntered] = useState(false);
  useEffect(() => { setTimeout(() => setEntered(true), 100); }, []);
  if (!article) return null;

  return (
    <div style={{ background: C.cream }}>
      <section style={{ height: "90vh", position: "relative", overflow: "hidden" }}>
        <img src={`https://images.unsplash.com/${article.img}?w=2000&h=1200&fit=crop&q=90`} alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: entered ? 1 : 0.2, transition: "opacity 1.8s ease" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.6) 100%)" }} />
        <div style={{
          position: "absolute", bottom: 60, left: 56, right: 56, zIndex: 2,
          opacity: entered ? 1 : 0, transform: entered ? "translateY(0)" : "translateY(40px)",
          transition: "all 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s",
        }}>
          <div style={{ fontFamily: FONT.sans, fontSize: 12, fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>
            {article.cat} · Issue {article.issue}
          </div>
          <h1 style={{
            fontFamily: FONT.serif, fontSize: "clamp(48px, 8vw, 100px)", fontWeight: 400, fontStyle: "italic",
            color: C.white, margin: 0, lineHeight: 0.92, letterSpacing: "-0.03em",
            textShadow: "0 4px 32px rgba(0,0,0,0.3)",
          }}>{article.t}</h1>
          {article.sub && (
            <p style={{ fontFamily: FONT.sans, fontSize: 17, color: "rgba(255,255,255,0.5)", marginTop: 18, fontWeight: 300 }}>{article.sub}</p>
          )}
        </div>
        <div onClick={onBack} style={{
          position: "absolute", top: 100, left: 56, zIndex: 10,
          fontFamily: FONT.sans, fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.5)",
          cursor: "pointer", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 8,
          padding: "10px 20px", border: "1.5px solid rgba(255,255,255,0.2)",
          transition: "all 0.3s ease",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}>
          ← Back
        </div>
      </section>

      <section style={{ padding: "80px 56px", maxWidth: 700, margin: "0 auto" }}>
        <p style={{ fontFamily: FONT.serif, fontSize: 23, lineHeight: 1.6, color: C.darkGrey, margin: "0 0 48px", fontStyle: "italic" }}>
          {article.desc}
        </p>
        <div style={{ width: 56, height: 3, background: C.green, marginBottom: 48 }} />
        {[
          "The scent of tobacco is one of perfumery's great paradoxes: at once warm and cool, sweet and bitter, comforting and unsettling. It carries the weight of ritual; the pipe after dinner, the ceremonial offering, the quiet moment of reflection.",
          "In the gardens of 17th century Istanbul, tobacco was celebrated through elaborate rituals. The Ottoman tobacco ceremony created an olfactive landscape that perfumers would later seek to capture. The smoky sweetness, the honeyed warmth, the leathery depth: memories encoded in the molecule.",
          "Modern tobacco accords rely on a carefully orchestrated symphony of molecules. At the heart lies coumarin, responsible for that distinctive hay-like sweetness. Around it, perfumers layer vanillin for warmth, iso-quinoline for the smoky bite, and various musks for the lingering trail.",
        ].map((txt, i) => (
          <p key={i} style={{ fontFamily: FONT.sans, fontSize: 16, lineHeight: 1.9, color: "rgba(44,44,44,0.8)", margin: "0 0 28px", fontWeight: 300 }}>{txt}</p>
        ))}
        <div style={{ margin: "56px -80px", overflow: "hidden", boxShadow: `0 12px 56px ${C.shadowDeep}` }}>
          <img src="https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=1400&h=500&fit=crop" alt="" style={{ width: "100%", height: 380, objectFit: "cover", display: "block" }} />
        </div>
        <h2 style={{ fontFamily: FONT.serif, fontSize: 38, fontWeight: 400, color: C.charcoal, margin: "0 0 28px", lineHeight: 1.1, letterSpacing: "-0.01em" }}>The Molecular Architecture</h2>
        {[
          "What makes tobacco compelling in perfumery is its ability to evoke specific memories. A tobacco note can transport the wearer to a grandfather's study, a Havana street, or an autumn evening by the fire.",
          "The challenge for modern perfumers lies in recreation without reproduction. Natural tobacco absolute carries regulatory restrictions. The art is in constructing an accord that feels authentic while being entirely synthetic.",
        ].map((txt, i) => (
          <p key={i} style={{ fontFamily: FONT.sans, fontSize: 16, lineHeight: 1.9, color: "rgba(44,44,44,0.8)", margin: "0 0 28px", fontWeight: 300 }}>{txt}</p>
        ))}
        <div style={{ marginTop: 80, paddingTop: 40, borderTop: `3px solid ${C.greyLight}` }}>
          <div style={{ fontFamily: FONT.sans, fontSize: 11, fontWeight: 500, color: C.grey, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 12 }}>Next</div>
          <span onClick={() => {}} style={{ fontFamily: FONT.serif, fontSize: 32, color: C.charcoal, cursor: "pointer", lineHeight: 1.1, letterSpacing: "-0.01em" }}>
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
  return (
    <footer id="section-footer" style={{
      padding: "64px 56px", background: C.charcoal,
      display: "flex", justifyContent: "space-between", alignItems: "flex-end",
    }}>
      <div>
        <span style={{ fontFamily: FONT.serif, fontSize: 24, fontWeight: 500, color: C.white, letterSpacing: "0.12em", textTransform: "uppercase" }}>Petals</span>
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
      cursor: "default",
    }}>
      <style>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        ::selection { background:${C.green}; color:${C.white}; }
        ::-webkit-scrollbar { width:6px; }
        ::-webkit-scrollbar-track { background:${C.cream}; }
        ::-webkit-scrollbar-thumb { background:${C.greyLight}; border-radius:3px; }
        ::-webkit-scrollbar-thumb:hover { background:${C.greyMed}; }
        img { -webkit-user-drag:none; user-select:none; }
        @import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>
      <Nav view={view} setView={(v) => { setView(v); setDetail(null); setSelectedIssue(null); }} scrollY={scrollY} scrollToSection={scrollToSection} />
      {view === "home" && <Home goDetail={goDetail} />}
      {view === "issues" && !selectedIssue && <IssuesPage onSelectIssue={(iss) => setSelectedIssue(iss)} />}
      {view === "issues" && selectedIssue && <IssueDetailView issue={selectedIssue} onBack={() => setSelectedIssue(null)} />}
      {view === "detail" && <Detail article={detail} onBack={() => { setView("home"); setDetail(null); }} />}
    </div>
  );
}

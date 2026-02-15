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
// NAV — Taller, bolder
// ═══════════════════════════════════════
function Nav({ view, setView, scrollY }) {
  const solid = scrollY > 60;
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 48px", height: 84,
      background: solid ? "rgba(245,240,235,0.96)" : "transparent",
      backdropFilter: solid ? "blur(28px)" : "none",
      borderBottom: solid ? `1.5px solid rgba(200,196,190,0.5)` : "1.5px solid transparent",
      transition: "all 0.5s ease",
    }}>
      <div onClick={() => setView("home")} style={{ cursor: "pointer" }}>
        <span style={{
          fontFamily: FONT.serif, fontSize: 28, fontWeight: 500,
          letterSpacing: "0.12em", textTransform: "uppercase",
          color: solid ? C.charcoal : C.white,
          transition: "color 0.5s",
        }}>Petals</span>
      </div>
      <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
        {[
          { k: "home", l: "Journal" },
          { k: "issues", l: "Archive" },
          { k: "pages", l: "Pages" },
        ].map(n => (
          <span key={n.k} onClick={() => setView(n.k)} style={{
            fontFamily: FONT.sans, fontSize: 12, fontWeight: view === n.k ? 500 : 400,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color: solid ? (view === n.k ? C.charcoal : C.grey) : (view === n.k ? C.white : "rgba(255,255,255,0.55)"),
            cursor: "pointer", transition: "color 0.4s",
          }}>{n.l}</span>
        ))}
        <a href="https://gulcicek.com" target="_blank" rel="noopener noreferrer" style={{
          fontFamily: FONT.sans, fontSize: 11, fontWeight: 400,
          color: solid ? C.greyMed : "rgba(255,255,255,0.35)",
          textDecoration: "none", letterSpacing: "0.06em", transition: "color 0.4s",
        }}>Gülçiçek ↗</a>
      </div>
    </nav>
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
// LATEST SECTION — i-d.co inspired magazine covers slider
// ═══════════════════════════════════════
function LatestMagazineSlider({ goDetail }) {
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
    if (el) el.scrollBy({ left: dir * 500, behavior: "smooth" });
  };

  // Magazine cover items — mix latest issues with articles
  const coverItems = ISSUES.slice(0, 12);

  return (
    <section style={{ padding: "120px 0 100px", position: "relative" }}>
      <div style={{ padding: "0 56px", marginBottom: 48 }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{
                fontFamily: FONT.sans, fontSize: 14, fontWeight: 600,
                letterSpacing: "0.35em", textTransform: "uppercase", color: C.green,
                padding: "14px 28px",
                border: `2.5px solid ${C.green}`,
                display: "inline-block", marginBottom: 24,
              }}>
                Latest
              </div>
              <div style={{ fontFamily: FONT.sans, fontSize: 14, color: C.grey, fontWeight: 300 }}>
                Explore the latest issues and stories
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => scroll(-1)} style={{
                width: 48, height: 48,
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
                width: 48, height: 48,
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
      </div>

      {/* Horizontal magazine covers slider */}
      <div ref={scrollRef} style={{
        display: "flex", gap: 28, overflowX: "auto", paddingLeft: 56, paddingRight: 56, paddingBottom: 32,
        scrollbarWidth: "none", msOverflowStyle: "none",
      }}>
        {coverItems.map((iss, i) => (
          <Reveal key={iss.num} delay={Math.min(i * 0.06, 0.4)}>
            <div style={{
              minWidth: 320, flex: "0 0 320px", cursor: "pointer",
              transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-8px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{
                position: "relative", overflow: "hidden",
                boxShadow: `0 8px 32px ${C.shadowMid}, 0 2px 8px ${C.shadow}`,
                transition: "box-shadow 0.5s ease",
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 16px 56px ${C.shadowDeep}, 0 4px 16px ${C.shadowMid}`}
                onMouseLeave={e => e.currentTarget.style.boxShadow = `0 8px 32px ${C.shadowMid}, 0 2px 8px ${C.shadow}`}>
                <img src={`https://images.unsplash.com/${iss.img}?w=640&h=860&fit=crop&q=85`} alt=""
                  style={{
                    width: "100%", aspectRatio: "3/4", objectFit: "cover", display: "block",
                    transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)",
                  }}
                  onMouseEnter={e => e.target.style.transform = "scale(1.04)"}
                  onMouseLeave={e => e.target.style.transform = "scale(1)"} />
                {/* Magazine overlay */}
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.5) 100%)",
                }} />
                <div style={{
                  position: "absolute", top: 20, left: 20,
                  fontFamily: FONT.serif, fontSize: 14, fontWeight: 500, color: C.white,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                }}>Petals</div>
                <div style={{
                  position: "absolute", bottom: 24, left: 24, right: 24,
                }}>
                  <div style={{
                    fontFamily: FONT.serif, fontSize: 28, color: C.white, fontWeight: 400,
                    lineHeight: 1.05, marginBottom: 8,
                    textShadow: "0 2px 12px rgba(0,0,0,0.4)",
                  }}>
                    No. {iss.num}
                  </div>
                  <div style={{
                    fontFamily: FONT.sans, fontSize: 12, color: "rgba(255,255,255,0.7)",
                    fontWeight: 400, letterSpacing: "0.08em",
                  }}>
                    {iss.season} {iss.year}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Fade edge */}
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
// HOME
// ═══════════════════════════════════════
function Home({ goDetail }) {
  return (
    <div style={{ background: C.cream }}>

      <HeroSlider goDetail={goDetail} />

      {/* ───── SECTION: Latest Magazine Covers ───── */}
      <LatestMagazineSlider goDetail={goDetail} />

      {/* ───── Featured Articles Grid — i-d.co style with right text ───── */}
      <section style={{ padding: "40px 56px 100px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 300px", gap: 32 }}>
          {/* Left: Main feature */}
          <Reveal>
            <div style={{ position: "relative", cursor: "pointer" }} onClick={() => goDetail(ARTICLES[0])}>
              <Img src={ARTICLES[0].img} h={580} style={{
                boxShadow: `0 12px 48px ${C.shadowMid}, 0 4px 12px ${C.shadow}`,
              }} />
              <div style={{
                position: "absolute", bottom: -36, right: -24,
                background: C.cream, padding: "32px 36px", maxWidth: 380,
                boxShadow: `0 12px 48px ${C.shadowDeep}, 0 4px 16px ${C.shadowMid}`,
                border: `1.5px solid rgba(200,196,190,0.3)`,
              }}>
                <div style={{ fontFamily: FONT.sans, fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: C.green, marginBottom: 12 }}>{ARTICLES[0].cat}</div>
                <h2 style={{ fontFamily: FONT.serif, fontSize: 38, fontWeight: 400, color: C.charcoal, margin: "0 0 10px", lineHeight: 1.05, letterSpacing: "-0.02em" }}>
                  {ARTICLES[0].t}
                </h2>
                <p style={{ fontFamily: FONT.sans, fontSize: 14, color: C.grey, margin: 0, lineHeight: 1.6, fontWeight: 300 }}>{ARTICLES[0].sub}</p>
              </div>
            </div>
          </Reveal>

          {/* Center: Secondary feature + stacked items */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <Reveal delay={0.1}>
              <div style={{ cursor: "pointer", position: "relative" }} onClick={() => goDetail(ARTICLES[1])}>
                <Img src={ARTICLES[1].img} h={300} style={{
                  boxShadow: `0 8px 32px ${C.shadowMid}`,
                }} />
                <div style={{ padding: "20px 0 0" }}>
                  <div style={{ fontFamily: FONT.sans, fontSize: 10, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: C.green, marginBottom: 8 }}>{ARTICLES[1].cat}</div>
                  <h3 style={{ fontFamily: FONT.serif, fontSize: 28, fontWeight: 400, color: C.charcoal, margin: 0, lineHeight: 1.1 }}>{ARTICLES[1].t}</h3>
                  <p style={{ fontFamily: FONT.sans, fontSize: 13, color: C.grey, margin: "8px 0 0", fontWeight: 300, lineHeight: 1.5 }}>{ARTICLES[1].sub}</p>
                </div>
              </div>
            </Reveal>
            {ARTICLES.slice(2, 4).map((a, i) => (
              <Reveal key={a.id} delay={0.2 + i * 0.1}>
                <div onClick={() => goDetail(a)} style={{
                  cursor: "pointer", padding: "20px 0",
                  borderTop: `2px solid ${C.greyLight}`,
                  display: "flex", gap: 20, alignItems: "flex-start",
                  transition: "background 0.3s ease",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(27,61,47,0.03)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <div style={{ width: 100, height: 100, flexShrink: 0, overflow: "hidden", boxShadow: `0 4px 16px ${C.shadow}` }}>
                    <img src={`https://images.unsplash.com/${a.img}?w=200&h=200&fit=crop`} alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.6s ease" }}
                      onMouseEnter={e => e.target.style.transform = "scale(1.08)"}
                      onMouseLeave={e => e.target.style.transform = "scale(1)"} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: FONT.sans, fontSize: 10, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: C.grey, marginBottom: 8 }}>{a.cat} · No.{a.issue}</div>
                    <h3 style={{ fontFamily: FONT.serif, fontSize: 22, fontWeight: 400, color: C.charcoal, margin: "0 0 6px", lineHeight: 1.15 }}>{a.t}</h3>
                    <p style={{ fontFamily: FONT.sans, fontSize: 12, color: C.grey, margin: 0, lineHeight: 1.5, fontWeight: 300 }}>{a.sub}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Right side — i-d.co inspired vertical text panel */}
          <Reveal delay={0.3}>
            <div style={{
              borderLeft: `3px solid ${C.green}`,
              paddingLeft: 28,
              display: "flex", flexDirection: "column", justifyContent: "flex-start",
              paddingTop: 8,
            }}>
              <div style={{
                fontFamily: FONT.sans, fontSize: 11, fontWeight: 600,
                letterSpacing: "0.3em", textTransform: "uppercase", color: C.green,
                marginBottom: 28,
              }}>
                Editor's Picks
              </div>
              {ARTICLES.slice(4, 8).map((a, i) => (
                <div key={a.id} onClick={() => goDetail(a)} style={{
                  cursor: "pointer", padding: "18px 0",
                  borderTop: i === 0 ? "none" : `1.5px solid rgba(200,196,190,0.5)`,
                  transition: "all 0.3s ease",
                }}
                  onMouseEnter={e => e.currentTarget.style.paddingLeft = "8px"}
                  onMouseLeave={e => e.currentTarget.style.paddingLeft = "0"}>
                  <div style={{ fontFamily: FONT.sans, fontSize: 9, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: C.greyMed, marginBottom: 6 }}>
                    {a.cat} · Issue {a.issue}
                  </div>
                  <h4 style={{ fontFamily: FONT.serif, fontSize: 20, fontWeight: 400, color: C.charcoal, margin: 0, lineHeight: 1.15 }}>
                    {a.t}
                  </h4>
                  <p style={{ fontFamily: FONT.sans, fontSize: 11, color: C.grey, margin: "6px 0 0", fontWeight: 300, lineHeight: 1.5 }}>
                    {a.sub}
                  </p>
                </div>
              ))}
              <div style={{
                marginTop: 24, fontFamily: FONT.sans, fontSize: 11, fontWeight: 500,
                letterSpacing: "0.15em", textTransform: "uppercase", color: C.green,
                cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8,
                transition: "gap 0.3s ease",
              }}
                onMouseEnter={e => e.currentTarget.style.gap = "14px"}
                onMouseLeave={e => e.currentTarget.style.gap = "8px"}>
                View All Stories <span style={{ fontSize: 14 }}>→</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───── FULL BLEED: Sustainability banner ───── */}
      <Reveal>
        <section onClick={() => goDetail(ARTICLES[3])} style={{
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

      {/* ───── SPACER between biodiversity and banner ───── */}
      <div style={{ height: 80, background: C.cream }} />

      {/* ───── NEW ISSUE BANNER — Separated, clean, bold ───── */}
      <Reveal>
        <section style={{
          margin: "0 56px", padding: "64px 48px",
          background: C.charcoal,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", position: "relative", overflow: "hidden",
        }}>
          {/* Subtle pattern overlay */}
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

      {/* ───── 3-article stagger with DEEP depth ───── */}
      <section style={{ padding: "40px 56px 120px" }}>
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

      {/* ───── 39 ISSUES: Full horizontal slider — BOLDER ───── */}
      <IssuesSlider />

      {/* ───── FROM THE ARCHIVE ───── */}
      <section style={{ padding: "100px 56px 120px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
        <div style={{ paddingRight: 60 }}>
          <Reveal>
            <div style={{
              fontFamily: FONT.sans, fontSize: 15, fontWeight: 600,
              letterSpacing: "0.3em", textTransform: "uppercase", color: C.green,
              marginBottom: 48, paddingBottom: 16,
              borderBottom: `3px solid ${C.green}`,
              display: "inline-block",
            }}>
              From the Archive
            </div>
          </Reveal>
          {ARTICLES.slice(7).map((a, i) => (
            <Reveal key={a.id} delay={i * 0.06}>
              <div onClick={() => goDetail(a)} style={{
                cursor: "pointer", padding: "28px 0",
                borderTop: `2px solid ${C.greyLight}`,
                display: "flex", gap: 20, alignItems: "baseline",
                transition: "all 0.3s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(27,61,47,0.03)"; e.currentTarget.style.paddingLeft = "12px"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.paddingLeft = "0"; }}>
                <span style={{ fontFamily: FONT.serif, fontSize: 16, color: C.greyLight, fontStyle: "italic", minWidth: 28, fontWeight: 400 }}>{String(i + 1).padStart(2, "0")}</span>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontFamily: FONT.serif, fontSize: 26, fontWeight: 400, color: C.charcoal, margin: "0 0 6px", lineHeight: 1.15, letterSpacing: "-0.01em" }}>{a.t}</h4>
                  <p style={{ fontFamily: FONT.sans, fontSize: 13, color: C.grey, margin: 0, fontWeight: 300 }}>{a.sub} · Issue {a.issue}</p>
                </div>
                <span style={{ fontFamily: FONT.sans, fontSize: 18, color: C.greyMed, transition: "all 0.3s ease", fontWeight: 400 }}>→</span>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div style={{ position: "sticky", top: 100 }}>
            <Img src={ARTICLES[7].img} h={720} style={{
              boxShadow: `0 16px 64px ${C.shadowDeep}, 0 4px 16px ${C.shadowMid}`,
            }} />
            <div style={{ marginTop: 18 }}>
              <span style={{ fontFamily: FONT.sans, fontSize: 12, color: C.grey, letterSpacing: "0.1em", fontWeight: 400 }}>Nabil Achour photographed in Paris, 2024</span>
            </div>
          </div>
        </Reveal>
      </section>

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
              fontFamily: FONT.serif, fontSize: "clamp(48px, 5vw, 76px)", fontWeight: 400,
              color: C.charcoal, lineHeight: 1, letterSpacing: "-0.02em",
            }}>
              39 Issues
            </div>
            <div style={{ fontFamily: FONT.sans, fontSize: 14, color: C.grey, marginTop: 14, fontWeight: 400, letterSpacing: "0.02em" }}>
              2010 – 2025 · Swipe to explore the archive
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
// ISSUES ARCHIVE PAGE
// ═══════════════════════════════════════
function IssuesPage() {
  return (
    <div style={{ background: C.cream, minHeight: "100vh", paddingTop: 120 }}>
      <div style={{ padding: "0 56px 64px" }}>
        <Reveal>
          <h1 style={{ fontFamily: FONT.serif, fontSize: "clamp(56px, 8vw, 100px)", fontWeight: 400, color: C.charcoal, margin: "0 0 8px", lineHeight: 0.95, letterSpacing: "-0.03em" }}>Archive</h1>
          <p style={{ fontFamily: FONT.sans, fontSize: 15, color: C.grey, margin: 0, fontWeight: 300 }}>39 issues · 2010 – 2025 · Every story preserved.</p>
        </Reveal>
      </div>
      <div style={{ padding: "0 56px 120px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 24 }}>
        {ISSUES.map((iss, i) => (
          <Reveal key={iss.num} delay={Math.min(i * 0.03, 0.5)}>
            <div style={{
              cursor: "pointer",
              transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
            }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-8px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{
                position: "relative", overflow: "hidden",
                boxShadow: `0 6px 24px ${C.shadowMid}, 0 2px 8px ${C.shadow}`,
                transition: "box-shadow 0.5s ease",
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 16px 48px ${C.shadowDeep}, 0 4px 16px ${C.shadowMid}`}
                onMouseLeave={e => e.currentTarget.style.boxShadow = `0 6px 24px ${C.shadowMid}, 0 2px 8px ${C.shadow}`}>
                <img src={`https://images.unsplash.com/${iss.img}?w=400&h=560&fit=crop`} alt=""
                  style={{ width: "100%", aspectRatio: "5/7", objectFit: "cover", display: "block", transition: "transform 0.7s ease" }}
                  onMouseEnter={e => e.target.style.transform = "scale(1.04)"}
                  onMouseLeave={e => e.target.style.transform = "scale(1)"} />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.35) 100%)",
                }} />
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: FONT.serif, fontSize: 56, color: "rgba(255,255,255,0.12)", fontWeight: 400 }}>{iss.num}</span>
                </div>
              </div>
              <div style={{ marginTop: 14 }}>
                <div style={{ fontFamily: FONT.sans, fontSize: 13, color: C.charcoal, fontWeight: 500 }}>No. {iss.num}</div>
                <span style={{ fontFamily: FONT.sans, fontSize: 11, color: C.grey, fontWeight: 400 }}>{iss.season} {iss.year}</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <Footer />
    </div>
  );
}

// ═══════════════════════════════════════
// PAGES VIEW
// ═══════════════════════════════════════
function PagesView() {
  const [sel, setSel] = useState(null);
  const imgs = ["photo-1615634260167-c8cdede054de","photo-1541643600914-78b084683601","photo-1588405748880-12d1d2a59f75","photo-1595425964272-fc617fa19dfa","photo-1547887538-e3a2f32cb1cc","photo-1563170351-be82bc888aa4","photo-1559825481-12a05cc00344","photo-1501443762994-82bd5dace89a","photo-1524231757912-21f4fe3a7200","photo-1441974231531-c6227db76b6e","photo-1518770660439-4636190af475","photo-1416879595882-3373a0480b5b"];
  return (
    <div style={{ background: C.cream, minHeight: "100vh", paddingTop: 120 }}>
      <div style={{ padding: "0 56px 48px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Reveal>
          <h1 style={{ fontFamily: FONT.serif, fontSize: "clamp(56px, 8vw, 100px)", fontWeight: 400, color: C.charcoal, margin: "0 0 8px", lineHeight: 0.95, letterSpacing: "-0.03em" }}>Pages</h1>
          <p style={{ fontFamily: FONT.sans, fontSize: 15, color: C.grey, margin: 0, fontWeight: 300 }}>Issue 39 · 84 pages · Click to enlarge</p>
        </Reveal>
        <select style={{ fontFamily: FONT.sans, fontSize: 12, fontWeight: 500, background: "transparent", color: C.charcoal, border: `2px solid ${C.greyLight}`, padding: "12px 20px", cursor: "pointer" }}>
          {[39,38,37,36,35].map(n=><option key={n}>Issue {n}</option>)}
        </select>
      </div>
      <div style={{ padding: "0 56px 120px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 18 }}>
        {Array.from({length:24},(_,i)=>(
          <Reveal key={i} delay={Math.min(i*0.03,0.4)}>
            <div onClick={()=>setSel(i===sel?null:i)} style={{ cursor: "pointer", overflow: "hidden" }}>
              <div style={{
                boxShadow: `0 4px 20px ${C.shadowMid}`,
                overflow: "hidden",
                transition: "box-shadow 0.4s ease, transform 0.4s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 12px 40px ${C.shadowDeep}`; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 4px 20px ${C.shadowMid}`; e.currentTarget.style.transform = "translateY(0)"; }}>
                <img src={`https://images.unsplash.com/${imgs[i%12]}?w=320&h=448&fit=crop`} alt=""
                  style={{ width: "100%", aspectRatio: "5/7", objectFit: "cover", display: "block", transition: "transform 0.5s" }}
                  onMouseEnter={e=>e.target.style.transform="scale(1.03)"}
                  onMouseLeave={e=>e.target.style.transform="scale(1)"} />
              </div>
              <div style={{ fontFamily: FONT.sans, fontSize: 11, color: C.grey, marginTop: 10, letterSpacing: "0.05em", fontWeight: 500 }}>{String(i+1).padStart(2,"0")}</div>
            </div>
          </Reveal>
        ))}
      </div>
      {sel !== null && (
        <div onClick={() => setSel(null)} style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(26,26,26,0.95)", display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "zoom-out",
        }}>
          <img src={`https://images.unsplash.com/${imgs[sel%12]}?w=900&h=1260&fit=crop&q=90`} alt=""
            style={{ maxHeight: "92vh", maxWidth: "90vw", objectFit: "contain" }} />
          <div style={{ position: "absolute", bottom: 28, fontFamily: FONT.sans, fontSize: 13, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", fontWeight: 400 }}>
            Page {sel + 1} / 84
          </div>
          <div onClick={() => setSel(null)} style={{
            position: "absolute", top: 24, right: 32, fontFamily: FONT.sans, fontSize: 18, color: "rgba(255,255,255,0.4)", cursor: "pointer",
          }}>✕</div>
        </div>
      )}
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
    <footer style={{
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
  const ref = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const h = () => setScrollY(el.scrollTop);
    el.addEventListener("scroll", h, { passive: true });
    return () => el.removeEventListener("scroll", h);
  }, []);

  useEffect(() => { if (ref.current) ref.current.scrollTop = 0; }, [view, detail]);

  const goDetail = (a) => { setDetail(a); setView("detail"); };

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
      <Nav view={view} setView={(v) => { setView(v); setDetail(null); }} scrollY={scrollY} />
      {view === "home" && <Home goDetail={goDetail} />}
      {view === "issues" && <IssuesPage />}
      {view === "pages" && <PagesView />}
      {view === "detail" && <Detail article={detail} onBack={() => { setView("home"); setDetail(null); }} />}
    </div>
  );
}

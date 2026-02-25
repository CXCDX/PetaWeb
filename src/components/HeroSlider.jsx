import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { C, FONT } from "../constants";
import { useMedia } from "../hooks/useMedia";
import { HERO_SLIDES } from "../data/articles";
import ArrowBtn from "./ArrowBtn";

export default function HeroSlider() {
  const { mob } = useMedia();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [entered, setEntered] = useState(false);
  const [textVisible, setTextVisible] = useState(true);
  const touchRef = useRef({ startX: 0 });
  const autoRef = useRef(null);

  useEffect(() => { setTimeout(() => setEntered(true), 150); }, []);

  const startAuto = useCallback(() => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setTextVisible(false);
      setTimeout(() => {
        setCurrent(p => (p + 1) % HERO_SLIDES.length);
        setTextVisible(true);
      }, 400);
    }, 6000);
  }, []);

  useEffect(() => {
    startAuto();
    return () => clearInterval(autoRef.current);
  }, [startAuto]);

  const go = (dir) => {
    clearInterval(autoRef.current);
    setTextVisible(false);
    setTimeout(() => {
      setCurrent(p => (p + dir + HERO_SLIDES.length) % HERO_SLIDES.length);
      setTextVisible(true);
    }, 400);
    startAuto();
  };

  const goToSlide = (i) => {
    clearInterval(autoRef.current);
    setTextVisible(false);
    setTimeout(() => { setCurrent(i); setTextVisible(true); }, 400);
    startAuto();
  };

  const slide = HERO_SLIDES[current];
  const panelW = mob ? 0 : 380;

  return (
    <section
      aria-label="Featured articles"
      aria-roledescription="carousel"
      style={{ height: "100svh", minHeight: 500, display: "flex", position: "relative", overflow: "hidden" }}
      onTouchStart={e => { touchRef.current.startX = e.touches[0].clientX; }}
      onTouchEnd={e => {
        const diff = e.changedTouches[0].clientX - touchRef.current.startX;
        if (Math.abs(diff) > 50) go(diff > 0 ? -1 : 1);
      }}
    >
      {/* Image area */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`Read article: ${slide.t}`}
        onClick={() => navigate(`/article/${slide.id}`)}
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigate(`/article/${slide.id}`); } }}
        style={{ flex: 1, position: "relative", overflow: "hidden", cursor: "pointer" }}
      >
        {HERO_SLIDES.map((s, i) => (
          <div key={s.id} aria-hidden={i !== current} style={{
            position: "absolute", inset: 0,
            opacity: i === current ? 1 : 0,
            transition: "opacity 1.4s cubic-bezier(0.4,0,0.2,1)",
            zIndex: i === current ? 1 : 0,
          }}>
            <img
              src={`https://images.unsplash.com/${s.img}?w=${mob ? 800 : 1600}&h=1200&fit=crop&q=${mob ? 75 : 90}`}
              alt={`${s.t} — ${s.sub}`}
              loading={i === 0 ? "eager" : "lazy"}
              style={{
                width: "100%", height: "100%", objectFit: "cover",
                transform: i === current ? "scale(1.05)" : "scale(1)",
                transition: "transform 8s cubic-bezier(0.25,0.1,0.25,1)",
              }}
            />
          </div>
        ))}
        {mob && <div style={{ position: "absolute", inset: 0, zIndex: 2,
          background: "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 30%, rgba(0,0,0,0.75) 100%)",
        }} />}
        {mob && (
          <div style={{
            position: "absolute", bottom: 32, left: 20, right: 20, zIndex: 10,
            opacity: entered ? 1 : 0, transform: entered ? "translateY(0)" : "translateY(40px)",
            transition: "all 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s",
          }}>
            <div style={{ fontFamily: FONT.sans, fontSize: 10, fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 10,
              opacity: textVisible ? 1 : 0, transition: "opacity 0.4s ease",
            }}>
              Issue {slide.issue} · {slide.cat}
            </div>
            <h1 style={{ fontFamily: FONT.serif, fontWeight: 400, fontStyle: "italic", fontSize: "clamp(36px, 12vw, 64px)", lineHeight: 0.9, color: C.white, margin: 0, letterSpacing: "-0.03em",
              opacity: textVisible ? 1 : 0, transform: textVisible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)",
            }}>
              {slide.t}
            </h1>
          </div>
        )}
        {mob && (
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, zIndex: 10, display: "flex", justifyContent: "space-between", padding: "0 12px", transform: "translateY(-50%)" }}
            onClick={e => e.stopPropagation()}>
            <ArrowBtn dir="left" onClick={() => go(-1)} light size={40} label="Previous slide" />
            <ArrowBtn dir="right" onClick={() => go(1)} light size={40} label="Next slide" />
          </div>
        )}
      </div>

      {/* Side text panel — desktop */}
      {!mob && (
        <div style={{
          width: panelW, background: C.green, display: "flex", flexDirection: "column",
          justifyContent: "space-between", padding: "100px 40px 48px",
          position: "relative", flexShrink: 0,
        }}>
          <div style={{
            opacity: entered ? 1 : 0, transform: entered ? "translateY(0)" : "translateY(30px)",
            transition: "all 1.2s cubic-bezier(0.16,1,0.3,1) 0.4s",
          }}>
            <div style={{ fontFamily: FONT.sans, fontSize: 10, fontWeight: 600, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 24,
              opacity: textVisible ? 1 : 0, transition: "opacity 0.4s ease",
            }}>
              Issue {slide.issue} · {slide.cat}
            </div>
            <h1 style={{
              fontFamily: FONT.serif, fontWeight: 400, fontStyle: "italic",
              fontSize: "clamp(48px, 5vw, 72px)", lineHeight: 0.9, letterSpacing: "-0.03em",
              color: C.white, margin: 0,
              opacity: textVisible ? 1 : 0, transform: textVisible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.5s cubic-bezier(0.16,1,0.3,1), transform 0.5s cubic-bezier(0.16,1,0.3,1)",
            }}>
              {slide.t}
            </h1>
            <p style={{ fontFamily: FONT.sans, fontSize: 14, color: "rgba(255,255,255,0.45)", marginTop: 20, lineHeight: 1.7, fontWeight: 300,
              opacity: textVisible ? 1 : 0, transition: "opacity 0.5s ease 0.1s",
            }}>
              {slide.desc}
            </p>
          </div>
          <div>
            <div role="tablist" aria-label="Slide indicators" style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              {HERO_SLIDES.map((_, i) => (
                <button key={i} role="tab" aria-selected={i === current} aria-label={`Slide ${i + 1}`}
                  onClick={() => goToSlide(i)}
                  style={{
                    width: i === current ? 32 : 8, height: 8, borderRadius: 4,
                    background: i === current ? C.white : "rgba(255,255,255,0.2)",
                    cursor: "pointer", transition: "all 0.4s ease",
                    border: "none", padding: 0,
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <ArrowBtn dir="left" onClick={() => go(-1)} light size={44} label="Previous slide" />
              <ArrowBtn dir="right" onClick={() => go(1)} light size={44} label="Next slide" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

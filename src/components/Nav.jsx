import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { C, FONT } from "../constants";
import { useMedia } from "../hooks/useMedia";
import { HomeIcon, SearchIcon } from "./Icons";

export default function Nav({ scrollY }) {
  const { mob } = useMedia();
  const navigate = useNavigate();
  const location = useLocation();
  const solid = scrollY > 60;
  const [menuOpen, setMenuOpen] = useState(false);
  const pad = mob ? 16 : 48;
  const navH = mob ? 64 : 84;

  const menuItems = [
    { l: "Latest Issue", action: () => { navigate("/"); setMenuOpen(false); } },
    { l: "Issues", action: () => { navigate("/issues"); setMenuOpen(false); } },
    { l: "Editor's Picks", action: () => { navigate("/"); setMenuOpen(false); setTimeout(() => { const el = document.getElementById("section-editorpicks"); if (el) el.scrollIntoView({ behavior: "smooth" }); }, 100); } },
    { l: "Sustainability", action: () => { navigate("/"); setMenuOpen(false); setTimeout(() => { const el = document.getElementById("section-sustainability"); if (el) el.scrollIntoView({ behavior: "smooth" }); }, 100); } },
    { l: "Do Not Miss", action: () => { navigate("/"); setMenuOpen(false); setTimeout(() => { const el = document.getElementById("section-donotmiss"); if (el) el.scrollIntoView({ behavior: "smooth" }); }, 100); } },
    { l: "Contact", action: () => { navigate("/contact"); setMenuOpen(false); } },
  ];

  return (
    <>
      <nav aria-label="Main navigation" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: `0 ${pad}px`, height: navH,
        background: solid ? "rgba(245,240,235,0.96)" : "transparent",
        backdropFilter: solid ? "blur(28px)" : "none",
        WebkitBackdropFilter: solid ? "blur(28px)" : "none",
        borderBottom: solid ? "1.5px solid rgba(200,196,190,0.5)" : "1.5px solid transparent",
        transition: "all 0.5s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: mob ? 10 : 16 }}>
          <button aria-label="Search" style={{
            cursor: "pointer", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
            background: "none", border: "none", padding: 0,
          }}>
            <SearchIcon color={solid ? C.charcoal : C.white} size={mob ? 16 : 18} />
          </button>
          <button onClick={() => navigate("/")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: mob ? 6 : 10, background: "none", border: "none", padding: 0 }}>
            <span style={{
              fontFamily: FONT.serif, fontSize: mob ? 20 : 28, fontWeight: 500,
              letterSpacing: "0.12em", textTransform: "uppercase",
              color: solid ? C.charcoal : C.white, transition: "color 0.5s",
            }}>Petals</span>
            <HomeIcon color={solid ? C.greyMed : "rgba(255,255,255,0.4)"} size={mob ? 12 : 14} />
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: mob ? 12 : 20 }}>
          <a href="https://gulcicek.com" target="_blank" rel="noopener noreferrer" style={{
            fontFamily: FONT.serif, fontSize: mob ? 14 : 20, fontWeight: 500,
            letterSpacing: "0.06em",
            color: solid ? C.charcoal : C.white,
            textDecoration: "none", transition: "color 0.5s",
          }}>MG Gülçiçek</a>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            style={{
              cursor: "pointer", width: 44, height: 44,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
              position: "relative", zIndex: 1002, background: "none", border: "none", padding: 0,
            }}
          >
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
          </button>
        </div>
      </nav>

      {/* Fullscreen menu overlay */}
      {menuOpen && (
        <div
          role="dialog"
          aria-label="Navigation menu"
          style={{
            position: "fixed", inset: 0, zIndex: 998,
            background: "rgba(15,42,30,0.50)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflowY: "auto", WebkitOverflowScrolling: "touch",
          }}
          onClick={() => setMenuOpen(false)}
        >
          <div style={{ textAlign: "center", padding: mob ? "80px 24px 40px" : "0" }} onClick={e => e.stopPropagation()}>
            {menuItems.map((item, i) => (
              <button key={i}
                onClick={item.action}
                style={{
                  display: "block", width: "100%", background: "none", border: "none",
                  fontFamily: FONT.serif, fontSize: mob ? 28 : "clamp(32px, 5vw, 56px)", fontWeight: 400,
                  color: C.white, cursor: "pointer",
                  padding: mob ? "14px 0" : "16px 0", lineHeight: 1.3,
                  transform: "translateY(0)",
                  transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.06}s`,
                }}>
                {item.l}
              </button>
            ))}
            <div style={{ marginTop: 36 }}>
              <a href="https://gulcicek.com" target="_blank" rel="noopener noreferrer" style={{
                fontFamily: FONT.sans, fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "none", letterSpacing: "0.1em",
              }}>gulcicek.com ↗</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

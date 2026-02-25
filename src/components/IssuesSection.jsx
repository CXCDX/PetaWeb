import { useNavigate } from "react-router-dom";
import { C, FONT } from "../constants";
import { useMedia } from "../hooks/useMedia";
import { ISSUES } from "../data/articles";
import Reveal from "./Reveal";

export default function IssuesSection() {
  const { mob } = useMedia();
  const navigate = useNavigate();
  const pad = mob ? 20 : 56;
  const featured = ISSUES.slice(0, 8);

  return (
    <section aria-label="Issues archive preview" style={{ padding: mob ? `56px ${pad}px` : `100px ${pad}px`, borderTop: `3px solid ${C.greyLight}`, position: "relative" }}>
      <Reveal>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: mob ? 32 : 56 }}>
          <div>
            <h2 style={{ fontFamily: FONT.sans, fontSize: mob ? 12 : 14, fontWeight: 600, letterSpacing: "0.35em", textTransform: "uppercase", color: C.green, marginBottom: mob ? 10 : 16, paddingBottom: 12, borderBottom: `3px solid ${C.green}`, display: "inline-block" }}>Issues</h2>
            <div style={{ fontFamily: FONT.serif, fontSize: mob ? 32 : "clamp(48px, 5vw, 76px)", fontWeight: 400, color: C.charcoal, lineHeight: 1, letterSpacing: "-0.02em" }}>The Archive</div>
            <div style={{ fontFamily: FONT.sans, fontSize: mob ? 12 : 14, color: C.grey, marginTop: mob ? 8 : 14, fontWeight: 400 }}>39 issues · 2010 – 2025</div>
          </div>
          <button onClick={() => navigate("/issues")} style={{
            fontFamily: FONT.sans, fontSize: 11, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase",
            color: C.green, cursor: "pointer", padding: "12px 28px", border: `2px solid ${C.green}`, borderRadius: 24,
            background: "none", transition: "all 0.3s ease",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = C.green; e.currentTarget.style.color = C.white; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.green; }}>
            View All →
          </button>
        </div>
      </Reveal>

      <div style={{
        display: "grid",
        gridTemplateColumns: mob ? "1fr 1fr" : "repeat(4, 1fr)",
        gridAutoRows: mob ? 180 : 200,
        gap: mob ? 12 : 20,
      }}>
        {featured.map((iss, i) => {
          const spans = mob
            ? [{ c: "span 2", r: "span 2" }, { c: "span 1", r: "span 1" }, { c: "span 1", r: "span 1" }, { c: "span 1", r: "span 2" }, { c: "span 1", r: "span 1" }, { c: "span 2", r: "span 1" }, { c: "span 1", r: "span 1" }, { c: "span 1", r: "span 1" }]
            : [{ c: "span 2", r: "span 2" }, { c: "span 1", r: "span 2" }, { c: "span 1", r: "span 1" }, { c: "span 1", r: "span 1" }, { c: "span 1", r: "span 1" }, { c: "span 1", r: "span 1" }, { c: "span 2", r: "span 1" }, { c: "span 1", r: "span 1" }];
          const s = spans[i] || { c: "span 1", r: "span 1" };
          return (
            <Reveal key={iss.num} delay={i * 0.06} style={{ gridColumn: s.c, gridRow: s.r }}>
              <article onClick={() => navigate(`/issues/${iss.num}`)} style={{
                position: "relative", overflow: "hidden", height: "100%", cursor: "pointer",
                borderRadius: mob ? 8 : 0, boxShadow: `0 8px 32px ${C.shadowMid}`,
                transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 20px 56px ${C.shadowDeep}`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 8px 32px ${C.shadowMid}`; }}>
                <img src={`https://images.unsplash.com/${iss.img}?w=800&h=800&fit=crop`} alt={`Issue ${iss.num} — ${iss.season} ${iss.year}`} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.8s cubic-bezier(0.16,1,0.3,1)" }}
                  onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.target.style.transform = "scale(1)"} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.5) 100%)" }} />
                <div style={{ position: "absolute", bottom: mob ? 14 : 20, left: mob ? 14 : 20, right: mob ? 14 : 20 }}>
                  <div style={{ fontFamily: FONT.serif, fontSize: i === 0 ? (mob ? 40 : 64) : (mob ? 28 : 40), color: C.white, fontWeight: 400, lineHeight: 1 }}>{iss.num}</div>
                  <div style={{ fontFamily: FONT.sans, fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>{iss.season} {iss.year}</div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

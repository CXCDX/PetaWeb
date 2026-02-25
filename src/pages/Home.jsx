import { useNavigate } from "react-router-dom";
import { C, FONT } from "../constants";
import { useMedia } from "../hooks/useMedia";
import { ARTICLES } from "../data/articles";
import HeroSlider from "../components/HeroSlider";
import LatestSection from "../components/LatestSection";
import IssuesSection from "../components/IssuesSection";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import Img from "../components/Img";

export default function Home() {
  const { mob, tab } = useMedia();
  const navigate = useNavigate();
  const pad = mob ? 20 : 56;

  return (
    <div style={{ background: C.cream }}>
      <HeroSlider />

      {/* NOW AVAILABLE */}
      <div style={{ padding: mob ? "28px 20px" : "40px 80px" }}>
        <Reveal>
          <div
            role="button"
            tabIndex={0}
            onClick={() => navigate("/issues")}
            onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); navigate("/issues"); } }}
            style={{
              position: "relative", cursor: "pointer",
              border: `2px solid ${C.gold}`, borderRadius: mob ? 8 : 0,
              padding: mob ? "32px 24px" : "48px 56px", textAlign: "center",
              background: C.cream, transition: "box-shadow 0.4s ease, transform 0.4s ease",
              boxShadow: `0 8px 40px ${C.shadow}`,
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 16px 56px ${C.shadowDeep}`; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 8px 40px ${C.shadow}`; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ display: "inline-block", padding: "5px 14px", marginBottom: mob ? 16 : 20, border: `1px solid ${C.gold}`, color: C.gold, fontFamily: FONT.sans, fontSize: 9, fontWeight: 600, letterSpacing: "0.35em", textTransform: "uppercase" }}>
              Now Available
            </div>
            <h2 style={{ fontFamily: FONT.serif, fontSize: mob ? 28 : "clamp(36px, 4vw, 56px)", fontWeight: 400, color: C.charcoal, margin: 0, lineHeight: 1.05 }}>
              Petals <span style={{ fontStyle: "italic", color: C.gold }}>Issue 39</span>
            </h2>
            <p style={{ fontFamily: FONT.sans, fontSize: mob ? 12 : 14, color: C.grey, marginTop: mob ? 10 : 14, fontWeight: 300 }}>
              Winter 2025 · 84 Pages · 12 Stories
            </p>
            <span style={{ marginTop: mob ? 20 : 28, display: "inline-block", fontFamily: FONT.sans, fontSize: mob ? 10 : 11, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: C.green, padding: "12px 32px", border: `2px solid ${C.green}`, borderRadius: 24 }}>
              Read This Issue →
            </span>
          </div>
        </Reveal>
      </div>

      <LatestSection />

      {/* EDITOR'S PICKS */}
      <section id="section-editorpicks" style={{ padding: mob ? `56px ${pad}px 72px` : `100px ${pad}px 120px` }}>
        <Reveal>
          <div style={{ marginBottom: mob ? 32 : 56 }}>
            <h2 style={{ fontFamily: FONT.sans, fontSize: mob ? 12 : 14, fontWeight: 600, letterSpacing: "0.35em", textTransform: "uppercase", color: C.green, marginBottom: 16, paddingBottom: 16, borderBottom: `3px solid ${C.green}`, display: "inline-block" }}>Editor's Picks</h2>
            <div style={{ fontFamily: FONT.sans, fontSize: mob ? 12 : 14, color: C.grey, fontWeight: 300, marginTop: 8 }}>Curated by the editors · Issue 39</div>
          </div>
        </Reveal>
        {mob ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {ARTICLES.slice(0, 6).map((a, i) => (
              <Reveal key={a.id} delay={i * 0.06}>
                <article onClick={() => navigate(`/article/${a.id}`)} style={{ position: "relative", overflow: "hidden", height: i === 0 ? 320 : 220, cursor: "pointer", borderRadius: 8, boxShadow: `0 6px 24px ${C.shadowMid}` }}>
                  <img src={`https://images.unsplash.com/${a.img}?w=800&h=${i === 0 ? 640 : 440}&fit=crop&q=80`} alt={`${a.t} — ${a.sub}`} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.7) 100%)" }} />
                  <div style={{ position: "absolute", top: 14, left: 16 }}><span style={{ fontFamily: FONT.sans, fontSize: 9, fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>{a.cat}</span></div>
                  <div style={{ position: "absolute", bottom: 18, left: 18, right: 18 }}>
                    <span style={{ fontFamily: FONT.serif, fontSize: 12, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>{String(i + 1).padStart(2, "0")}</span>
                    <h3 style={{ fontFamily: FONT.serif, fontSize: i === 0 ? 26 : 20, fontWeight: 400, color: C.white, margin: "4px 0 2px", lineHeight: 1.1 }}>{a.t}</h3>
                    <p style={{ fontFamily: FONT.sans, fontSize: 11, color: "rgba(255,255,255,0.5)", margin: 0, fontWeight: 300 }}>{a.sub}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: tab ? "1fr 1fr" : "1.4fr 1fr 1fr", gridTemplateRows: tab ? "auto" : "380px 380px", gap: 20 }}>
            {ARTICLES.slice(0, 6).map((a, i) => {
              const gridPos = tab ? {} : [
                { gridColumn: "1 / 2", gridRow: "1 / 3" }, { gridColumn: "2 / 3", gridRow: "1 / 2" },
                { gridColumn: "3 / 4", gridRow: "1 / 2" }, { gridColumn: "2 / 3", gridRow: "2 / 3" },
                { gridColumn: "3 / 4", gridRow: "2 / 3" }, null,
              ][i];
              const isTall = i === 0 && !tab;
              if (i === 5 && !tab) return (
                <Reveal key={a.id} delay={i * 0.08} style={{ gridColumn: "1 / 4", marginTop: 12 }}>
                  <article onClick={() => navigate(`/article/${a.id}`)} style={{ position: "relative", overflow: "hidden", height: 220, cursor: "pointer", boxShadow: `0 8px 32px ${C.shadowMid}` }}>
                    <img src={`https://images.unsplash.com/${a.img}?w=1600&h=500&fit=crop&q=85`} alt={`${a.t} — ${a.sub}`} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)" }} />
                    <div style={{ position: "absolute", bottom: 28, left: 36, right: 36 }}>
                      <span style={{ fontFamily: FONT.sans, fontSize: 9, fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>{a.cat}</span>
                      <h3 style={{ fontFamily: FONT.serif, fontSize: 30, fontWeight: 400, color: C.white, margin: "8px 0 6px", lineHeight: 1.05 }}>{a.t}</h3>
                      <p style={{ fontFamily: FONT.sans, fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0, fontWeight: 300 }}>{a.sub}</p>
                    </div>
                  </article>
                </Reveal>
              );
              if (!gridPos && !tab) return null;
              return (
                <Reveal key={a.id} delay={i * 0.08} style={gridPos}>
                  <article onClick={() => navigate(`/article/${a.id}`)} style={{ position: "relative", overflow: "hidden", height: tab ? 280 : "100%", cursor: "pointer", boxShadow: `0 8px 32px ${C.shadowMid}` }}>
                    <img src={`https://images.unsplash.com/${a.img}?w=${isTall ? 1000 : 800}&h=${isTall ? 1400 : 800}&fit=crop&q=85`} alt={`${a.t} — ${a.sub}`} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", inset: 0, background: isTall ? "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.75) 100%)" : "linear-gradient(180deg, transparent 20%, rgba(0,0,0,0.7) 100%)" }} />
                    <div style={{ position: "absolute", top: 20, left: 22 }}><span style={{ fontFamily: FONT.sans, fontSize: 9, fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>{a.cat}</span></div>
                    <div style={{ position: "absolute", bottom: isTall ? 36 : 22, left: isTall ? 32 : 22, right: isTall ? 32 : 22 }}>
                      <span style={{ fontFamily: FONT.serif, fontSize: isTall ? 18 : 14, color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>{String(i + 1).padStart(2, "0")}</span>
                      <h3 style={{ fontFamily: FONT.serif, fontSize: isTall ? 36 : 22, fontWeight: 400, color: C.white, margin: "8px 0 6px", lineHeight: 1.08 }}>{a.t}</h3>
                      <p style={{ fontFamily: FONT.sans, fontSize: isTall ? 14 : 12, color: "rgba(255,255,255,0.5)", margin: 0, fontWeight: 300, lineHeight: 1.4 }}>{a.sub}</p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </section>

      {/* SUSTAINABILITY */}
      <Reveal>
        <section id="section-sustainability" style={{ position: "relative", height: mob ? "50vh" : "64vh", minHeight: mob ? 320 : 400, overflow: "hidden", cursor: "pointer" }}
          onClick={() => navigate(`/article/${ARTICLES[3].id}`)}>
          <img src={`https://images.unsplash.com/${ARTICLES[3].img}?w=${mob ? 800 : 2000}&h=1000&fit=crop&q=80`} alt="Biodiversity in the Bottle" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: mob ? "linear-gradient(180deg, rgba(15,42,30,0.4) 0%, rgba(15,42,30,0.92) 100%)" : "linear-gradient(90deg, rgba(15,42,30,0.92) 0%, rgba(15,42,30,0.4) 55%, transparent 100%)" }} />
          <div style={{ position: "absolute", ...(mob ? { bottom: pad, left: pad, right: pad } : { top: "50%", left: pad, transform: "translateY(-50%)" }), zIndex: 2, maxWidth: mob ? "none" : 560 }}>
            <div style={{ fontFamily: FONT.sans, fontSize: mob ? 10 : 12, fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: mob ? 12 : 24 }}>Sustainability · Issue 39</div>
            <h2 style={{ fontFamily: FONT.serif, fontSize: mob ? 32 : "clamp(48px, 5.5vw, 72px)", fontWeight: 400, color: C.white, margin: "0 0 12px", lineHeight: 0.95 }}>Biodiversity<br />in the Bottle</h2>
            {!mob && <p style={{ fontFamily: FONT.sans, fontSize: 15, color: "rgba(255,255,255,0.55)", margin: 0, lineHeight: 1.7, fontWeight: 300, maxWidth: 420 }}>{ARTICLES[3].desc}</p>}
            <div style={{ marginTop: mob ? 16 : 36, width: 56, height: 3, background: "rgba(255,255,255,0.4)" }} />
          </div>
        </section>
      </Reveal>

      <div style={{ height: mob ? 40 : 80, background: C.cream }} />

      {/* DO NOT MISS */}
      <section id="section-donotmiss" style={{ padding: mob ? `24px ${pad}px 72px` : `40px ${pad}px 120px` }}>
        <Reveal>
          <h2 style={{ fontFamily: FONT.sans, fontSize: mob ? 12 : 14, fontWeight: 600, letterSpacing: "0.35em", textTransform: "uppercase", color: C.green, marginBottom: mob ? 28 : 48, paddingBottom: 16, borderBottom: `3px solid ${C.green}`, display: "inline-block" }}>Do Not Miss</h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "1fr 1fr 1fr", gap: mob ? 20 : 36 }}>
          {ARTICLES.slice(5, 8).map((a, i) => (
            <Reveal key={a.id} delay={i * 0.12}>
              <article onClick={() => navigate(`/article/${a.id}`)} style={{ cursor: "pointer", marginTop: !mob && i === 1 ? 72 : 0, background: C.cream, borderRadius: mob ? 8 : 0, overflow: "hidden", boxShadow: `0 8px 32px ${C.shadowMid}, 0 2px 8px ${C.shadow}` }}>
                <Img src={a.img} h={mob ? 240 : (i === 1 ? 480 : 400)} alt={`${a.t} — ${a.sub}`} />
                <div style={{ padding: mob ? "20px 20px 24px" : "28px 28px 32px" }}>
                  <div style={{ fontFamily: FONT.sans, fontSize: 11, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: C.green, marginBottom: 12 }}>{a.cat}</div>
                  <h3 style={{ fontFamily: FONT.serif, fontSize: mob ? 22 : 28, fontWeight: 400, color: C.charcoal, margin: "0 0 10px", lineHeight: 1.1 }}>{a.t}</h3>
                  <p style={{ fontFamily: FONT.sans, fontSize: 13, color: C.grey, margin: 0, lineHeight: 1.55, fontWeight: 300 }}>{a.sub}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* QUOTE */}
      <Reveal>
        <section style={{ padding: mob ? `48px ${pad}px` : "88px 56px", borderTop: `3px solid ${C.greyLight}`, borderBottom: `3px solid ${C.greyLight}` }}>
          <blockquote style={{ margin: 0 }}>
            <p style={{ fontFamily: FONT.serif, fontSize: mob ? 28 : "clamp(48px, 5.5vw, 80px)", fontWeight: 400, fontStyle: "italic", color: C.green, margin: 0, lineHeight: 1.1, maxWidth: "90%" }}>
              "Perfume is the most intense form of memory."
            </p>
            <footer style={{ fontFamily: FONT.sans, fontSize: 13, fontWeight: 500, color: C.grey, marginTop: mob ? 16 : 28, letterSpacing: "0.12em", background: "none" }}>Jean-Paul Guerlain</footer>
          </blockquote>
        </section>
      </Reveal>

      <IssuesSection />
      <Footer />
    </div>
  );
}

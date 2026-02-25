import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { C, FONT } from "../constants";
import { useMedia } from "../hooks/useMedia";
import { ISSUES, ISSUE_THEMES, ARTICLES } from "../data/articles";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";

function IssueDetailView({ issueNum }) {
  const { mob, tab } = useMedia();
  const navigate = useNavigate();
  const [entered, setEntered] = useState(false);
  useEffect(() => { setTimeout(() => setEntered(true), 100); }, []);

  const issue = ISSUES.find(i => i.num === issueNum);
  if (!issue) return <div style={{ padding: 80, textAlign: "center" }}>Issue not found</div>;

  const theme = ISSUE_THEMES[(39 - issue.num) % ISSUE_THEMES.length];
  const issueArticles = ARTICLES.filter(a => a.issue === issue.num).length > 0 ? ARTICLES.filter(a => a.issue === issue.num) : ARTICLES.slice(0, 6);
  const pad = mob ? 20 : 56;

  return (
    <div style={{ background: C.cream, minHeight: "100vh" }}>
      <section style={{ height: mob ? "60vh" : "70vh", minHeight: mob ? 360 : 400, position: "relative", overflow: "hidden", background: theme.bg }}>
        <img src={`https://images.unsplash.com/${issue.img}?w=${mob ? 800 : 2000}&h=1200&fit=crop&q=85`} alt={`Issue ${issue.num} cover`} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: entered ? 0.4 : 0, transition: "opacity 1.5s ease", mixBlendMode: "luminosity" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${theme.bg}dd 0%, transparent 40%, ${theme.bg}ee 100%)` }} />
        <div style={{ position: "absolute", ...(mob ? { bottom: pad, left: pad, right: pad } : { top: "50%", left: pad, transform: "translateY(-50%)" }), zIndex: 2, opacity: entered ? 1 : 0, transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.3s" }}>
          <div style={{ fontFamily: FONT.sans, fontSize: mob ? 10 : 12, fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: theme.accent, marginBottom: mob ? 12 : 20 }}>{issue.season} {issue.year}</div>
          <h1 style={{ fontFamily: FONT.serif, fontSize: mob ? 36 : "clamp(48px, 7vw, 88px)", fontWeight: 400, color: C.white, margin: 0, lineHeight: 0.95, letterSpacing: "-0.03em" }}>Petals<br /><span style={{ fontStyle: "italic", color: theme.accent }}>No. {issue.num}</span></h1>
          <p style={{ fontFamily: FONT.sans, fontSize: mob ? 12 : 15, color: "rgba(255,255,255,0.4)", marginTop: mob ? 12 : 20, fontWeight: 300 }}>84 Pages · 12 Stories · {issue.season} Edition</p>
        </div>
        <button onClick={() => navigate("/issues")} style={{ position: "absolute", top: mob ? 74 : 110, left: pad, zIndex: 10, fontFamily: FONT.sans, fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.5)", cursor: "pointer", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", border: "1.5px solid rgba(255,255,255,0.2)", background: "none" }}>← All Issues</button>
        <div style={{ position: "absolute", bottom: 0, left: pad, right: pad, height: 3, background: theme.accent, opacity: 0.6 }} />
      </section>
      <section style={{ padding: mob ? `48px ${pad}px 72px` : `80px ${pad}px 120px` }}>
        <Reveal><h2 style={{ fontFamily: FONT.sans, fontSize: mob ? 12 : 14, fontWeight: 600, letterSpacing: "0.35em", textTransform: "uppercase", color: C.green, marginBottom: mob ? 28 : 48 }}>In This Issue</h2></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : tab ? "1fr 1fr" : "1fr 1fr 1fr", gap: mob ? 20 : 32 }}>
          {issueArticles.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.1}>
              <article onClick={() => navigate(`/article/${a.id}`)} style={{ cursor: "pointer", marginTop: !mob && i % 3 === 1 ? 48 : 0 }}>
                <div style={{ position: "relative", overflow: "hidden", height: mob ? 220 : 320, borderRadius: mob ? 8 : 0, boxShadow: `0 8px 32px ${C.shadowMid}` }}>
                  <img src={`https://images.unsplash.com/${a.img}?w=800&h=700&fit=crop&q=80`} alt={`${a.t} — ${a.sub}`} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.6) 100%)" }} />
                  <div style={{ position: "absolute", bottom: mob ? 16 : 22, left: mob ? 16 : 22, right: mob ? 16 : 22 }}>
                    <span style={{ fontFamily: FONT.sans, fontSize: 9, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: theme.accent }}>{a.cat}</span>
                    <h3 style={{ fontFamily: FONT.serif, fontSize: mob ? 20 : 24, fontWeight: 400, color: C.white, margin: "6px 0 0", lineHeight: 1.1 }}>{a.t}</h3>
                  </div>
                </div>
                <div style={{ padding: "12px 0" }}><p style={{ fontFamily: FONT.sans, fontSize: 13, color: C.grey, margin: 0, fontWeight: 300, lineHeight: 1.5 }}>{a.sub}</p></div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}

function IssuesListPage() {
  const { mob, tab } = useMedia();
  const navigate = useNavigate();
  const featured = ISSUES[0];
  const recent = ISSUES.slice(1, 5);
  const older = ISSUES.slice(5);
  const pad = mob ? 20 : 56;

  return (
    <div style={{ background: C.cream, minHeight: "100vh", paddingTop: mob ? 80 : 120 }}>
      <div style={{ padding: `0 ${pad}px 24px` }}>
        <Reveal>
          <div style={{ fontFamily: FONT.sans, fontSize: mob ? 12 : 14, fontWeight: 600, letterSpacing: "0.35em", textTransform: "uppercase", color: C.green, marginBottom: 16, paddingBottom: 16, borderBottom: `3px solid ${C.green}`, display: "inline-block" }}>Issues</div>
          <h1 style={{ fontFamily: FONT.serif, fontSize: mob ? 40 : "clamp(56px, 8vw, 100px)", fontWeight: 400, color: C.charcoal, margin: "0 0 8px", lineHeight: 0.95 }}>The Archive</h1>
          <p style={{ fontFamily: FONT.sans, fontSize: mob ? 13 : 15, color: C.grey, margin: 0, fontWeight: 300 }}>39 issues · 2010 – 2025 · Every story preserved.</p>
        </Reveal>
      </div>
      <Reveal>
        <article onClick={() => navigate(`/issues/${featured.num}`)} style={{ margin: `${mob ? 24 : 48}px ${pad}px 0`, position: "relative", height: mob ? "35vh" : "50vh", minHeight: mob ? 220 : 300, overflow: "hidden", cursor: "pointer", borderRadius: mob ? 8 : 0, boxShadow: `0 16px 64px ${C.shadowDeep}` }}>
          <img src={`https://images.unsplash.com/${featured.img}?w=${mob ? 800 : 2000}&h=1000&fit=crop&q=85`} alt={`Issue ${featured.num} — ${featured.season} ${featured.year}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: mob ? "linear-gradient(180deg, transparent 30%, rgba(15,42,30,0.88) 100%)" : "linear-gradient(90deg, rgba(15,42,30,0.88) 0%, rgba(15,42,30,0.3) 60%, transparent 100%)" }} />
          <div style={{ position: "absolute", ...(mob ? { bottom: 20, left: 20 } : { top: "50%", left: 48, transform: "translateY(-50%)" }), zIndex: 2 }}>
            <div style={{ fontFamily: FONT.sans, fontSize: 11, fontWeight: 600, letterSpacing: "0.35em", textTransform: "uppercase", color: C.gold, marginBottom: mob ? 8 : 16 }}>Latest Issue</div>
            <h2 style={{ fontFamily: FONT.serif, fontSize: mob ? 36 : "clamp(48px, 6vw, 80px)", fontWeight: 400, color: C.white, margin: 0, lineHeight: 0.95 }}>No. {featured.num}</h2>
            <p style={{ fontFamily: FONT.sans, fontSize: mob ? 12 : 14, color: "rgba(255,255,255,0.45)", marginTop: mob ? 6 : 14, fontWeight: 300 }}>{featured.season} {featured.year} · 84 Pages</p>
          </div>
        </article>
      </Reveal>
      <div style={{ padding: `${mob ? 24 : 48}px ${pad}px 0`, display: "grid", gridTemplateColumns: mob ? "1fr 1fr" : "1fr 1fr 1fr 1fr", gap: mob ? 14 : 24 }}>
        {recent.map((iss, i) => (
          <Reveal key={iss.num} delay={i * 0.1}>
            <article onClick={() => navigate(`/issues/${iss.num}`)} style={{ cursor: "pointer", marginTop: !mob && i % 2 === 1 ? 40 : 0 }}>
              <div style={{ position: "relative", overflow: "hidden", borderRadius: mob ? 6 : 0, boxShadow: `0 8px 32px ${C.shadowMid}` }}>
                <img src={`https://images.unsplash.com/${iss.img}?w=600&h=840&fit=crop`} alt={`Issue ${iss.num} — ${iss.season} ${iss.year}`} loading="lazy" style={{ width: "100%", aspectRatio: "5/7", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.5) 100%)" }} />
                <div style={{ position: "absolute", bottom: mob ? 14 : 20, left: mob ? 14 : 20 }}>
                  <div style={{ fontFamily: FONT.serif, fontSize: mob ? 28 : 36, color: C.white, fontWeight: 400, lineHeight: 1 }}>{iss.num}</div>
                  <div style={{ fontFamily: FONT.sans, fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>{iss.season} {iss.year}</div>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      <div style={{ padding: `${mob ? 36 : 64}px ${pad}px 0` }}>
        <Reveal><div style={{ borderTop: `2px solid ${C.greyLight}`, paddingTop: mob ? 24 : 40 }}><span style={{ fontFamily: FONT.sans, fontSize: 13, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: C.greyMed }}>All Issues · {older.length} more</span></div></Reveal>
      </div>
      <div style={{ padding: `24px ${pad}px ${mob ? 72 : 120}px` }}>
        <div style={{ display: "grid", gridTemplateColumns: mob ? "1fr" : "1fr 1fr", gap: mob ? 4 : 20 }}>
          {older.map((iss, i) => (
            <Reveal key={iss.num} delay={Math.min(i * 0.03, 0.4)}>
              <article onClick={() => navigate(`/issues/${iss.num}`)} style={{ cursor: "pointer", display: "flex", gap: mob ? 14 : 20, alignItems: "center", padding: mob ? "12px 0" : 16, borderBottom: `1px solid ${C.greyLight}` }}>
                <div style={{ width: mob ? 56 : 72, height: mob ? 78 : 100, overflow: "hidden", flexShrink: 0, borderRadius: mob ? 4 : 0, boxShadow: `0 4px 16px ${C.shadow}` }}>
                  <img src={`https://images.unsplash.com/${iss.img}?w=144&h=200&fit=crop`} alt={`Issue ${iss.num}`} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FONT.serif, fontSize: mob ? 18 : 22, color: C.charcoal, fontWeight: 400 }}>No. {iss.num}</div>
                  <div style={{ fontFamily: FONT.sans, fontSize: 12, color: C.grey, marginTop: 4 }}>{iss.season} {iss.year}</div>
                </div>
                <span aria-hidden="true" style={{ fontFamily: FONT.sans, fontSize: 18, color: C.greyMed, fontWeight: 300 }}>→</span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function IssuesPage() {
  const { issueNum } = useParams();
  if (issueNum) return <IssueDetailView issueNum={parseInt(issueNum, 10)} />;
  return <IssuesListPage />;
}

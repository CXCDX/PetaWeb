import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { C, FONT } from "../constants";
import { useMedia } from "../hooks/useMedia";
import { ARTICLES } from "../data/articles";
import Footer from "../components/Footer";

export default function ArticleDetail() {
  const { mob } = useMedia();
  const { id } = useParams();
  const navigate = useNavigate();
  const [entered, setEntered] = useState(false);
  useEffect(() => { setTimeout(() => setEntered(true), 100); }, []);

  const article = ARTICLES.find(a => a.id === parseInt(id, 10));
  if (!article) return <div style={{ padding: 80, textAlign: "center" }}>Article not found</div>;

  const pad = mob ? 20 : 56;
  const idx = ARTICLES.findIndex(a => a.id === article.id);
  const next = ARTICLES[(idx + 1) % ARTICLES.length];

  return (
    <div style={{ background: C.cream }}>
      <section style={{ height: mob ? "70vh" : "90vh", minHeight: mob ? 400 : 500, position: "relative", overflow: "hidden" }}>
        <img src={`https://images.unsplash.com/${article.img}?w=${mob ? 800 : 2000}&h=1200&fit=crop&q=85`} alt={`${article.t} — ${article.sub}`} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: entered ? 1 : 0.2, transition: "opacity 1.8s ease" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.65) 100%)" }} />
        <div style={{ position: "absolute", bottom: mob ? 32 : 60, left: pad, right: pad, zIndex: 2, opacity: entered ? 1 : 0, transform: entered ? "translateY(0)" : "translateY(40px)", transition: "all 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s" }}>
          <div style={{ fontFamily: FONT.sans, fontSize: mob ? 10 : 12, fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: mob ? 12 : 20 }}>{article.cat} · Issue {article.issue}</div>
          <h1 style={{ fontFamily: FONT.serif, fontSize: mob ? "clamp(36px, 10vw, 56px)" : "clamp(48px, 8vw, 100px)", fontWeight: 400, fontStyle: "italic", color: C.white, margin: 0, lineHeight: 0.92 }}>{article.t}</h1>
          {article.sub && <p style={{ fontFamily: FONT.sans, fontSize: mob ? 14 : 17, color: "rgba(255,255,255,0.5)", marginTop: mob ? 10 : 18, fontWeight: 300 }}>{article.sub}</p>}
        </div>
        <button onClick={() => navigate(-1)} style={{ position: "absolute", top: mob ? 74 : 100, left: pad, zIndex: 10, fontFamily: FONT.sans, fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.5)", cursor: "pointer", letterSpacing: "0.08em", display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", border: "1.5px solid rgba(255,255,255,0.2)", background: "none" }}>← Back</button>
      </section>
      <section style={{ padding: mob ? `40px ${pad}px` : "80px 56px", maxWidth: 700, margin: "0 auto" }}>
        <p style={{ fontFamily: FONT.serif, fontSize: mob ? 19 : 23, lineHeight: 1.6, color: C.darkGrey, margin: "0 0 36px", fontStyle: "italic" }}>{article.desc}</p>
        <div style={{ width: 56, height: 3, background: C.green, marginBottom: mob ? 32 : 48 }} />
        {(article.body || []).map((txt, i) => (<p key={i} style={{ fontFamily: FONT.sans, fontSize: mob ? 15 : 16, lineHeight: 1.9, color: "rgba(44,44,44,0.8)", margin: "0 0 24px", fontWeight: 300 }}>{txt}</p>))}
        <div style={{ margin: mob ? "36px 0" : "56px -80px", overflow: "hidden", borderRadius: mob ? 8 : 0, boxShadow: `0 12px 56px ${C.shadowDeep}` }}>
          <img src={`https://images.unsplash.com/${ARTICLES[(article.id) % ARTICLES.length].img}?w=1400&h=500&fit=crop`} alt="" loading="lazy" style={{ width: "100%", height: mob ? 200 : 380, objectFit: "cover", display: "block" }} />
        </div>
        <h2 style={{ fontFamily: FONT.serif, fontSize: mob ? 28 : 38, fontWeight: 400, color: C.charcoal, margin: "0 0 24px", lineHeight: 1.1 }}>{article.h2 || "The Story Continues"}</h2>
        {(article.body2 || []).map((txt, i) => (<p key={i} style={{ fontFamily: FONT.sans, fontSize: mob ? 15 : 16, lineHeight: 1.9, color: "rgba(44,44,44,0.8)", margin: "0 0 24px", fontWeight: 300 }}>{txt}</p>))}
        <nav style={{ marginTop: mob ? 48 : 80, paddingTop: mob ? 28 : 40, borderTop: `3px solid ${C.greyLight}` }} aria-label="Next article">
          <div style={{ fontFamily: FONT.sans, fontSize: 11, fontWeight: 500, color: C.grey, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 12 }}>Next</div>
          <button onClick={() => navigate(`/article/${next.id}`)} style={{ fontFamily: FONT.serif, fontSize: mob ? 24 : 32, color: C.charcoal, cursor: "pointer", lineHeight: 1.1, background: "none", border: "none", padding: 0, textAlign: "left" }}>{next.t} →</button>
        </nav>
      </section>
      <Footer />
    </div>
  );
}

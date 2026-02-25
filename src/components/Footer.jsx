import { C, FONT } from "../constants";
import { useMedia } from "../hooks/useMedia";

export default function Footer() {
  const { mob } = useMedia();
  const pad = mob ? 20 : 56;

  return (
    <footer style={{ background: C.charcoal, color: C.white }}>
      <div style={{ padding: mob ? `48px ${pad}px 32px` : `72px ${pad}px 48px`, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ fontFamily: FONT.serif, fontSize: mob ? 36 : "clamp(56px, 7vw, 100px)", fontWeight: 400, color: C.white, letterSpacing: "-0.02em", lineHeight: 0.95, marginBottom: 24 }}>
          Petals
        </div>
        <p style={{ fontFamily: FONT.sans, fontSize: mob ? 13 : 14, color: "rgba(255,255,255,0.35)", fontWeight: 300, maxWidth: 400, lineHeight: 1.6 }}>
          A publication by MG International Fragrance Company. Exploring scent, science, and culture since 1961.
        </p>
      </div>
      <div style={{
        padding: mob ? `24px ${pad}px 32px` : `28px ${pad}px 36px`,
        display: "flex", justifyContent: "space-between", alignItems: mob ? "flex-start" : "center",
        flexDirection: mob ? "column" : "row", gap: mob ? 16 : 0,
      }}>
        <div style={{ fontFamily: FONT.sans, fontSize: 12, color: "rgba(255,255,255,0.3)", display: "flex", gap: mob ? 16 : 24, flexWrap: "wrap" }}>
          <span>Since 1961</span>
          <span>Istanbul</span>
          <span>Grasse</span>
        </div>
        <div style={{ fontFamily: FONT.sans, fontSize: 12, color: "rgba(255,255,255,0.3)", display: "flex", gap: 20, alignItems: "center" }}>
          <a href="https://gulcicek.com" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>gulcicek.com</a>
          <span>·</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}

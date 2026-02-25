import { useState } from "react";
import { C, FONT } from "../constants";
import { useMedia } from "../hooks/useMedia";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";

function InputField({ label, id, type = "text", textarea = false, dark = false }) {
  const { mob } = useMedia();
  const borderDefault = dark ? C.greyLight : "rgba(255,255,255,0.2)";
  const borderFocus = dark ? C.green : "rgba(255,255,255,0.5)";
  const color = dark ? C.charcoal : "inherit";
  const labelColor = dark ? C.grey : undefined;

  const base = {
    width: "100%", padding: mob ? "12px 0" : "14px 0",
    border: "none", borderBottom: `1.5px solid ${borderDefault}`,
    background: "transparent", color,
    fontFamily: FONT.sans, fontSize: mob ? 14 : 15, fontWeight: 300,
    outline: "none", transition: "border-color 0.3s",
  };

  return (
    <div style={{ marginBottom: mob ? 20 : 24 }}>
      <label htmlFor={id} style={{ fontFamily: FONT.sans, fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", display: "block", marginBottom: 8, opacity: dark ? 1 : 0.5, color: labelColor }}>{label}</label>
      {textarea
        ? <textarea id={id} name={id} rows={4} style={{ ...base, resize: "vertical" }} onFocus={e => e.target.style.borderColor = borderFocus} onBlur={e => e.target.style.borderColor = borderDefault} />
        : <input id={id} name={id} type={type} style={base} onFocus={e => e.target.style.borderColor = borderFocus} onBlur={e => e.target.style.borderColor = borderDefault} />
      }
    </div>
  );
}

export default function Contact() {
  const { mob } = useMedia();
  const pad = mob ? 20 : 56;
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    e.target.reset();
    setTimeout(() => setContactSubmitted(false), 3000);
  };

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    setRequestSubmitted(true);
    e.target.reset();
    setTimeout(() => setRequestSubmitted(false), 3000);
  };

  return (
    <div style={{ background: C.cream, minHeight: "100vh", paddingTop: mob ? 80 : 120 }}>
      <div style={{ padding: `0 ${pad}px 40px` }}>
        <Reveal>
          <div style={{ fontFamily: FONT.sans, fontSize: mob ? 12 : 14, fontWeight: 600, letterSpacing: "0.35em", textTransform: "uppercase", color: C.green, marginBottom: 16, paddingBottom: 16, borderBottom: `3px solid ${C.green}`, display: "inline-block" }}>Contact</div>
          <h1 style={{ fontFamily: FONT.serif, fontSize: mob ? 36 : "clamp(48px, 6vw, 80px)", fontWeight: 400, color: C.charcoal, margin: "0 0 8px", lineHeight: 0.95 }}>Get in Touch</h1>
          <p style={{ fontFamily: FONT.sans, fontSize: mob ? 13 : 15, color: C.grey, margin: 0, fontWeight: 300 }}>We'd love to hear from you.</p>
        </Reveal>
      </div>

      <div style={{
        display: mob ? "block" : "grid",
        gridTemplateColumns: mob ? "1fr" : "1fr 1fr",
        minHeight: mob ? "auto" : "70vh",
      }}>
        {/* Left: Contact Form */}
        <div style={{ padding: mob ? `32px ${pad}px 48px` : "64px 56px", background: C.cream, color: C.charcoal }}>
          <Reveal>
            <h2 style={{ fontFamily: FONT.serif, fontSize: mob ? 24 : 32, fontWeight: 400, color: C.charcoal, margin: "0 0 8px" }}>Send a Message</h2>
            <p style={{ fontFamily: FONT.sans, fontSize: 13, color: C.grey, margin: "0 0 36px", fontWeight: 300 }}>General inquiries, press, partnerships</p>
            <form onSubmit={handleContactSubmit}>
              <InputField label="Name" id="contact-name" dark />
              <InputField label="Email" id="contact-email" type="email" dark />
              <InputField label="Subject" id="contact-subject" dark />
              <InputField label="Message" id="contact-message" textarea dark />
              <button type="submit" style={{
                fontFamily: FONT.sans, fontSize: 11, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase",
                color: C.white, background: C.green, border: "none", padding: "16px 40px",
                cursor: "pointer", marginTop: 8, transition: "all 0.3s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = C.charcoal; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.green; }}>
                Send Message →
              </button>
              {contactSubmitted && <p role="status" style={{ fontFamily: FONT.sans, fontSize: 13, color: C.green, marginTop: 16 }}>Message sent successfully.</p>}
            </form>
          </Reveal>
        </div>

        {/* Right: Request an Issue */}
        <div style={{ padding: mob ? `48px ${pad}px 56px` : "64px 56px", background: C.green, color: C.white }}>
          <Reveal delay={0.1}>
            <h2 style={{ fontFamily: FONT.serif, fontSize: mob ? 24 : 32, fontWeight: 400, color: C.white, margin: "0 0 8px" }}>Request an Issue</h2>
            <p style={{ fontFamily: FONT.sans, fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "0 0 36px", fontWeight: 300 }}>For corporate orders, back issues, or bulk requests</p>
            <form onSubmit={handleRequestSubmit}>
              <InputField label="Name" id="request-name" />
              <InputField label="Surname" id="request-surname" />
              <InputField label="Company" id="request-company" />
              <InputField label="Title" id="request-title" />
              <InputField label="Message" id="request-message" textarea />
              <button type="submit" style={{
                fontFamily: FONT.sans, fontSize: 11, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase",
                color: C.green, background: C.white, border: "none", padding: "16px 40px",
                cursor: "pointer", marginTop: 8, transition: "all 0.3s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.color = C.white; }}
                onMouseLeave={e => { e.currentTarget.style.background = C.white; e.currentTarget.style.color = C.green; }}>
                Submit Request →
              </button>
              {requestSubmitted && <p role="status" style={{ fontFamily: FONT.sans, fontSize: 13, color: C.gold, marginTop: 16 }}>Request submitted successfully.</p>}
            </form>
          </Reveal>
        </div>
      </div>
      <Footer />
    </div>
  );
}

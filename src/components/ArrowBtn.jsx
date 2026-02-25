import { useState } from "react";
import { C } from "../constants";

export default function ArrowBtn({ dir = "right", onClick, light = false, disabled = false, size = 48, label }) {
  const [hov, setHov] = useState(false);
  const arrow = dir === "left" ? "←" : "→";
  const bg = light
    ? (hov ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)")
    : (hov ? C.green : "transparent");
  const border = light
    ? (disabled ? "rgba(255,255,255,0.15)" : hov ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.3)")
    : (disabled ? C.greyLight : hov ? C.green : C.charcoal);
  const color = light
    ? (disabled ? "rgba(255,255,255,0.2)" : C.white)
    : (disabled ? C.greyLight : hov ? C.white : C.charcoal);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      disabled={disabled}
      aria-label={label || (dir === "left" ? "Previous" : "Next")}
      style={{
        width: size, height: size, borderRadius: "50%",
        border: `2px solid ${border}`, background: bg, color,
        fontSize: Math.round(size * 0.38), cursor: disabled ? "default" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.35s ease", flexShrink: 0,
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {arrow}
    </button>
  );
}

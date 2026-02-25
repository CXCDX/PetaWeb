export default function Img({ src, h = 500, alt = "", style = {} }) {
  return (
    <div style={{ overflow: "hidden", height: h, ...style }}>
      <img
        src={`https://images.unsplash.com/${src}?w=1200&h=${h + 200}&fit=crop&q=80`}
        alt={alt}
        loading="lazy"
        style={{ width: "100%", height: "110%", objectFit: "cover", display: "block" }}
      />
    </div>
  );
}

"use client";
import { useState } from "react";

export default function BienDetailGallery({ photos, localisation }) {
  const [lightbox, setLightbox] = useState(null);

  if (!photos || photos.length === 0) {
    return (
      <div style={{ height: 420, borderRadius: 16, background: "#E8EDF2", display: "flex", alignItems: "center", justifyContent: "center", color: "#9CA3AF" }}>
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
        </svg>
      </div>
    );
  }

  const single = photos.length === 1;
  const main = photos[0];
  const thumbs = photos.slice(1, 5);
  const extra = photos.length - 5;

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .gallery-grid { grid-template-columns: 1fr !important; }
          .gallery-thumbs { display: none !important; }
          .gallery-main { height: 280px !important; }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      <div style={{ position: "relative" }}>
        <div className="gallery-grid" style={{ display: "grid", gridTemplateColumns: single ? "1fr" : "1.4fr 1fr", gap: 8, borderRadius: 16, overflow: "hidden" }}>

          {/* Grande photo */}
          <div className="gallery-main" onClick={() => setLightbox(0)}
            style={{ height: 460, background: "#E8EDF2", cursor: "pointer", position: "relative", overflow: "hidden" }}>
            <img src={main} alt={localisation} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
              onMouseEnter={e => e.target.style.transform = "scale(1.04)"}
              onMouseLeave={e => e.target.style.transform = "scale(1)"} />
          </div>

          {/* Miniatures (seulement si plusieurs photos) */}
          {!single && (
            <div className="gallery-thumbs" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 8 }}>
              {thumbs.map((photo, idx) => {
                const isLast = idx === thumbs.length - 1;
                return (
                  <div key={idx} onClick={() => setLightbox(idx + 1)}
                    style={{ background: "#E8EDF2", cursor: "pointer", position: "relative", overflow: "hidden", minHeight: 100 }}>
                    <img src={photo} alt={`Photo ${idx + 2}`} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
                      onMouseEnter={e => e.target.style.transform = "scale(1.06)"}
                      onMouseLeave={e => e.target.style.transform = "scale(1)"} />
                    {isLast && extra > 0 && (
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,27,56,0.65)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18, fontWeight: 700 }}>
                        +{extra}
                      </div>
                    )}
                  </div>
                );
              })}
              {/* Cases vides si moins de 4 miniatures */}
              {Array.from({ length: Math.max(0, 4 - thumbs.length) }).map((_, i) => (
                <div key={`empty-${i}`} style={{ background: "#FAFDFD", border: "1px dashed #E8EDF2", minHeight: 100 }} />
              ))}
            </div>
          )}
        </div>

        {/* Bouton voir photos — en overlay sur la photo, façon Airbnb */}
        <button onClick={() => setLightbox(0)}
          style={{ position: "absolute", bottom: 16, right: 16, display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 16px", background: "#fff", border: "1px solid #002B54", borderRadius: 10, fontSize: 13, fontWeight: 700, color: "#002B54", cursor: "pointer", boxShadow: "0 2px 10px rgba(0,43,84,0.15)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          {photos.length} photo{photos.length > 1 ? "s" : ""}
        </button>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div onClick={() => setLightbox(null)}
          style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,27,56,0.96)", display: "flex", flexDirection: "column", animation: "fadeIn 0.2s ease" }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 28px", color: "#fff" }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{lightbox + 1} / {photos.length}</span>
            <button onClick={() => setLightbox(null)}
              style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 28px 20px", position: "relative" }} onClick={e => e.stopPropagation()}>
            {photos.length > 1 && (
              <button onClick={() => setLightbox((lightbox - 1 + photos.length) % photos.length)}
                style={{ position: "absolute", left: 28, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
            )}

            <img src={photos[lightbox]} alt={`Photo ${lightbox + 1}`}
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 8 }} />

            {photos.length > 1 && (
              <button onClick={() => setLightbox((lightbox + 1) % photos.length)}
                style={{ position: "absolute", right: 28, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: "50%", width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#fff" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            )}
          </div>

          {photos.length > 1 && (
            <div style={{ display: "flex", gap: 8, padding: "0 28px 24px", justifyContent: "center", flexWrap: "wrap" }} onClick={e => e.stopPropagation()}>
              {photos.map((photo, idx) => (
                <div key={idx} onClick={() => setLightbox(idx)}
                  style={{ width: 64, height: 48, borderRadius: 6, overflow: "hidden", cursor: "pointer", border: idx === lightbox ? "2px solid #FF9500" : "2px solid transparent", opacity: idx === lightbox ? 1 : 0.5, transition: "all 0.15s" }}>
                  <img src={photo} alt={`Mini ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
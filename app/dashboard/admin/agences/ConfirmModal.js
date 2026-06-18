"use client";
import { useEffect } from "react";

export default function ConfirmModal({ agence, onConfirm, onCancel }) {
  // Fermer avec Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onCancel]);

  return (
    <>
      <style>{`
        @keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalSlideIn { from { opacity: 0; transform: translateY(-20px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>

      {/* Overlay */}
      <div onClick={onCancel}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,27,56,0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: 20,
          animation: "modalFadeIn 0.18s ease",
        }}>

        {/* Modal */}
        <div onClick={e => e.stopPropagation()}
          style={{
            background: "#FFFFFF",
            borderRadius: 20,
            maxWidth: 480,
            width: "100%",
            overflow: "hidden",
            boxShadow: "0 25px 60px rgba(0,27,56,0.3)",
            animation: "modalSlideIn 0.22s ease",
          }}>

          {/* Bannière sombre avec icône */}
          <div style={{ background: "linear-gradient(135deg, #001B38, #002B54)", padding: "32px 32px 24px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -50, right: -30, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,149,0,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(255,149,0,0.18)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF9500", marginBottom: 16 }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF", margin: "0 0 6px", letterSpacing: "-0.01em" }}>
                Désactiver cette agence ?
              </h2>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.5 }}>
                L'agence perdra immédiatement l'accès à la plateforme.
              </p>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: "26px 32px" }}>
            <div style={{ background: "#FAFDFD", border: "1px solid #E8EDF2", borderRadius: 12, padding: 18, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: "linear-gradient(135deg, #002B54, #001B38)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 16, fontWeight: 700, flexShrink: 0 }}>
                  {agence.nom[0]?.toUpperCase() || "?"}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#002B54" }}>{agence.nom}</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{agence.email}</div>
                </div>
              </div>
            </div>

            <div style={{ background: "rgba(220,38,38,0.04)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 10, padding: "12px 14px", marginBottom: 24, display: "flex", alignItems: "flex-start", gap: 10 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B91C1C" strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <div style={{ fontSize: 12.5, color: "#B91C1C", lineHeight: 1.6 }}>
                Un email sera envoyé pour l'informer de la désactivation. Elle ne pourra plus se connecter tant que vous ne réactivez pas son compte.
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={onCancel}
                style={{ padding: "11px 22px", borderRadius: 10, background: "#FFFFFF", border: "1px solid #E8EDF2", color: "#5A6B7D", fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}>
                Annuler
              </button>
              <button onClick={onConfirm}
                style={{ padding: "11px 22px", borderRadius: 10, background: "#B91C1C", color: "#fff", border: "none", fontSize: 13.5, fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 4px 14px rgba(185,28,28,0.3)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                Désactiver l'agence
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AgenceSidebar({ agence, bien }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const commissionTotale = (bien.prix * bien.tauxCommission) / 100;
  const part = bien.partRetrocedee ?? 30;
  const montantRetrocede = commissionTotale * (part / 100);
  const fmt = (n) => Math.round(n).toLocaleString("fr-BE");

  // Nom complet du contact référent (si fourni)
  const nomComplet = [agence.prenomContact, agence.nomContact].filter(Boolean).join(" ");

  async function handleContactAgence() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/messages/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetAgenceId: agence.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Impossible de démarrer la conversation");
      }
      router.push(`/dashboard/agence/messages?conv=${data.id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 20 }}>
      <style>{`
        @media (max-width: 1024px) {
          .agence-sidebar-wrap { position: static !important; }
        }
      `}</style>

      {/* Prix */}
      <div style={{ background: "#001B38", borderRadius: 16, padding: "24px", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", top: -50, right: -30, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,149,0,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", fontWeight: 600, marginBottom: 4 }}>Prix de vente</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#FF9500", marginBottom: 16 }}>
            {fmt(bien.prix)} €
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>Commission totale</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>
              {bien.tauxCommission}% · {fmt(commissionTotale)} €
            </span>
          </div>
        </div>
      </div>

      {/* Carte rétrocession */}
      <div style={{ background: "#FFFFFF", borderRadius: 16, border: "2px solid #FF9500", padding: "22px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: 0, background: "#FF9500", color: "#fff", fontSize: 10, fontWeight: 700, padding: "4px 12px", borderBottomLeftRadius: 10, letterSpacing: "0.04em" }}>
          POUR VOUS
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(255,149,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF9500" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 10h12"/><path d="M4 14h9"/><path d="M19 6a7.7 7.7 0 00-5.2-2A7.9 7.9 0 006 12c0 4.4 3.5 8 7.8 8a7.7 7.7 0 005.2-2"/></svg>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#002B54" }}>Si vous apportez l'acheteur</span>
        </div>
        <div style={{ fontSize: 30, fontWeight: 700, color: "#FF9500", marginBottom: 4 }}>
          {fmt(montantRetrocede)} €
        </div>
        <p style={{ fontSize: 12, color: "#5A6B7D", margin: 0, lineHeight: 1.5 }}>
          L'agence rétrocède <strong style={{ color: "#002B54" }}>{part}%</strong> de sa commission à l'agence qui lui apporte un acheteur.
        </p>
      </div>

      {/* Agence */}
      <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E8EDF2", padding: "22px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, paddingBottom: 16, borderBottom: "1px solid #F0F3F7" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #002B54, #001B38)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
            {agence.nom[0].toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#002B54" }}>{agence.nom}</div>
            <div style={{ fontSize: 12, color: "#9CA3AF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{agence.adresse}</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
          {agence.numeroIPI && (
            <div>
              <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Numéro IPI</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#002B54" }}>{agence.numeroIPI}</div>
            </div>
          )}
          {nomComplet && (
            <div>
              <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Contact référent</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#002B54" }}>{nomComplet}</div>
            </div>
          )}
          {agence.telephone && (
            <div>
              <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Téléphone</div>
              <a href={`tel:${agence.telephone}`} style={{ fontSize: 14, fontWeight: 600, color: "#FF9500", textDecoration: "none" }}>{agence.telephone}</a>
            </div>
          )}
          {agence.email && (
            <div>
              <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Email</div>
              <a href={`mailto:${agence.email}`} style={{ fontSize: 14, fontWeight: 600, color: "#FF9500", textDecoration: "none", wordBreak: "break-all" }}>{agence.email}</a>
            </div>
          )}
        </div>

        {error && (
          <div style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.25)", borderRadius: 10, padding: "10px 12px", marginBottom: 12, fontSize: 12, color: "#B91C1C", lineHeight: 1.5 }}>
            ⚠️ {error}
          </div>
        )}

        <button type="button" onClick={handleContactAgence} disabled={loading}
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: 12,
            background: loading ? "#FFB347" : "#FF9500",
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
            border: "none",
            cursor: loading ? "wait" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: "0 4px 14px rgba(255,149,0,0.3)",
            transition: "all 0.15s ease",
            opacity: loading ? 0.85 : 1,
          }}>
          {loading ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
              Ouverture...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              Contacter l'agence
            </>
          )}
        </button>
        <Link href="/dashboard/agence/catalogue"
          style={{ display: "block", textAlign: "center", marginTop: 10, padding: "11px", borderRadius: 12, background: "#fff", border: "1px solid #E8EDF2", color: "#002B54", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          ← Retour au catalogue
        </Link>
      </div>
    </div>
  );
}

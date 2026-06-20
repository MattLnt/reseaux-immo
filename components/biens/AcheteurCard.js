"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const PROFIL_LABELS = {
  CELIBATAIRE: "Célibataire",
  COUPLE_SANS_ENFANT: "Couple sans enfant",
  COUPLE_AVEC_ENFANTS: "Couple avec enfants",
  FAMILLE: "Famille",
  INVESTISSEUR: "Investisseur",
  AUTRE: "Autre",
};

const TYPE_LABELS = {
  APPARTEMENT: "Appartement",
  MAISON: "Maison",
  VILLA: "Villa",
  BUREAU: "Bureau",
  IMMEUBLE: "Immeuble",
  AUTRE: "Autre",
};

export default function AcheteurCard({ acheteur }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fmt = (n) => Math.round(n).toLocaleString("fr-BE");

  async function handleContactAgence() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/messages/conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetAgenceId: acheteur.agence.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Impossible de démarrer la conversation");
      router.push(`/dashboard/agence/messages?conv=${data.id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div style={{
      background: "#FFFFFF",
      borderRadius: 16,
      border: "1px solid #E8EDF2",
      padding: 22,
      display: "flex",
      flexDirection: "column",
      gap: 16,
      transition: "all 0.18s ease",
    }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      {/* Header : avatar anonyme + profil */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: "rgba(255,149,0,0.1)",
          border: "1px solid rgba(255,149,0,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FF9500",
          flexShrink: 0,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>
            Profil
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#002B54", lineHeight: 1.3 }}>
            {PROFIL_LABELS[acheteur.profilMenage] || acheteur.profilMenage}
          </div>
        </div>
      </div>

      {/* Budget — mis en avant */}
      <div style={{ background: "rgba(255,149,0,0.06)", borderRadius: 12, padding: "12px 14px", border: "1px solid rgba(255,149,0,0.2)" }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>
          Budget
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#FF9500", lineHeight: 1.1 }}>
          {fmt(acheteur.budgetMin)} € — {fmt(acheteur.budgetMax)} €
        </div>
      </div>

      {/* Détails — grid 2 colonnes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 12 }}>
        {acheteur.typesBien && acheteur.typesBien.length > 0 && (
          <div>
            <div style={{ color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4, fontSize: 10 }}>
              Recherche
            </div>
            <div style={{ color: "#002B54", fontWeight: 600, lineHeight: 1.4 }}>
              {acheteur.typesBien.map(t => TYPE_LABELS[t] || t).join(", ")}
            </div>
          </div>
        )}
        {acheteur.zones && acheteur.zones.length > 0 && (
          <div>
            <div style={{ color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4, fontSize: 10 }}>
              Zones
            </div>
            <div style={{ color: "#002B54", fontWeight: 600, lineHeight: 1.4 }}>
              {acheteur.zones.slice(0, 3).join(", ")}
              {acheteur.zones.length > 3 && ` +${acheteur.zones.length - 3}`}
            </div>
          </div>
        )}
        {acheteur.nbrChambresMin && (
          <div>
            <div style={{ color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4, fontSize: 10 }}>
              Chambres min
            </div>
            <div style={{ color: "#002B54", fontWeight: 600 }}>
              {acheteur.nbrChambresMin}+
            </div>
          </div>
        )}
        {acheteur.m2HabitableMin && (
          <div>
            <div style={{ color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4, fontSize: 10 }}>
              Surface min
            </div>
            <div style={{ color: "#002B54", fontWeight: 600 }}>
              {acheteur.m2HabitableMin} m²
            </div>
          </div>
        )}
      </div>

      {/* Footer : agence + bouton contacter */}
      <div style={{ paddingTop: 14, borderTop: "1px solid #F0F3F7", display: "flex", flexDirection: "column", gap: 10 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>
            Encodé par
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#002B54" }}>
            {acheteur.agence.nom}
          </div>
        </div>

        {error && (
          <div style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.25)", borderRadius: 8, padding: "8px 10px", fontSize: 11, color: "#B91C1C" }}>
            ⚠️ {error}
          </div>
        )}

        <button type="button" onClick={handleContactAgence} disabled={loading}
          style={{
            width: "100%",
            padding: "11px",
            borderRadius: 10,
            background: loading ? "#FFB347" : "#FF9500",
            color: "#FFFFFF",
            fontSize: 13,
            fontWeight: 700,
            border: "none",
            cursor: loading ? "wait" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            boxShadow: "0 2px 8px rgba(255,149,0,0.2)",
            transition: "all 0.15s ease",
          }}>
          {loading ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              Ouverture...
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
              Contacter l'agence
            </>
          )}
        </button>
      </div>
    </div>
  );
}
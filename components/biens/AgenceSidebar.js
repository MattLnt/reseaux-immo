import Link from "next/link";

export default function AgenceSidebar({ agence, bien }) {
  const commissionTotale = (bien.prix * bien.tauxCommission) / 100;
  const part = bien.partRetrocedee ?? 30;
  const montantRetrocede = commissionTotale * (part / 100);
  const fmt = (n) => Math.round(n).toLocaleString("fr-BE");

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

      {/* Carte rétrocession — la mise en avant */}
      <div style={{ background: "#FFFFFF", borderRadius: 16, border: "2px solid #FF9500", padding: "22px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: 0, background: "#FF9500", color: "#fff", fontSize: 10, fontWeight: 700, padding: "4px 12px", borderBottomLeftRadius: 10, letterSpacing: "0.04em" }}>
          POUR VOUS
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(255,149,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF9500" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
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

        <button type="button" style={{ width: "100%", padding: "13px", borderRadius: 12, background: "#FF9500", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 14px rgba(255,149,0,0.3)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
          Contacter l'agence
        </button>
        <Link href="/dashboard/agence/catalogue"
          style={{ display: "block", textAlign: "center", marginTop: 10, padding: "11px", borderRadius: 12, background: "#fff", border: "1px solid #E8EDF2", color: "#002B54", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          ← Retour au catalogue
        </Link>
      </div>
    </div>
  );
}
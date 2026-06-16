import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import AcheteurActions from "./AcheteurActions";

const PROFIL_LABELS = {
  CELIBATAIRE: "Célibataire",
  COUPLE_SANS_ENFANT: "Couple sans enfant",
  COUPLE_AVEC_ENFANTS: "Couple avec enfants",
  FAMILLE: "Famille",
  INVESTISSEUR: "Investisseur",
  AUTRE: "Autre",
};

const STATUT_CONFIG = {
  ACTIF: { label: "Actif", color: "#249E7C", bg: "rgba(36,158,124,0.1)" },
  INACTIF: { label: "Inactif", color: "#9CA3AF", bg: "rgba(156,163,175,0.15)" },
  TROUVE: { label: "Bien trouvé", color: "#FF9500", bg: "rgba(255,149,0,0.1)" },
};

export default async function AcheteurDetailPage({ params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const fmt = (n) => Math.round(n).toLocaleString("fr-BE");

  const acheteur = await prisma.acheteur.findUnique({ where: { id } });

  if (!acheteur || acheteur.agenceId !== session.user.agenceId) {
    redirect("/dashboard/agence/mes-acheteurs");
  }

  const statut = STATUT_CONFIG[acheteur.statut];

  return (
    <div style={{ maxWidth: 1100 }}>
      <style>{`
        @media (max-width: 1024px) {
          .acheteur-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: 13, color: "#9CA3AF" }}>
        <Link href="/dashboard/agence/mes-acheteurs" style={{ color: "#9CA3AF", textDecoration: "none" }}>
          Mes acheteurs
        </Link>
        <span>→</span>
        <span style={{ color: "#002B54", fontWeight: 600 }}>{acheteur.prenom} {acheteur.nom}</span>
      </div>

      {/* Bannière */}
      <div style={{ background: "linear-gradient(135deg, #001B38, #002B54)", borderRadius: 16, padding: 28, marginBottom: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -40, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,149,0,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#FF9500", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22, fontWeight: 700, flexShrink: 0 }}>
              {acheteur.prenom[0].toUpperCase()}{acheteur.nom[0].toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: "#FFFFFF", margin: "0 0 4px" }}>
                {acheteur.prenom} {acheteur.nom}
              </h1>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span>{PROFIL_LABELS[acheteur.profilMenage]}</span>
                <span style={{ opacity: 0.4 }}>•</span>
                <span>Encodé le {new Date(acheteur.createdAt).toLocaleDateString("fr-BE")}</span>
              </div>
            </div>
          </div>
          <span style={{ background: statut.bg, color: statut.color, fontSize: 11, fontWeight: 700, padding: "6px 14px", borderRadius: 20, letterSpacing: "0.05em" }}>
            {statut.label.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="acheteur-grid" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, alignItems: "start" }}>
        {/* COLONNE PRINCIPALE */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Budget */}
          <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E8EDF2", padding: 24 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 14px" }}>Budget</h2>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#FF9500" }}>
              {fmt(acheteur.budgetMin)} € — {fmt(acheteur.budgetMax)} €
            </div>
          </div>

          {/* Zones */}
          <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E8EDF2", padding: 24 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 14px" }}>Zones recherchées</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {acheteur.zones.map(z => (
                <span key={z} style={{ background: "rgba(255,149,0,0.08)", border: "1px solid rgba(255,149,0,0.3)", color: "#002B54", padding: "7px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                  📍 {z}
                </span>
              ))}
            </div>
          </div>

          {/* Types */}
          <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E8EDF2", padding: 24 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 14px" }}>Types de bien</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {acheteur.typesBien.map(t => (
                <span key={t} style={{ background: "#002B54", color: "#fff", padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, letterSpacing: "0.04em" }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Critères */}
          {(acheteur.nbrChambresMin || acheteur.nbrSdbMin || acheteur.m2HabitableMin) && (
            <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E8EDF2", padding: 24 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 14px" }}>Critères minimum</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
                {acheteur.nbrChambresMin && (
                  <div style={{ background: "#FAFDFD", border: "1px solid #F0F3F7", borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>Chambres</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#002B54", marginTop: 2 }}>{acheteur.nbrChambresMin}+</div>
                  </div>
                )}
                {acheteur.nbrSdbMin && (
                  <div style={{ background: "#FAFDFD", border: "1px solid #F0F3F7", borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>Salles de bain</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#002B54", marginTop: 2 }}>{acheteur.nbrSdbMin}+</div>
                  </div>
                )}
                {acheteur.m2HabitableMin && (
                  <div style={{ background: "#FAFDFD", border: "1px solid #F0F3F7", borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>Surface</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#002B54", marginTop: 2 }}>{acheteur.m2HabitableMin} m²+</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Remarques */}
          {acheteur.remarques && (
            <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E8EDF2", padding: 24 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 14px" }}>Remarques</h2>
              <p style={{ fontSize: 14, color: "#5A6B7D", lineHeight: 1.7, margin: 0 }}>{acheteur.remarques}</p>
            </div>
          )}
        </div>

        {/* SIDEBAR DROITE */}
        <div style={{ position: "sticky", top: 20, display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Coordonnées (privées) */}
          <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E8EDF2", padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#FF9500", textTransform: "uppercase", letterSpacing: "0.05em" }}>Coordonnées privées</span>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Email</div>
              <a href={`mailto:${acheteur.email}`} style={{ fontSize: 14, fontWeight: 600, color: "#FF9500", textDecoration: "none", wordBreak: "break-all" }}>
                {acheteur.email}
              </a>
            </div>

            <div>
              <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Téléphone</div>
              <a href={`tel:${acheteur.telephone}`} style={{ fontSize: 14, fontWeight: 600, color: "#FF9500", textDecoration: "none" }}>
                {acheteur.telephone}
              </a>
            </div>
          </div>

          {/* Actions */}
          <AcheteurActions acheteur={JSON.parse(JSON.stringify(acheteur))} />
        </div>
      </div>
    </div>
  );
}
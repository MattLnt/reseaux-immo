import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

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

export default async function MesAcheteursPage() {
  const session = await getServerSession(authOptions);
  const fmt = (n) => Math.round(n).toLocaleString("fr-BE");

  const acheteurs = await prisma.acheteur.findMany({
    where: { agenceId: session.user.agenceId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#002B54", margin: "0 0 6px", letterSpacing: "-0.01em" }}>
            Mes acheteurs
          </h1>
          <p style={{ fontSize: 14, color: "#5A6B7D", margin: 0 }}>
            Encodez vos acheteurs potentiels pour les faire matcher avec les biens du réseau.
          </p>
        </div>
        <Link href="/dashboard/agence/mes-acheteurs/nouveau"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 22px", borderRadius: 10, background: "#FF9500", color: "#FFFFFF", fontSize: 14, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 14px rgba(255,149,0,0.3)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nouvel acheteur
        </Link>
      </div>

      {/* Liste ou empty state */}
      {acheteurs.length === 0 ? (
        <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E8EDF2", padding: "60px 32px", textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,149,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87"/>
              <path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#002B54", margin: "0 0 8px" }}>Aucun acheteur encodé</h2>
          <p style={{ fontSize: 14, color: "#9CA3AF", margin: "0 0 24px" }}>Commencez par encoder votre premier acheteur potentiel.</p>
          <Link href="/dashboard/agence/mes-acheteurs/nouveau"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 10, background: "#FF9500", color: "#FFFFFF", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
            Encoder un acheteur
          </Link>
        </div>
      ) : (
        <>
          <div style={{ fontSize: 13, color: "#5A6B7D", marginBottom: 16, fontWeight: 500 }}>
            {acheteurs.length} acheteur{acheteurs.length > 1 ? "s" : ""} encodé{acheteurs.length > 1 ? "s" : ""}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
            {acheteurs.map(a => {
              const statut = STATUT_CONFIG[a.statut];
              return (
                <Link key={a.id} href={`/dashboard/agence/mes-acheteurs/${a.id}`}
                  style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E8EDF2", padding: 20, textDecoration: "none", display: "flex", flexDirection: "column", transition: "all 0.15s ease" }}>

                  {/* Header carte */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, #002B54, #001B38)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 15, fontWeight: 700, flexShrink: 0 }}>
                        {a.prenom[0].toUpperCase()}{a.nom[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#002B54", lineHeight: 1.3 }}>
                          {a.prenom} {a.nom}
                        </div>
                        <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
                          {PROFIL_LABELS[a.profilMenage]}
                        </div>
                      </div>
                    </div>
                    <span style={{ background: statut.bg, color: statut.color, fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 20, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                      {statut.label.toUpperCase()}
                    </span>
                  </div>

                  {/* Budget */}
                  <div style={{ background: "rgba(255,149,0,0.06)", border: "1px solid rgba(255,149,0,0.18)", borderRadius: 10, padding: "10px 12px", marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Budget</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#FF9500", marginTop: 2 }}>
                      {fmt(a.budgetMin)} € — {fmt(a.budgetMax)} €
                    </div>
                  </div>

                  {/* Zones */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Zones</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {a.zones.slice(0, 3).map(z => (
                        <span key={z} style={{ background: "#FAFDFD", border: "1px solid #E8EDF2", color: "#002B54", fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6 }}>
                          {z}
                        </span>
                      ))}
                      {a.zones.length > 3 && (
                        <span style={{ color: "#9CA3AF", fontSize: 11, fontWeight: 600, padding: "3px 4px" }}>
                          +{a.zones.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Types */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Types recherchés</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {a.typesBien.slice(0, 3).map(t => (
                        <span key={t} style={{ background: "rgba(0,43,84,0.06)", color: "#002B54", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6 }}>
                          {t}
                        </span>
                      ))}
                      {a.typesBien.length > 3 && (
                        <span style={{ color: "#9CA3AF", fontSize: 11, fontWeight: 600, padding: "3px 4px" }}>
                          +{a.typesBien.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid #F0F3F7", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                      Encodé le {new Date(a.createdAt).toLocaleDateString("fr-BE")}
                    </span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="2.5">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
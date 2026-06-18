import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import AgenceDetailActions from "./AgenceDetailActions";

export default async function AgenceDetailPage({ params }) {
  const { id } = await params;

  const agence = await prisma.agence.findUnique({
    where: { id },
    include: {
      user: { select: { email: true, createdAt: true } },
      _count: { select: { biens: true, acheteurs: true } },
    },
  });

  if (!agence) notFound();

  const fmt = (n) => Math.round(n).toLocaleString("fr-BE");

  return (
    <div style={{ maxWidth: 1100 }}>
      <style>{`
        @media (max-width: 1024px) {
          .agence-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: 13, color: "#9CA3AF" }}>
        <Link href="/dashboard/admin/agences" style={{ color: "#9CA3AF", textDecoration: "none" }}>
          Agences
        </Link>
        <span>→</span>
        <span style={{ color: "#002B54", fontWeight: 600 }}>{agence.nom}</span>
      </div>

      {/* Bannière */}
      <div style={{ background: "linear-gradient(135deg, #001B38, #002B54)", borderRadius: 16, padding: 28, marginBottom: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -40, width: 240, height: 240, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,149,0,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 68, height: 68, borderRadius: 16, background: "#FF9500", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 26, fontWeight: 700, flexShrink: 0 }}>
              {agence.nom[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 700, color: "#FFFFFF", margin: "0 0 6px", letterSpacing: "-0.01em" }}>
                {agence.nom}
              </h1>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span>Inscrite le {new Date(agence.createdAt).toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" })}</span>
              </div>
            </div>
          </div>
          {agence.isActive ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(16,185,129,0.18)", color: "#10B981", fontSize: 12, fontWeight: 700, padding: "7px 14px", borderRadius: 20, letterSpacing: "0.04em" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981" }} />
              ACTIVE
            </span>
          ) : (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,149,0,0.18)", color: "#FF9500", fontSize: 12, fontWeight: 700, padding: "7px 14px", borderRadius: 20, letterSpacing: "0.04em" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#FF9500" }} />
              EN ATTENTE
            </span>
          )}
        </div>
      </div>

      {/* Grille principale */}
      <div className="agence-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>

        {/* COLONNE PRINCIPALE */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Coordonnées */}
          <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E8EDF2", padding: 24 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 18px" }}>Coordonnées</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Email</div>
                <a href={`mailto:${agence.email}`} style={{ fontSize: 14, fontWeight: 600, color: "#FF9500", textDecoration: "none", wordBreak: "break-all" }}>
                  {agence.email}
                </a>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Téléphone</div>
                <a href={`tel:${agence.telephone}`} style={{ fontSize: 14, fontWeight: 600, color: "#FF9500", textDecoration: "none" }}>
                  {agence.telephone || "—"}
                </a>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Adresse</div>
              <div style={{ fontSize: 14, color: "#002B54", fontWeight: 500 }}>
                {agence.adresse || "—"}
              </div>
            </div>

            {agence.horaire && (
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Horaire</div>
                <div style={{ fontSize: 13, color: "#5A6B7D", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                  {agence.horaire}
                </div>
              </div>
            )}

            {agence.description && (
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Description</div>
                <p style={{ fontSize: 13, color: "#5A6B7D", lineHeight: 1.7, margin: 0 }}>
                  {agence.description}
                </p>
              </div>
            )}
          </div>

          {/* Activité */}
          <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E8EDF2", padding: 24 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 18px" }}>Activité sur la plateforme</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div style={{ background: "#FAFDFD", border: "1px solid #F0F3F7", borderRadius: 12, padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(0,43,84,0.06)", display: "flex", alignItems: "center", justifyContent: "center", color: "#002B54" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
                  </div>
                  <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600 }}>Biens publiés</span>
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: "#002B54", lineHeight: 1 }}>
                  {agence._count.biens}
                </div>
              </div>

              <div style={{ background: "#FAFDFD", border: "1px solid #F0F3F7", borderRadius: 12, padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(255,149,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF9500" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                  </div>
                  <span style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600 }}>Acheteurs encodés</span>
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: "#FF9500", lineHeight: 1 }}>
                  {agence._count.acheteurs}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR DROITE */}
        <div style={{ position: "sticky", top: 20, display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Compte utilisateur */}
          <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E8EDF2", padding: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#FF9500", textTransform: "uppercase", letterSpacing: "0.05em" }}>Compte connecté</span>
            </div>

            <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Email de connexion</div>
            <div style={{ fontSize: 13, color: "#002B54", wordBreak: "break-all", marginBottom: 14 }}>
              {agence.user?.email || "—"}
            </div>

            {agence.user?.createdAt && (
              <>
                <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Compte créé le</div>
                <div style={{ fontSize: 13, color: "#5A6B7D" }}>
                  {new Date(agence.user.createdAt).toLocaleDateString("fr-BE", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              </>
            )}
          </div>

          {/* Actions admin */}
          <AgenceDetailActions agence={JSON.parse(JSON.stringify(agence))} />
        </div>
      </div>
    </div>
  );
}
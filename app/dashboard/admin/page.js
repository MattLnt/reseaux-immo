import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardAdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // Stats agences
  const [totalAgences, agencesEnAttente, agencesActives, agencesDesactivees, totalBiens, totalAcheteurs] = await Promise.all([
    prisma.agence.count(),
    prisma.agence.count({ where: { isActive: false } }),
    prisma.agence.count({ where: { isActive: true } }),
    prisma.agence.count({ where: { isActive: false } }), // À ajuster plus tard avec un statut séparé
    prisma.bien.count(),
    prisma.acheteur.count(),
  ]);

  const stats = [
    { label: "Agences inscrites", value: totalAgences, color: "#002B54", bg: "rgba(0,43,84,0.06)" },
    { label: "En attente de validation", value: agencesEnAttente, color: "#FF9500", bg: "rgba(255,149,0,0.08)" },
    { label: "Agences actives", value: agencesActives, color: "#10B981", bg: "rgba(16,185,129,0.08)" },
    { label: "Biens publiés", value: totalBiens, color: "#5A7FE0", bg: "rgba(133,168,249,0.12)" },
    { label: "Acheteurs encodés", value: totalAcheteurs, color: "#002B54", bg: "rgba(0,43,84,0.06)" },
  ];

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#002B54", margin: "0 0 6px", letterSpacing: "-0.01em" }}>
          Tableau de bord administrateur
        </h1>
        <p style={{ fontSize: 14, color: "#5A6B7D", margin: 0 }}>
          Vue globale de la plateforme Réseaux Immo.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E8EDF2", padding: 22 }}>
            <div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: s.color, lineHeight: 1 }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Alerte si agences en attente */}
      {agencesEnAttente > 0 && (
        <Link href="/dashboard/admin/agences"
          style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(255,149,0,0.06)", border: "1.5px solid rgba(255,149,0,0.3)", borderRadius: 16, padding: "20px 24px", textDecoration: "none", marginBottom: 24 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#FF9500", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#002B54", marginBottom: 2 }}>
              {agencesEnAttente} agence{agencesEnAttente > 1 ? "s" : ""} en attente de validation
            </div>
            <div style={{ fontSize: 13, color: "#5A6B7D" }}>
              Cliquez ici pour gérer les inscriptions
            </div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
        </Link>
      )}

      {/* Lien vers gestion */}
      <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E8EDF2", padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#002B54", margin: "0 0 12px" }}>Gestion des agences</h2>
        <p style={{ fontSize: 13, color: "#5A6B7D", margin: "0 0 18px", lineHeight: 1.6 }}>
          La page de gestion détaillée des agences (validation, désactivation, filtres) est en cours de finalisation.
        </p>
        <Link href="/dashboard/admin/agences"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 10, background: "#001B38", color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
          Accéder à la gestion
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
        </Link>
      </div>
    </div>
  );
}
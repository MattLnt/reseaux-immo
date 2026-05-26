import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AdminOpportuniteToggle from "./AdminOpportuniteToggle";

export default async function DashboardAdminPage() {
  const session = await getServerSession(authOptions);

  const [
    totalVendeurs,
    totalAcheteurs,
    totalOpportunites,
    opportunitesPending,
    opportunitesActives,
    totalDeblocages,
  ] = await Promise.all([
    prisma.vendeur.count(),
    prisma.acheteur.count(),
    prisma.opportunite.count(),
    prisma.opportunite.count({ where: { status: "PENDING" } }),
    prisma.opportunite.count({ where: { status: "ACTIVE" } }),
    prisma.deblocage.count({ where: { paidAt: { not: null } } }),
  ]);

  const revenusDeblocages = totalDeblocages * 699;

  const opportunitesPendingList = await prisma.opportunite.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    include: { vendeur: true },
    take: 10,
  });

  const derniersDeblocages = await prisma.deblocage.findMany({
    where: { paidAt: { not: null } },
    orderBy: { paidAt: "desc" },
    take: 5,
    include: { acheteur: { include: { user: true } } },
  });

  return (
    <div style={{ maxWidth: "100%" }}>
      <style>{`
        @media (max-width: 1024px) {
          .adm-dash-stats1 { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
          .adm-dash-stats2 { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
          .adm-dash-grid { grid-template-columns: 1fr !important; gap: 14px !important; }
          .adm-dash-right { display: none !important; }
          .adm-dash-header h1 { font-size: 20px !important; }
          .adm-pending-row { flex-direction: column !important; align-items: flex-start !important; gap: 10px !important; }
        }
      `}</style>

      <div className="adm-dash-header" style={{ marginBottom: 28 }}>
        <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 4px", textTransform: "capitalize" }}>
          {new Date().toLocaleDateString("fr-BE", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0, letterSpacing: "-0.02em" }}>Vue globale</h1>
      </div>

      {/* Stats principales */}
      <div className="adm-dash-stats1" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 14 }}>
        {[
          { label: "Vendeurs inscrits", value: totalVendeurs, color: "#6366F1", bg: "#EEF2FF", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
          { label: "Acheteurs inscrits", value: totalAcheteurs, color: "#C8A96E", bg: "#FFFBEB", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
          { label: "Revenus déblocages", value: `${revenusDeblocages.toLocaleString("fr-BE")} €`, color: "#10B981", bg: "#F0FDF4", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg> },
        ].map((stat) => (
          <div key={stat.label} style={{ background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6", padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 10px", fontWeight: 500 }}>{stat.label}</p>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#111827", letterSpacing: "-0.03em", lineHeight: 1 }}>{stat.value}</div>
            </div>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", color: stat.color, flexShrink: 0 }}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Stats secondaires */}
      <div className="adm-dash-stats2" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
        {[
          { label: "Total dossiers", value: totalOpportunites, color: "#111827" },
          { label: "À valider", value: opportunitesPending, color: "#F59E0B" },
          { label: "En ligne", value: opportunitesActives, color: "#10B981" },
        ].map((stat) => (
          <div key={stat.label} style={{ background: "#fff", borderRadius: 14, border: "1px solid #F3F4F6", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 4px", fontWeight: 500 }}>{stat.label}</p>
              <div style={{ fontSize: 26, fontWeight: 700, color: stat.color, letterSpacing: "-0.02em" }}>{stat.value}</div>
            </div>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: stat.color, flexShrink: 0 }} />
          </div>
        ))}
      </div>

      <div className="adm-dash-grid" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>

        {/* Opportunités à valider */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 2px" }}>Dossiers à valider</h2>
              <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>{opportunitesPending} en attente</p>
            </div>
            <Link href="/dashboard/admin/opportunites" style={{ fontSize: 12, color: "#6366F1", fontWeight: 600, textDecoration: "none" }}>
              Voir tout →
            </Link>
          </div>

          {opportunitesPendingList.length === 0 ? (
            <div style={{ padding: "32px 24px", textAlign: "center" }}>
              <p style={{ fontSize: 14, color: "#6B7280", margin: 0 }}>Aucun dossier en attente.</p>
            </div>
          ) : (
            <div>
              {opportunitesPendingList.map((opp, i) => (
                <div key={opp.id} className="adm-pending-row" style={{ padding: "14px 20px", borderBottom: i < opportunitesPendingList.length - 1 ? "1px solid #F9FAFB" : "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 3 }}>
                      {opp.province} — {Array.isArray(opp.typeDeal) ? opp.typeDeal.map(t => t.replace(/_/g, " ")).join(", ") : opp.typeDeal}
                    </div>
                    <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                      {(opp.chiffreAffaires / 1000).toFixed(0)}k € · {opp.nombreClients} clients · {opp.activites.slice(0, 2).join(", ")}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <AdminOpportuniteToggle id={opp.id} currentStatus={opp.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Colonne droite */}
        <div className="adm-dash-right" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #F3F4F6" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 2px" }}>Derniers déblocages</h3>
              <p style={{ fontSize: 12, color: "#9CA3AF", margin: 0 }}>{totalDeblocages} au total</p>
            </div>
            {derniersDeblocages.length === 0 ? (
              <div style={{ padding: "20px", textAlign: "center" }}>
                <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>Aucun déblocage.</p>
              </div>
            ) : derniersDeblocages.map((d, i) => (
              <div key={d.id} style={{ padding: "12px 20px", borderBottom: i < derniersDeblocages.length - 1 ? "1px solid #F9FAFB" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>{d.acheteur.user.email}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>{new Date(d.paidAt).toLocaleDateString("fr-BE")}</div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#10B981" }}>+699 €</span>
              </div>
            ))}
          </div>

          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #F3F4F6", padding: "18px 20px" }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: "0 0 14px" }}>Accès rapides</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Gérer les dossiers", href: "/dashboard/admin/opportunites" },
                { label: "Liste des vendeurs", href: "/dashboard/admin/vendeurs" },
                { label: "Liste des acheteurs", href: "/dashboard/admin/acheteurs" },
                { label: "Abonnements Stripe", href: "/dashboard/admin/abonnements" },
              ].map((a) => (
                <Link key={a.href} href={a.href} style={{ display: "block", padding: "10px 14px", borderRadius: 9, background: "#F9FAFB", color: "#111827", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>
                  {a.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
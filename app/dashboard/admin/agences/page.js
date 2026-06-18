import { prisma } from "@/lib/prisma";
import AgencesListClient from "./AgencesListClient";

export default async function AgencesPage() {
  // On récupère TOUTES les agences avec leur user associé
  const agences = await prisma.agence.findMany({
    include: {
      user: { select: { email: true, createdAt: true } },
      _count: { select: { biens: true, acheteurs: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Calcul des compteurs pour les onglets
  const counts = {
    all: agences.length,
    enAttente: agences.filter(a => !a.isActive).length,
    actives: agences.filter(a => a.isActive).length,
  };

  return (
    <div style={{ maxWidth: 1400 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: "#002B54", margin: "0 0 6px", letterSpacing: "-0.01em" }}>
          Gestion des agences
        </h1>
        <p style={{ fontSize: 14, color: "#5A6B7D", margin: 0 }}>
          Validez les inscriptions, gérez les comptes actifs et désactivez les agences si nécessaire.
        </p>
      </div>

      <AgencesListClient
        agences={JSON.parse(JSON.stringify(agences))}
        counts={counts}
      />
    </div>
  );
}
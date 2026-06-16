import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import AcheteurForm from "@/app/components/forms/AcheteurForm";

export default async function EditAcheteurPage({ params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const acheteur = await prisma.acheteur.findUnique({ where: { id } });

  if (!acheteur || acheteur.agenceId !== session.user.agenceId) {
    redirect("/dashboard/agence/mes-acheteurs");
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: 13, color: "#9CA3AF" }}>
        <Link href="/dashboard/agence/mes-acheteurs" style={{ color: "#9CA3AF", textDecoration: "none" }}>
          Mes acheteurs
        </Link>
        <span>→</span>
        <Link href={`/dashboard/agence/mes-acheteurs/${id}`} style={{ color: "#9CA3AF", textDecoration: "none" }}>
          {acheteur.prenom} {acheteur.nom}
        </Link>
        <span>→</span>
        <span style={{ color: "#002B54", fontWeight: 600 }}>Modifier</span>
      </div>

      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#002B54", margin: "0 0 6px", letterSpacing: "-0.01em" }}>
        Modifier l'acheteur
      </h1>
      <p style={{ fontSize: 14, color: "#5A6B7D", margin: "0 0 28px" }}>
        Mettez à jour les critères de recherche.
      </p>

      <AcheteurForm mode="edit" initialData={JSON.parse(JSON.stringify(acheteur))} />
    </div>
  );
}
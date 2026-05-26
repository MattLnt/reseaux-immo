import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import BienForm from "@/components/forms/BienForm";

export default async function ModifierBienPage({ params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const bien = await prisma.bien.findUnique({
    where: { id }
  });

  // Vérifier que le bien existe et appartient à l'agence
  if (!bien || bien.agenceId !== session.user.agenceId) {
    redirect('/dashboard/agence/mes-biens');
  }

  return (
    <div style={{ maxWidth: "100%" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
          Modifier le bien
        </h1>
        <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
          {bien.localisation}
        </p>
      </div>

      <BienForm mode="edit" initialData={bien} />
    </div>
  );
}
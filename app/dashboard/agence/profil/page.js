import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ProfilForm from "@/app/components/ProfilForm";

export default async function ProfilAgencePage() {
  const session = await getServerSession(authOptions);

  const agence = await prisma.agence.findUnique({
    where: { id: session.user.agenceId },
    select: {
      nom: true,
      adresse: true,
      telephone: true,
      email: true,
      numeroIPI: true,
      prenomContact: true,
      nomContact: true,
      horaire: true,
      description: true,
    },
  });

  return (
    <div style={{ maxWidth: "100%" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#002B54", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
          Profil de l'agence
        </h1>
        <p style={{ fontSize: 13, color: "#5A6B7D", margin: 0 }}>
          Gérez les informations visibles par les autres agences du réseau
        </p>
      </div>

      <ProfilForm initialData={agence} />
    </div>
  );
}
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import EditBienForm from "./EditBienForm";

export default async function EditBienPage({ params }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  const bien = await prisma.bien.findUnique({
    where: { id },
    include: { agence: true }
  });

  // Vérifier que le bien existe et appartient à l'agence
  if (!bien || bien.agenceId !== session.user.agenceId) {
    redirect('/dashboard/agence/mes-biens');
  }

  return <EditBienForm bien={bien} />;
}
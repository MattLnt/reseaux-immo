import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendAgenceValidee, sendAgenceDesactivee } from "@/lib/emails";

// Helper : vérifie que c'est bien un admin connecté
async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return { error: "Non autorisé", status: 401 };
  }
  return { session };
}

// GET /api/admin/agence/[id] — détails d'une agence (pour la page détail admin)
export async function GET(req, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { id } = await params;
    const agence = await prisma.agence.findUnique({
      where: { id },
      include: {
        user: { select: { email: true, createdAt: true } },
        _count: { select: { biens: true, acheteurs: true } },
      },
    });

    if (!agence) {
      return NextResponse.json({ error: "Agence introuvable" }, { status: 404 });
    }

    return NextResponse.json(agence);
  } catch (err) {
    console.error("GET /api/admin/agence/[id] error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT /api/admin/agence/[id] — toggle isActive (valider ou désactiver)
// Body: { action: "activate" | "deactivate" }
export async function PUT(req, { params }) {
  const auth = await requireAdmin();
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { id } = await params;
    const body = await req.json();
    const { action } = body;

    if (action !== "activate" && action !== "deactivate") {
      return NextResponse.json({ error: "Action invalide" }, { status: 400 });
    }

    const agence = await prisma.agence.findUnique({ where: { id } });
    if (!agence) {
      return NextResponse.json({ error: "Agence introuvable" }, { status: 404 });
    }

    const newActiveState = action === "activate";

    const updated = await prisma.agence.update({
      where: { id },
      data: { isActive: newActiveState },
    });

    // Envoi de l'email correspondant — sans bloquer la réponse
    const emailFn = newActiveState ? sendAgenceValidee : sendAgenceDesactivee;
    emailFn({ to: agence.email, nomAgence: agence.nom })
      .catch(err => console.error("[ADMIN] Email error:", err));

    return NextResponse.json({
      success: true,
      agence: updated,
      message: newActiveState ? "Agence activée" : "Agence désactivée",
    });
  } catch (err) {
    console.error("PUT /api/admin/agence/[id] error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
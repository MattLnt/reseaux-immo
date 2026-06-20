import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import BienDetailGallery from "@/components/biens/BienDetailGallery";
import BienDetailInfo from "@/components/biens/BienDetailInfo";
import BienDetailSpecs from "@/components/biens/BienDetailSpecs";
import AgenceSidebar from "@/components/biens/AgenceSidebar";

export default async function BienDetailPage({ params }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const bien = await prisma.bien.findUnique({
    where: { id },
    include: {
      agence: {
        select: {
          id: true,
          nom: true,
          adresse: true,
          telephone: true,
          email: true,
          numeroIPI: true,
          prenomContact: true,
          nomContact: true,
        }
      }
    }
  });

  // Visible si actif OU sous option (pas si vendu/archivé/supprimé) + pas mon bien
  const statutsVisibles = ['ACTIF', 'SOUS_OPTION'];
  if (!bien || !statutsVisibles.includes(bien.statut) || bien.agenceId === session.user.agenceId) {
    redirect('/dashboard/agence/catalogue');
  }

  return (
    <div style={{ maxWidth: "100%" }}>
      <style>{`
        @media (max-width: 1024px) {
          .bien-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: 13, color: "#9CA3AF" }}>
        <Link href="/dashboard/agence/catalogue" style={{ color: "#9CA3AF", textDecoration: "none" }}>
          Catalogue
        </Link>
        <span>→</span>
        <span style={{ color: "#002B54", fontWeight: 600 }}>{bien.localisation}</span>
      </div>

      <div className="bien-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, alignItems: "start" }}>

        {/* COLONNE PRINCIPALE */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          <BienDetailGallery photos={bien.photos} localisation={bien.localisation} />

          <BienDetailInfo bien={bien} />

          <BienDetailSpecs bien={bien} />

          {/* Description */}
          {bien.descriptionCourte && (
            <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E8EDF2", padding: 28 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#002B54", margin: "0 0 12px" }}>Description</h2>
              <p style={{ fontSize: 14, color: "#5A6B7D", lineHeight: 1.8, margin: 0 }}>{bien.descriptionCourte}</p>
            </div>
          )}

          {/* Lien annonce */}
          {bien.lienAnnonce && (
            <a href={bien.lienAnnonce} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 20px", background: "#FFFFFF", border: "1px solid #E8EDF2", borderRadius: 12, color: "#FF9500", fontSize: 14, fontWeight: 600, textDecoration: "none", alignSelf: "flex-start" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              Voir l'annonce complète
            </a>
          )}
        </div>

        {/* SIDEBAR DROITE */}
        <AgenceSidebar agence={bien.agence} bien={bien} />
      </div>
    </div>
  );
}
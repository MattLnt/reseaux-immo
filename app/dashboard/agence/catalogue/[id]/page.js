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
          nom: true,
          adresse: true,
          telephone: true,
          email: true
        }
      }
    }
  });

  // Vérifier que le bien existe et n'appartient pas à l'agence connectée
  if (!bien || bien.statut !== 'ACTIF' || bien.agenceId === session.user.agenceId) {
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
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: 13, color: "#6B7280" }}>
        <Link href="/dashboard/agence/catalogue" style={{ color: "#6B7280", textDecoration: "none" }}>
          Catalogue
        </Link>
        <span>→</span>
        <span style={{ color: "#111827", fontWeight: 500 }}>{bien.localisation}</span>
      </div>

      <div className="bien-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, alignItems: "start" }}>
        
        {/* COLONNE PRINCIPALE */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          {/* Galerie photos */}
          <BienDetailGallery photos={bien.photos} localisation={bien.localisation} />

          {/* Informations principales */}
          <BienDetailInfo bien={bien} />

          {/* Détails supplémentaires */}
          <BienDetailSpecs bien={bien} />

          {/* Description */}
          {bien.descriptionCourte && (
            <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E5E7EB', padding: 24 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 12px' }}>Description</h2>
              <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7, margin: 0 }}>{bien.descriptionCourte}</p>
            </div>
          )}

          {/* Lien annonce */}
          {bien.lienAnnonce && (
            <a href={bien.lienAnnonce} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 20px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, color: '#A583F2', fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s ease' }}>
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
        <AgenceSidebar agence={bien.agence} />
      </div>
    </div>
  );
}
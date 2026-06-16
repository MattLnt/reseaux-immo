import Link from "next/link";
import AcheteurForm from "@/app/components/forms/AcheteurForm";

export default function NouvelAcheteurPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, fontSize: 13, color: "#9CA3AF" }}>
        <Link href="/dashboard/agence/mes-acheteurs" style={{ color: "#9CA3AF", textDecoration: "none" }}>
          Mes acheteurs
        </Link>
        <span>→</span>
        <span style={{ color: "#002B54", fontWeight: 600 }}>Nouvel acheteur</span>
      </div>

      <h1 style={{ fontSize: 26, fontWeight: 700, color: "#002B54", margin: "0 0 6px", letterSpacing: "-0.01em" }}>
        Encoder un nouvel acheteur
      </h1>
      <p style={{ fontSize: 14, color: "#5A6B7D", margin: "0 0 28px" }}>
        Renseignez les critères de recherche pour identifier les biens compatibles.
      </p>

      <AcheteurForm mode="create" />
    </div>
  );
}
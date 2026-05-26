import BienForm from "@/components/forms/BienForm";

export default function NouveauBienPage() {
  return (
    <div style={{ maxWidth: "100%" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
          Nouveau bien
        </h1>
        <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
          Ajoutez un bien à votre portefeuille pour le partager avec les autres agences
        </p>
      </div>

      <BienForm mode="create" />
    </div>
  );
}
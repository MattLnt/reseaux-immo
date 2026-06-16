"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function AcheteurActions({ acheteur }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function changeStatut(nouveauStatut) {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/acheteur/${acheteur.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...acheteur, statut: nouveauStatut }),
      });
      if (!res.ok) throw new Error("Erreur");
      router.refresh();
    } catch (err) {
      alert("Erreur lors du changement de statut");
    } finally {
      setLoading(false);
    }
  }

  async function deleteAcheteur() {
    if (!confirm("Supprimer définitivement cet acheteur ? Cette action est irréversible.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/acheteur/${acheteur.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur");
      router.push("/dashboard/agence/mes-acheteurs");
      router.refresh();
    } catch (err) {
      alert("Erreur lors de la suppression");
      setLoading(false);
    }
  }

  const statutOptions = [
    { value: "ACTIF", label: "Actif" },
    { value: "INACTIF", label: "Inactif" },
    { value: "TROUVE", label: "Bien trouvé" },
  ];

  return (
    <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E8EDF2", padding: 22 }}>
      {/* Modifier */}
      <Link href={`/dashboard/agence/mes-acheteurs/${acheteur.id}/edit`}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%", padding: "12px", borderRadius: 10, background: "#FF9500", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 14px rgba(255,149,0,0.3)", marginBottom: 14 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        Modifier
      </Link>

      {/* Statut */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Statut</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {statutOptions.map(opt => {
            const active = acheteur.statut === opt.value;
            return (
              <button key={opt.value} onClick={() => !active && changeStatut(opt.value)} disabled={loading || active}
                style={{
                  padding: "9px 12px",
                  borderRadius: 8,
                  border: `1.5px solid ${active ? "#FF9500" : "#E8EDF2"}`,
                  background: active ? "rgba(255,149,0,0.06)" : "#FFFFFF",
                  color: active ? "#FF9500" : "#5A6B7D",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: active ? "default" : (loading ? "wait" : "pointer"),
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}>
                {active && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Supprimer */}
      <button onClick={deleteAcheteur} disabled={loading}
        style={{ width: "100%", padding: "10px", borderRadius: 8, background: "transparent", border: "1px solid rgba(220,38,38,0.3)", color: "#B91C1C", fontSize: 13, fontWeight: 600, cursor: loading ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-2 14a2 2 0 01-2 2H9a2 2 0 01-2-2L5 6"/></svg>
        Supprimer
      </button>
    </div>
  );
}
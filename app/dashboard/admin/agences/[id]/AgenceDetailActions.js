"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ConfirmModal from "../ConfirmModal";

export default function AgenceDetailActions({ agence }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function activate() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/agence/${agence.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "activate" }),
      });
      if (!res.ok) throw new Error("Erreur");
      router.refresh();
    } catch (err) {
      alert("Erreur lors de l'activation");
    } finally {
      setLoading(false);
    }
  }

  async function confirmDeactivate() {
    setLoading(true);
    setShowConfirm(false);
    try {
      const res = await fetch(`/api/admin/agence/${agence.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deactivate" }),
      });
      if (!res.ok) throw new Error("Erreur");
      router.refresh();
    } catch (err) {
      alert("Erreur lors de la désactivation");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E8EDF2", padding: 22 }}>
        <h3 style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 16px" }}>
          Actions administrateur
        </h3>

        {!agence.isActive ? (
          <button onClick={activate} disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 10,
              background: "#10B981",
              color: "#fff",
              border: "none",
              fontSize: 13,
              fontWeight: 700,
              cursor: loading ? "wait" : "pointer",
              opacity: loading ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 4px 14px rgba(16,185,129,0.25)",
              marginBottom: 12,
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            {loading ? "Activation..." : "Valider l'inscription"}
          </button>
        ) : (
          <button onClick={() => setShowConfirm(true)} disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 10,
              background: "transparent",
              color: "#B91C1C",
              border: "1.5px solid rgba(220,38,38,0.3)",
              fontSize: 13,
              fontWeight: 700,
              cursor: loading ? "wait" : "pointer",
              opacity: loading ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginBottom: 12,
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            {loading ? "Désactivation..." : "Désactiver l'agence"}
          </button>
        )}

        <Link href="/dashboard/admin/agences"
          style={{
            display: "block",
            textAlign: "center",
            padding: "10px",
            borderRadius: 10,
            background: "#FFFFFF",
            border: "1px solid #E8EDF2",
            color: "#5A6B7D",
            fontSize: 13,
            fontWeight: 600,
            textDecoration: "none",
          }}>
          ← Retour à la liste
        </Link>
      </div>

      {/* Modal de confirmation pour désactivation */}
      {showConfirm && (
        <ConfirmModal
          agence={agence}
          onConfirm={confirmDeactivate}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
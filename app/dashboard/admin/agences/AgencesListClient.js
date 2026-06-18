"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ConfirmModal from "./ConfirmModal";

export default function AgencesListClient({ agences, counts }) {
  const router = useRouter();
  const [tab, setTab] = useState("enAttente"); // 'all' | 'enAttente' | 'actives'
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(null); // id de l'agence en cours d'action
  const [confirmModal, setConfirmModal] = useState(null); // { agence, action }

  // Filtrage selon l'onglet + recherche
  const filtered = useMemo(() => {
    let list = agences;

    // Filtre onglet
    if (tab === "enAttente") list = list.filter(a => !a.isActive);
    else if (tab === "actives") list = list.filter(a => a.isActive);

    // Filtre recherche
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(a =>
        a.nom.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        (a.adresse && a.adresse.toLowerCase().includes(q))
      );
    }

    return list;
  }, [agences, tab, search]);

  // Tabs config
  const tabs = [
    { key: "enAttente", label: "En attente", count: counts.enAttente, color: "#FF9500" },
    { key: "actives", label: "Actives", count: counts.actives, color: "#10B981" },
    { key: "all", label: "Toutes", count: counts.all, color: "#5A6B7D" },
  ];

  // Action d'activation (pas de confirm nécessaire — c'est positif)
  async function activate(agence) {
    setLoading(agence.id);
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
      setLoading(null);
    }
  }

  // Désactivation : ouverture modal de confirmation
  function askDeactivate(agence) {
    setConfirmModal({ agence, action: "deactivate" });
  }

  // Confirmation de désactivation
  async function confirmDeactivate() {
    if (!confirmModal) return;
    const agence = confirmModal.agence;
    setLoading(agence.id);
    setConfirmModal(null);
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
      setLoading(null);
    }
  }

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .agences-table-row { grid-template-columns: 1fr !important; padding: 16px !important; }
          .agences-table-col-hide-mobile { display: none !important; }
        }
        .agences-tab:hover { background: rgba(255,149,0,0.05) !important; }
      `}</style>

      {/* Onglets */}
      <div style={{ display: "flex", gap: 6, marginBottom: 20, borderBottom: "1px solid #E8EDF2", paddingBottom: 0, flexWrap: "wrap" }}>
        {tabs.map(t => {
          const active = tab === t.key;
          return (
            <button key={t.key} onClick={() => setTab(t.key)} className="agences-tab"
              style={{
                padding: "10px 16px",
                background: "transparent",
                border: "none",
                borderBottom: active ? `2.5px solid ${t.color}` : "2.5px solid transparent",
                marginBottom: -1,
                color: active ? t.color : "#5A6B7D",
                fontWeight: active ? 700 : 500,
                fontSize: 13.5,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.15s ease",
              }}>
              <span>{t.label}</span>
              <span style={{
                background: active ? t.color : "#F0F3F7",
                color: active ? "#FFFFFF" : "#5A6B7D",
                fontSize: 11,
                fontWeight: 700,
                padding: "2px 9px",
                borderRadius: 20,
                minWidth: 20,
                textAlign: "center",
              }}>
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Recherche */}
      <div style={{ marginBottom: 20, position: "relative", maxWidth: 400 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"
          style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par nom, email, adresse..."
          style={{
            width: "100%",
            padding: "11px 14px 11px 42px",
            borderRadius: 10,
            border: "1px solid #E8EDF2",
            fontSize: 13,
            background: "#FFFFFF",
            color: "#002B54",
            outline: "none",
            transition: "all 0.15s ease",
          }}
          onFocus={e => e.target.style.borderColor = "#FF9500"}
          onBlur={e => e.target.style.borderColor = "#E8EDF2"} />
      </div>

      {/* Liste */}
      {filtered.length === 0 ? (
        <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E8EDF2", padding: "60px 32px", textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(0,43,84,0.05)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#5A6B7D" strokeWidth="2"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>
          </div>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "#002B54", margin: "0 0 6px" }}>Aucune agence trouvée</h2>
          <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>
            {search ? "Modifiez votre recherche ou changez d'onglet." : "Aucune agence dans cette catégorie pour le moment."}
          </p>
        </div>
      ) : (
        <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E8EDF2", overflow: "hidden" }}>
          {/* Header tableau */}
          <div className="agences-table-row" style={{ display: "grid", gridTemplateColumns: "minmax(220px, 2fr) minmax(200px, 1.5fr) 110px 110px 220px", gap: 16, padding: "14px 20px", background: "#FAFDFD", borderBottom: "1px solid #E8EDF2", fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            <div>Agence</div>
            <div className="agences-table-col-hide-mobile">Email</div>
            <div className="agences-table-col-hide-mobile">Inscription</div>
            <div>Statut</div>
            <div style={{ textAlign: "right" }}>Actions</div>
          </div>

          {/* Lignes */}
          {filtered.map((a, i) => {
            const isLoading = loading === a.id;
            return (
              <div key={a.id} className="agences-table-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(220px, 2fr) minmax(200px, 1.5fr) 110px 110px 220px",
                  gap: 16,
                  padding: "16px 20px",
                  borderBottom: i === filtered.length - 1 ? "none" : "1px solid #F0F3F7",
                  alignItems: "center",
                  background: isLoading ? "#FAFDFD" : "#FFFFFF",
                  transition: "background 0.15s ease",
                }}>

                {/* Nom + adresse */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg, #002B54, #001B38)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
                    {a.nom[0]?.toUpperCase() || "?"}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <Link href={`/dashboard/admin/agences/${a.id}`}
                      style={{ display: "block", fontSize: 14, fontWeight: 700, color: "#002B54", textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {a.nom}
                    </Link>
                    <div style={{ fontSize: 11.5, color: "#9CA3AF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {a.adresse || "—"}
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="agences-table-col-hide-mobile" style={{ fontSize: 13, color: "#5A6B7D", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {a.email}
                </div>

                {/* Date */}
                <div className="agences-table-col-hide-mobile" style={{ fontSize: 12, color: "#9CA3AF" }}>
                  {new Date(a.createdAt).toLocaleDateString("fr-BE")}
                </div>

                {/* Statut */}
                <div>
                  {a.isActive ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(16,185,129,0.1)", color: "#10B981", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, letterSpacing: "0.04em" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
                      ACTIVE
                    </span>
                  ) : (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,149,0,0.1)", color: "#FF9500", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, letterSpacing: "0.04em" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF9500" }} />
                      EN ATTENTE
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
                  <Link href={`/dashboard/admin/agences/${a.id}`}
                    style={{ padding: "7px 12px", borderRadius: 8, background: "#FFFFFF", border: "1px solid #E8EDF2", color: "#002B54", fontSize: 12, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}>
                    Détails
                  </Link>
                  {!a.isActive ? (
                    <button onClick={() => activate(a)} disabled={isLoading}
                      style={{ padding: "7px 14px", borderRadius: 8, background: "#10B981", color: "#fff", border: "none", fontSize: 12, fontWeight: 700, cursor: isLoading ? "wait" : "pointer", opacity: isLoading ? 0.6 : 1, display: "inline-flex", alignItems: "center", gap: 5, boxShadow: "0 2px 8px rgba(16,185,129,0.25)" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      Valider
                    </button>
                  ) : (
                    <button onClick={() => askDeactivate(a)} disabled={isLoading}
                      style={{ padding: "7px 14px", borderRadius: 8, background: "transparent", color: "#B91C1C", border: "1px solid rgba(220,38,38,0.3)", fontSize: 12, fontWeight: 600, cursor: isLoading ? "wait" : "pointer", opacity: isLoading ? 0.6 : 1 }}>
                      Désactiver
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de confirmation */}
      {confirmModal && (
        <ConfirmModal
          agence={confirmModal.agence}
          onConfirm={confirmDeactivate}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </>
  );
}
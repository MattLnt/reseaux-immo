export default function FormRecap({ 
  form, 
  photos, 
  loading, 
  isFormValid, 
  mode = "create",
  deleting = false,
  statut,
  onToggleStatut,
  onDelete
}) {
  const recapItems = [
    { label: "Localisation", value: form.localisation || "—" },
    { label: "Prix", value: form.prix ? `${parseInt(form.prix).toLocaleString("fr-BE")} €` : "—" },
    { label: "Commission", value: form.tauxCommission ? `${form.tauxCommission}%` : "—" },
    { label: "Type", value: form.typeBien || "—" },
    { label: "État", value: form.etatBien || "—" },
    { label: "Chambres", value: form.nbrChambres || "—" },
    { label: "Surface", value: form.m2Habitable ? `${form.m2Habitable} m²` : "—" },
    { label: "PEB", value: form.peb || "—" },
    { label: "Photos", value: `${photos.length}` },
  ];

  const buttonText = mode === "edit" 
    ? (loading ? "Enregistrement..." : "Enregistrer")
    : (loading ? "Publication..." : "Publier le bien");

  return (
    <div style={{ position: 'sticky', top: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <style>{`
        @media (max-width: 1024px) {
          .form-recap-container { display: none !important; }
        }
      `}</style>

      <div className="form-recap-container" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Récapitulatif */}
        <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E8EDF2', padding: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: '#002B54', margin: '0 0 16px' }}>Récapitulatif</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {recapItems.map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '6px 0', borderBottom: '1px solid #F0F3F7' }}>
                <span style={{ fontSize: 12, color: '#9CA3AF' }}>{item.label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: item.value === "—" ? "#D1D5DB" : "#002B54", textAlign: 'right', maxWidth: 140 }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Info box */}
        <div style={{ background: '#FAFDFD', borderRadius: 12, border: '1px solid #E8EDF2', padding: 14 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <div style={{ color: '#FF9500', flexShrink: 0, marginTop: 1 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4M12 8h.01"/>
              </svg>
            </div>
            <p style={{ fontSize: 12, color: '#5A6B7D', margin: 0, lineHeight: 1.6 }}>
              {mode === "edit" 
                ? "Les modifications seront visibles par les autres agences du réseau."
                : "Les autres agences pourront voir ce bien et vous contacter pour recevoir des informations sur leurs acheteurs."}
            </p>
          </div>
        </div>

        {/* Bouton submit */}
        <button 
          type="submit" 
          disabled={loading || !isFormValid}
          style={{ 
            width: '100%', 
            padding: 13, 
            borderRadius: 8, 
            background: !isFormValid || loading ? '#E5E7EB' : '#FF9500', 
            color: !isFormValid || loading ? '#9CA3AF' : '#FFFFFF', 
            fontWeight: 700, 
            fontSize: 14, 
            border: 'none', 
            cursor: !isFormValid || loading ? 'not-allowed' : 'pointer', 
            transition: 'all 0.2s ease', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 8, 
            boxShadow: isFormValid && !loading ? '0 4px 14px rgba(255,149,0,0.25)' : 'none' 
          }}
        >
          {loading ? (
            buttonText
          ) : (
            <>
              {buttonText}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </>
          )}
        </button>

        {/* Actions supplémentaires — mode édition uniquement */}
        {mode === "edit" && (
          <>
            {/* Archiver / Réactiver */}
            <button 
              type="button" 
              onClick={onToggleStatut} 
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: 13, 
                borderRadius: 8, 
                background: '#FFFFFF', 
                border: '1.5px solid #E8EDF2', 
                color: '#002B54', 
                fontWeight: 600, 
                fontSize: 14, 
                cursor: loading ? 'not-allowed' : 'pointer', 
                transition: 'all 0.2s ease', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 8 
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18"/>
                <path d="M9 21V9"/>
              </svg>
              {statut === 'ACTIF' ? 'Archiver le bien' : 'Réactiver le bien'}
            </button>

            {/* Supprimer */}
            <button 
              type="button" 
              onClick={onDelete} 
              disabled={deleting}
              style={{ 
                width: '100%', 
                padding: 13, 
                borderRadius: 8, 
                background: '#FEF2F2', 
                border: '1.5px solid #FECACA', 
                color: '#DC2626', 
                fontWeight: 600, 
                fontSize: 14, 
                cursor: deleting ? 'not-allowed' : 'pointer', 
                transition: 'all 0.2s ease', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 8 
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
              </svg>
              {deleting ? 'Suppression...' : 'Supprimer le bien'}
            </button>

            {/* Statut actuel */}
            <div style={{ background: '#FAFDFD', borderRadius: 12, border: '1px solid #E8EDF2', padding: 14 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: statut === 'ACTIF' ? '#FF9500' : '#9CA3AF', flexShrink: 0 }} />
                <p style={{ fontSize: 12, color: '#5A6B7D', margin: 0 }}>
                  Statut : <strong style={{ color: '#002B54' }}>{statut === 'ACTIF' ? 'En ligne' : 'Archivé'}</strong>
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
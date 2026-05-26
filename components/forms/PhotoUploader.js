"use client";

export default function PhotoUploader({ photos, setPhotos, uploading, setUploading, setError }) {

  async function handlePhotoUpload(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (photos.length + files.length > 10) {
      setError("Maximum 10 photos");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/bien/upload', {
          method: 'POST',
          body: formData
        });

        if (!res.ok) throw new Error('Upload failed');

        const data = await res.json();
        return data.url;
      });

      const urls = await Promise.all(uploadPromises);
      setPhotos([...photos, ...urls]);
    } catch (err) {
      console.error('Upload error:', err);
      setError("Erreur lors de l'upload des photos");
    } finally {
      setUploading(false);
    }
  }

  function removePhoto(idx) {
    setPhotos(photos.filter((_, i) => i !== idx));
  }

  // Met la photo choisie en position 0 (= couverture)
  function setAsCover(idx) {
    if (idx === 0) return;
    const reordered = [...photos];
    const [chosen] = reordered.splice(idx, 1);
    reordered.unshift(chosen);
    setPhotos(reordered);
  }

  return (
    <div>
      <style>{`
        .photo-tile:hover .photo-cover-btn { opacity: 1; }
        .photo-cover-btn { opacity: 0; transition: opacity 0.15s ease; }
        @media (hover: none) { .photo-cover-btn { opacity: 1; } }
      `}</style>

      {/* Info couverture */}
      {photos.length > 0 && (
        <p style={{ fontSize: 12, color: "#9CA3AF", margin: "0 0 12px", display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="#FF9500" stroke="none"><path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z"/></svg>
          La première photo est l'image de couverture (affichée sur le catalogue).
        </p>
      )}

      {/* Grille photos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12, marginBottom: 12 }}>
        {photos.map((url, idx) => {
          const isCover = idx === 0;
          return (
            <div key={idx} className="photo-tile"
              style={{ position: 'relative', aspectRatio: '1', borderRadius: 8, overflow: 'hidden', border: isCover ? '2px solid #FF9500' : '1px solid #E8EDF2' }}>
              <img src={url} alt={`Photo ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

              {/* Badge couverture */}
              {isCover && (
                <div style={{ position: 'absolute', top: 6, left: 6, background: '#FF9500', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z"/></svg>
                  Couverture
                </div>
              )}

              {/* Bouton définir comme couverture (sur les autres photos) */}
              {!isCover && (
                <button type="button" onClick={() => setAsCover(idx)} className="photo-cover-btn"
                  style={{ position: 'absolute', bottom: 6, left: 6, right: 6, background: 'rgba(0,27,56,0.85)', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 8px', fontSize: 10.5, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2l3 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.9 21l1.2-6.8-5-4.9 6.9-1z"/></svg>
                  Couverture
                </button>
              )}

              {/* Supprimer */}
              <button type="button" onClick={() => removePhoto(idx)}
                style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,43,84,0.7)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                ×
              </button>
            </div>
          );
        })}
      </div>

      {/* Bouton upload */}
      <label style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 16px',
        borderRadius: 8,
        border: '1.5px dashed #C5D0DC',
        background: '#FAFDFD',
        color: '#5A6B7D',
        fontSize: 13,
        fontWeight: 600,
        cursor: uploading ? 'wait' : 'pointer',
        opacity: uploading ? 0.6 : 1
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        {uploading ? "Upload en cours..." : "Ajouter des photos"}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handlePhotoUpload}
          style={{ display: 'none' }}
          disabled={uploading || photos.length >= 10}
        />
      </label>
    </div>
  );
}
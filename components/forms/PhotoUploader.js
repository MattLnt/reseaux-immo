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

  return (
    <div>
      {/* Grille photos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12, marginBottom: 12 }}>
        {photos.map((url, idx) => (
          <div key={idx} style={{ position: 'relative', aspectRatio: '1', borderRadius: 8, overflow: 'hidden', border: '1px solid #E8EDF2' }}>
            <img src={url} alt={`Photo ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button 
              type="button" 
              onClick={() => removePhoto(idx)}
              style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,43,84,0.7)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}
            >
              ×
            </button>
          </div>
        ))}
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
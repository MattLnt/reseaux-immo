export default function BienDetailGallery({ photos, localisation }) {
  if (!photos || photos.length === 0) return null;

  return (
    <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E8EDF2', overflow: 'hidden' }}>
      <style>{`
        @media (max-width: 1024px) {
          .bien-photos-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      
      {/* Photo principale */}
      <div style={{ position: 'relative', width: '100%', height: 400, background: '#E8EDF2' }}>
        <img src={photos[0]} alt={localisation} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* Autres photos */}
      {photos.length > 1 && (
        <div className="bien-photos-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 2, padding: 2 }}>
          {photos.slice(1).map((photo, idx) => (
            <div key={idx} style={{ position: 'relative', aspectRatio: '1', background: '#E8EDF2', overflow: 'hidden' }}>
              <img src={photo} alt={`Photo ${idx + 2}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
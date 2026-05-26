export default function EmptyState({ title, description, icon }) {
  return (
    <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E5E7EB', padding: '80px 24px', textAlign: 'center' }}>
      <div style={{ width: 80, height: 80, borderRadius: 16, background: 'rgba(165,131,242,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: '#A583F2' }}>
        {icon || (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        )}
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
        {title}
      </h2>
      <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>
        {description}
      </p>
    </div>
  );
}
export default function FormSection({ icon, title, subtitle, children }) {
  return (
    <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E8EDF2', padding: 20, marginBottom: 12 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,149,0,0.1)', border: '1px solid rgba(255,149,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF9500', flexShrink: 0 }}>
          {icon}
        </div>
        <div>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#002B54', margin: 0 }}>{title}</h2>
          <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>{subtitle}</p>
        </div>
      </div>
      
      {/* Content */}
      {children}
    </div>
  );
}
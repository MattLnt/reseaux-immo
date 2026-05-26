export default function StatCard({ title, value, icon, color }) {
  const colors = {
    orange: { bg: 'rgba(255,149,0,0.2)', text: '#FF9500' },
    lightblue: { bg: 'rgba(133,168,249,0.2)', text: '#85A8F9' },
    blue: { bg: 'rgba(133,168,249,0.2)', text: '#85A8F9' },
  };

  const colorScheme = colors[color] || colors.orange;

  return (
    <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 14, padding: 20, border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </div>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: colorScheme.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colorScheme.text }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF', lineHeight: 1 }}>
        {value}
      </div>
    </div>
  );
}
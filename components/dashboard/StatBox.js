export default function StatBox({ value, label, color = "blue" }) {
  const colors = {
    blue: {
      bg: 'rgba(0,43,84,0.05)',
      border: 'rgba(0,43,84,0.15)',
      text: '#002B54'
    },
    orange: {
      bg: 'rgba(255,149,0,0.06)',
      border: 'rgba(255,149,0,0.2)',
      text: '#FF9500'
    },
    lightblue: {
      bg: 'rgba(133,168,249,0.08)',
      border: 'rgba(133,168,249,0.25)',
      text: '#5A7FE0'
    }
  };

  const style = colors[color] || colors.blue;

  return (
    <div style={{ 
      padding: 16, 
      background: style.bg, 
      borderRadius: 12, 
      border: `1px solid ${style.border}` 
    }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: style.text, marginBottom: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: '#5A6B7D' }}>
        {label}
      </div>
    </div>
  );
}
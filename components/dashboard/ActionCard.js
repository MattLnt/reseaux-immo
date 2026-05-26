import Link from 'next/link';

export default function ActionCard({ href, icon, title, subtitle, primary = false }) {
  return (
    <Link 
      href={href}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 12, 
        padding: '16px 20px', 
        background: primary ? '#FF9500' : '#FAFDFD', 
        color: primary ? '#FFFFFF' : '#002B54', 
        borderRadius: 12, 
        textDecoration: 'none', 
        transition: 'all 0.2s ease',
        border: primary ? 'none' : '1px solid #E8EDF2'
      }}
    >
      <div style={{ 
        width: 40, 
        height: 40, 
        borderRadius: 10, 
        background: primary ? 'rgba(255,255,255,0.2)' : '#FFFFFF', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flexShrink: 0,
        color: primary ? '#FFFFFF' : '#FF9500',
        border: primary ? 'none' : '1px solid #E8EDF2'
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 12, color: primary ? 'rgba(255,255,255,0.9)' : '#5A6B7D' }}>
          {subtitle}
        </div>
      </div>
    </Link>
  );
}
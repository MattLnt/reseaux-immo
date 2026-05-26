import Link from 'next/link';

export default function DashboardSection({ title, href, children }) {
  return (
    <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E8EDF2', padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#002B54', margin: 0 }}>
          {title}
        </h2>
        {href && (
          <Link href={href} style={{ fontSize: 13, fontWeight: 600, color: '#FF9500', textDecoration: 'none' }}>
            Voir tout →
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}
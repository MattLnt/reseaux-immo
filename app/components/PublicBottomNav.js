"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    key: "accueil",
    href: "/",
    label: "Accueil",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#FF9500" : "rgba(255,255,255,0.35)"} strokeWidth={active ? 2.5 : 2}>
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    key: "tarifs",
    href: "/tarifs",
    label: "Tarifs",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#FF9500" : "rgba(255,255,255,0.35)"} strokeWidth={active ? 2.5 : 2}>
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 6v12M9 9h4.5a1.5 1.5 0 010 3H9m0 0h4.5a1.5 1.5 0 010 3H9"/>
      </svg>
    ),
  },
  {
    key: "commencer",
    href: "/register",
    label: "Commencer",
    primary: true,
    icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    ),
  },
  {
    key: "faq",
    href: "/faq",
    label: "FAQ",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#FF9500" : "rgba(255,255,255,0.35)"} strokeWidth={active ? 2.5 : 2}>
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    key: "connexion",
    href: "/login",
    label: "Connexion",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? "#FF9500" : "rgba(255,255,255,0.35)"} strokeWidth={active ? 2.5 : 2}>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

export default function PublicBottomNav() {
  const pathname = usePathname();

  const getActiveKey = () => {
    if (pathname === "/") return "accueil";
    if (pathname.startsWith("/tarifs")) return "tarifs";
    if (pathname.startsWith("/faq")) return "faq";
    if (pathname.startsWith("/login")) return "connexion";
    return null;
  };

  const activeKey = getActiveKey();

  return (
    <>
      <style>{`
        .public-bottom-nav { display: none; }
        .public-bottom-nav-spacer { display: none; }
        @media (max-width: 1024px) {
          .public-bottom-nav { display: flex; }
          .public-bottom-nav-spacer { display: block; }
        }
      `}</style>

      <div className="public-bottom-nav-spacer" style={{ height: 72 }} />

      <nav className="public-bottom-nav" style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 150,
        background: "rgba(0,27,56,0.97)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        height: 72,
        alignItems: "center",
        justifyContent: "space-around",
        paddingBottom: "env(safe-area-inset-bottom)",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.2)",
      }}>
        {NAV_ITEMS.map(item => {
          const active = activeKey === item.key;
          if (item.primary) {
            return (
              <Link key={item.key} href={item.href} style={{
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                background: "#FF9500", borderRadius: 16, padding: "10px 16px",
                textDecoration: "none", gap: 3,
                boxShadow: "0 4px 20px rgba(255,149,0,0.35)",
              }}>
                {item.icon(false)}
                <span style={{ fontSize: 9, fontWeight: 700, color: "#fff", letterSpacing: "0.03em" }}>{item.label}</span>
              </Link>
            );
          }
          return (
            <Link key={item.key} href={item.href} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              textDecoration: "none", padding: "6px 10px", borderRadius: 12, flex: 1,
              position: "relative",
            }}>
              {item.icon(active)}
              <span style={{
                fontSize: 10, fontWeight: active ? 700 : 500,
                color: active ? "#FF9500" : "rgba(255,255,255,0.35)",
                letterSpacing: "0.01em", whiteSpace: "nowrap",
              }}>
                {item.label}
              </span>
              {active && (
                <div style={{
                  position: "absolute", bottom: 2,
                  width: 4, height: 4, borderRadius: "50%",
                  background: "#FF9500",
                }} />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
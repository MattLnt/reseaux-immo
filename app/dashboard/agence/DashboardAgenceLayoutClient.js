'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default function DashboardAgenceLayoutClient({ children, session }) {
  const [collapsed, setCollapsed] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch('/api/messages/unread')
        if (!res.ok) return
        const data = await res.json()
        setUnreadCount(data.count)
      } catch (error) {}
    }
    fetchUnread()
    const interval = setInterval(fetchUnread, 10000)
    return () => clearInterval(interval)
  }, [])

  const menuItems = [
    {
      section: 'PRINCIPAL',
      items: [
        { href: '/dashboard/agence', label: 'Tableau de bord', shortLabel: 'Dashboard', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> },
        { href: '/dashboard/agence/mes-biens', label: 'Mes biens', shortLabel: 'Mes biens', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
        { href: '/dashboard/agence/catalogue', label: 'Catalogue', shortLabel: 'Catalogue', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg> },
        { href: '/dashboard/agence/contacts', label: 'Contacts', shortLabel: 'Contacts', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
      ]
    },
    {
      section: 'COMMUNICATION',
      items: [
        { href: '/dashboard/agence/messages', label: 'Messages', shortLabel: 'Messages', badge: unreadCount, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> },
      ]
    },
    {
      section: 'COMPTE',
      items: [
        { href: '/dashboard/agence/profil', label: 'Mon profil agence', shortLabel: 'Profil', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
        { href: '/dashboard/agence/mot-de-passe', label: 'Mot de passe', shortLabel: 'Sécurité', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> },
        { href: '/dashboard/agence/supprimer', label: 'Supprimer le compte', shortLabel: 'Supprimer', danger: true, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 6h18"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg> },
      ]
    },
  ]

  const allItems = menuItems.flatMap(g => g.items)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#EAEAEA' }}>
      <style>{`
        @media (max-width: 1024px) {
          .agence-desktop { display: none !important; }
          .agence-main { padding: 20px 16px 90px !important; margin-left: 0 !important; }
        }
        @media (min-width: 1025px) { .agence-mobile { display: none !important; } }
        .agence-nav-item:hover { background: rgba(255, 149, 0, 0.12) !important; }
        .agence-bottomnav::-webkit-scrollbar { display: none; }
        .agence-bottomnav { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* SIDEBAR DESKTOP - FIXE */}
      <aside className="agence-desktop" style={{ width: collapsed ? 68 : 240, background: '#001B38', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, overflowY: 'auto', overflowX: 'hidden', transition: 'width 0.25s ease', zIndex: 50 }}>
        <div style={{ padding: collapsed ? '20px 0' : '20px 20px', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', minHeight: 64 }}>
          {!collapsed && (
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                Réseaux <span style={{ color: '#FF9500' }}>Immo</span>
              </div>
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: 6, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
        {!collapsed && (
          <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FF9500', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#FFFFFF', flexShrink: 0 }}>
              {session?.user?.email?.[0]?.toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: 12, color: '#F9FAFB', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session?.user?.email}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>Agence</div>
            </div>
          </div>
        )}
        <nav style={{ flex: 1, padding: collapsed ? '12px 8px' : '12px 12px', overflowY: 'auto' }}>
          {menuItems.map((group) => (
            <div key={group.section} style={{ marginBottom: 24 }}>
              {!collapsed && <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', padding: '0 8px', marginBottom: 6 }}>{group.section}</div>}
              {group.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link key={item.href} href={item.href} className="agence-nav-item" title={collapsed ? item.label : ''}
                    style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10, justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '10px 0' : '9px 10px', borderRadius: 8, marginBottom: 2, textDecoration: 'none', background: isActive ? 'rgba(255, 149, 0, 0.15)' : 'transparent', color: item.danger ? '#F87171' : isActive ? '#FF9500' : 'rgba(255,255,255,0.6)', fontWeight: isActive ? 600 : 400, fontSize: 13, transition: 'all 0.15s ease', position: 'relative', borderLeft: isActive && !collapsed ? '2px solid #FF9500' : '2px solid transparent' }}>
                    <span style={{ flexShrink: 0, display: 'flex', color: item.danger ? '#F87171' : isActive ? '#FF9500' : 'rgba(255,255,255,0.5)' }}>{item.icon}</span>
                    {!collapsed && <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>}
                    {!collapsed && item.badge > 0 && <span style={{ background: '#FF9500', color: '#FFFFFF', fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 20, flexShrink: 0 }}>{item.badge}</span>}
                    {collapsed && item.badge > 0 && <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: '50%', background: '#FF9500' }} />}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
        <div style={{ padding: collapsed ? '12px 8px' : '12px 12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="agence-nav-item"
            style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10, justifyContent: collapsed ? 'center' : 'flex-start', width: '100%', padding: collapsed ? '10px 0' : '9px 10px', borderRadius: 8, background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 13, cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* CONTENU - AVEC MARGIN-LEFT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: '100vh', marginLeft: collapsed ? 68 : 240, transition: 'margin-left 0.25s ease' }} className="agence-content-wrapper">

        <main className="agence-main" style={{ flex: 1, padding: '36px 40px', minWidth: 0 }}>
          {children}
        </main>
      </div>

      {/* BOTTOM NAV MOBILE */}
      <div className="agence-mobile" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#001B38', borderTop: '1px solid rgba(255,255,255,0.1)', zIndex: 50, paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="agence-bottomnav" style={{ display: 'flex', overflowX: 'auto', height: 64, alignItems: 'center', padding: '0 4px' }}>
          {allItems.map(item => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', padding: '6px 10px', flexShrink: 0, minWidth: 52, position: 'relative' }}>
                <span style={{ color: isActive ? '#FF9500' : item.danger ? '#F87171' : 'rgba(255,255,255,0.4)' }}>{item.icon}</span>
                <span style={{ fontSize: 9, fontWeight: isActive ? 700 : 500, color: isActive ? '#FF9500' : 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>{item.shortLabel}</span>
                {isActive && <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#FF9500' }} />}
                {item.badge > 0 && !isActive && <div style={{ position: 'absolute', top: 4, right: 8, width: 7, height: 7, borderRadius: '50%', background: '#FF9500' }} />}
              </Link>
            )
          })}
          <button onClick={() => signOut({ callbackUrl: '/login' })} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', padding: '6px 10px', flexShrink: 0, minWidth: 52 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>Quitter</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          }
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const menuItems = [
  {
    section: 'ADMINISTRATION',
    items: [
      {
        href: '/dashboard/admin',
        label: 'Tableau de bord',
        shortLabel: 'Dashboard',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
      },
      {
        href: '/dashboard/admin/agences',
        label: 'Agences',
        shortLabel: 'Agences',
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>,
      },
    ],
  },
]

const allItems = menuItems.flatMap(g => g.items)

export default function AdminLayoutClient({ children, session }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const isActiveItem = (href) => {
    if (href === '/dashboard/admin') return pathname === '/dashboard/admin'
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#EAEAEA' }}>
      <style>{`
        @media (max-width: 1024px) {
          .adm-desktop { display: none !important; }
          .adm-main { padding: 20px 16px 90px !important; margin-left: 0 !important; }
        }
        @media (min-width: 1025px) { .adm-mobile { display: none !important; } }
        .adm-nav-item:hover { background: rgba(255, 149, 0, 0.12) !important; }
        .adm-bottomnav::-webkit-scrollbar { display: none; }
        .adm-bottomnav { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* SIDEBAR DESKTOP */}
      <aside className="adm-desktop" style={{
        width: collapsed ? 68 : 240,
        background: '#001B38',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        transition: 'width 0.25s ease',
        zIndex: 50,
      }}>
        {/* Logo + toggle */}
        <div style={{ padding: collapsed ? '20px 0' : '20px 20px', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', minHeight: 64 }}>
          {!collapsed && (
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <img src="/logo-white.svg" alt="OnShare" style={{ height: 58, width: 'auto', display: 'block' }} />
              <div style={{ fontSize: 9, color: '#FF9500', fontWeight: 700, letterSpacing: '0.12em' }}>ADMINISTRATION</div>
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: 6, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>

        {/* Badge admin */}
        {!collapsed && (
          <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,149,0,0.15)', color: '#FF9500', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, letterSpacing: '0.04em' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF9500' }} />
              ACCÈS ADMIN
            </span>
          </div>
        )}

        {/* Profil admin */}
        {!collapsed && session?.user?.email && (
          <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FF9500', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#FFFFFF', flexShrink: 0 }}>
              {session.user.email[0].toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: 12, color: '#F9FAFB', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{session.user.email}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>Administrateur</div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav style={{ flex: 1, padding: collapsed ? '12px 8px' : '12px 12px', overflowY: 'auto' }}>
          {menuItems.map((group) => (
            <div key={group.section} style={{ marginBottom: 24 }}>
              {!collapsed && <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', padding: '0 8px', marginBottom: 6 }}>{group.section}</div>}
              {group.items.map((item) => {
                const isActive = isActiveItem(item.href)
                return (
                  <Link key={item.href} href={item.href} className="adm-nav-item" title={collapsed ? item.label : ''}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: collapsed ? 0 : 10,
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      padding: collapsed ? '10px 0' : '9px 10px',
                      borderRadius: 8,
                      marginBottom: 2,
                      textDecoration: 'none',
                      background: isActive ? 'rgba(255, 149, 0, 0.15)' : 'transparent',
                      color: isActive ? '#FF9500' : 'rgba(255,255,255,0.6)',
                      fontWeight: isActive ? 600 : 400,
                      fontSize: 13,
                      transition: 'all 0.15s ease',
                      position: 'relative',
                      borderLeft: isActive && !collapsed ? '2px solid #FF9500' : '2px solid transparent',
                    }}>
                    <span style={{ flexShrink: 0, display: 'flex', color: isActive ? '#FF9500' : 'rgba(255,255,255,0.5)' }}>{item.icon}</span>
                    {!collapsed && <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Déconnexion */}
        <div style={{ padding: collapsed ? '12px 8px' : '12px 12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="adm-nav-item"
            style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10, justifyContent: collapsed ? 'center' : 'flex-start', width: '100%', padding: collapsed ? '10px 0' : '9px 10px', borderRadius: 8, background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 13, cursor: 'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* CONTENU */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: '100vh', marginLeft: collapsed ? 68 : 240, transition: 'margin-left 0.25s ease' }}>
        <main className="adm-main" style={{ flex: 1, padding: '36px 40px', minWidth: 0 }}>
          {children}
        </main>
      </div>

      {/* BOTTOM NAV MOBILE */}
      <div className="adm-mobile" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#001B38', borderTop: '1px solid rgba(255,255,255,0.1)', zIndex: 50, paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="adm-bottomnav" style={{ display: 'flex', overflowX: 'auto', height: 64, alignItems: 'center', padding: '0 4px', justifyContent: 'center' }}>
          {allItems.map(item => {
            const isActive = isActiveItem(item.href)
            return (
              <Link key={item.href} href={item.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', padding: '6px 14px', flexShrink: 0, minWidth: 60, position: 'relative' }}>
                <span style={{ color: isActive ? '#FF9500' : 'rgba(255,255,255,0.4)' }}>{item.icon}</span>
                <span style={{ fontSize: 9, fontWeight: isActive ? 700 : 500, color: isActive ? '#FF9500' : 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>{item.shortLabel}</span>
                {isActive && <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 4, height: 4, borderRadius: '50%', background: '#FF9500' }} />}
              </Link>
            )
          })}
          <button onClick={() => signOut({ callbackUrl: '/login' })} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', padding: '6px 14px', flexShrink: 0, minWidth: 60 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>Quitter</span>
          </button>
        </div>
      </div>
    </div>
  )
}
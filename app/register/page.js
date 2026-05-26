'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterAgencePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ 
    email: '', 
    password: '', 
    nomAgence: '', 
    adresse: '', 
    telephone: '' 
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const conditions = [
    { label: '9 car.', ok: form.password.length >= 9 },
    { label: 'MAJ', ok: /[A-Z]/.test(form.password) },
    { label: '123', ok: /[0-9]/.test(form.password) },
    { label: '!@#', ok: /[^A-Za-z0-9]/.test(form.password) },
  ]
  const allValid = conditions.every(c => c.ok) && form.nomAgence && form.adresse && form.telephone

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!allValid) { setError('Veuillez remplir tous les champs obligatoires.'); return }
    setLoading(true); setError('')
    
    const res = await fetch('/api/register', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ ...form, role: 'AGENCE' }) 
    })
    
    const data = await res.json()
    setLoading(false)
    
    if (!res.ok) { 
      setError(data.message || 'Une erreur est survenue')
      return 
    }
    
    setSuccess(true)
  }

  const inputStyle = { 
    width: '100%', 
    border: '1.5px solid #E8EDF2', 
    borderRadius: 8, 
    padding: '10px 12px 10px 36px', 
    fontSize: 13, 
    color: '#002B54', 
    outline: 'none', 
    boxSizing: 'border-box', 
    background: '#FAFDFD', 
    transition: 'all 0.2s ease' 
  }

  if (success) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#002B54', padding: 24 }}>
        <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 40, maxWidth: 440, textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,149,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#002B54', margin: '0 0 10px' }}>Demande envoyée !</h2>
          <p style={{ fontSize: 14, color: '#5A6B7D', lineHeight: 1.6, margin: '0 0 24px' }}>
            Vous recevrez un email dès validation par un administrateur.
          </p>
          <Link href="/" style={{ display: 'inline-block', background: '#FF9500', color: '#FFFFFF', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            Retour à l'accueil
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#002B54', padding: 20, position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .register-grid { grid-template-columns: 1fr !important; }
          .register-hero { display: none !important; }
        }
      `}</style>

      {/* Cercles décoratifs */}
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,149,0,0.08)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-100px', left: '-100px', width: 400, height: 400, borderRadius: '50%', background: 'rgba(133,168,249,0.1)', pointerEvents: 'none' }} />

      <div className="register-grid" style={{ width: '100%', maxWidth: 1100, display: 'grid', gridTemplateColumns: '440px 1fr', gap: 32, alignItems: 'center', position: 'relative', zIndex: 1 }}>
        
        {/* Colonne gauche : Formulaire */}
        <div style={{ background: '#FFFFFF', borderRadius: 20, padding: '32px 28px', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,149,0,0.1)', border: '1px solid rgba(255,149,0,0.25)', borderRadius: 16, padding: '4px 10px', marginBottom: 12 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#FF9500' }} />
              <span style={{ fontSize: 11, color: '#CC7700', fontWeight: 600 }}>Agence Partenaire</span>
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#002B54', margin: '0 0 6px', letterSpacing: '-0.01em' }}>
              Rejoignez le réseau
            </h2>
            <p style={{ fontSize: 12, color: '#5A6B7D', margin: 0 }}>
              Validation sous 24h
            </p>
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', fontSize: 12, borderRadius: 8, padding: '10px 12px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Nom de l'agence</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                </div>
                <input type="text" name="nomAgence" value={form.nomAgence} onChange={handleChange} required placeholder="Ex: Immo Solutions" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#FF9500'} onBlur={e => e.target.style.borderColor = '#E8EDF2'} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Adresse</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <input type="text" name="adresse" value={form.adresse} onChange={handleChange} required placeholder="Rue, CP, Ville" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#FF9500'} onBlur={e => e.target.style.borderColor = '#E8EDF2'} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Téléphone</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                  </div>
                  <input type="tel" name="telephone" value={form.telephone} onChange={handleChange} required placeholder="+32 2 123 45 67" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#FF9500'} onBlur={e => e.target.style.borderColor = '#E8EDF2'} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  </div>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="contact@agence.be" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#FF9500'} onBlur={e => e.target.style.borderColor = '#E8EDF2'} />
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                </div>
                <input type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required placeholder="••••••••••"
                  style={{ ...inputStyle, paddingRight: 38 }}
                  onFocus={e => e.target.style.borderColor = '#FF9500'} onBlur={e => e.target.style.borderColor = '#E8EDF2'} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#9CA3AF' }}>
                  {showPassword
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                </button>
              </div>
              {form.password.length > 0 && (
                <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {conditions.map((cond, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 12, height: 12, borderRadius: '50%', flexShrink: 0, background: cond.ok ? 'rgba(255,149,0,0.12)' : '#F3F4F6', border: '1.5px solid ' + (cond.ok ? '#FF9500' : '#E8EDF2'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {cond.ok && <svg width="7" height="7" viewBox="0 0 12 12" fill="none" stroke="#FF9500" strokeWidth="2.5"><path d="M2 6l3 3 5-5"/></svg>}
                      </div>
                      <span style={{ fontSize: 10, color: cond.ok ? '#CC7700' : '#9CA3AF', fontWeight: cond.ok ? 600 : 400 }}>{cond.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" disabled={!allValid || loading}
              style={{ width: '100%', background: !allValid || loading ? '#E5E7EB' : '#FF9500', color: '#FFFFFF', fontWeight: 700, padding: 12, borderRadius: 8, border: 'none', cursor: !allValid || loading ? 'not-allowed' : 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 6 }}>
              {loading
                ? <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Envoi...</>
                : 'Envoyer ma demande'}
            </button>

            <p style={{ fontSize: 10, color: '#9CA3AF', textAlign: 'center', margin: '6px 0 0' }}>
              En créant un compte, vous acceptez nos <Link href="/cgv" style={{ color: '#FF9500', fontWeight: 600, textDecoration: 'none' }}>CGV</Link>
            </p>
          </form>

          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #F3F4F6', textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: '#5A6B7D', margin: 0 }}>
              Déjà un compte ? <Link href="/login" style={{ color: '#FF9500', fontWeight: 600, textDecoration: 'none' }}>Se connecter</Link>
            </p>
          </div>
        </div>

        {/* Colonne droite : Hero */}
        <div className="register-hero">
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 24 }}>
            <h1 style={{ fontSize: 48, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em', margin: 0 }}>
              Réseaux <span style={{ color: '#FF9500' }}>Immo</span>
            </h1>
          </Link>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2, margin: '0 0 16px', letterSpacing: '-0.01em' }}>
            Le réseau de co-courtage<br />immobilier belge
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: '0 0 32px', maxWidth: 480 }}>
            Partagez vos mandats exclusifs avec d'autres agences et multipliez vos opportunités de vente.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, title: 'Encodez vos biens', desc: 'avec taux de commission' },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>, title: 'Accédez au catalogue', desc: 'des autres agences' },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>, title: 'Recevez des contacts', desc: "d'acheteurs qualifiés" },
              { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>, title: 'Abonnement simple', desc: '299 euros/mois HTVA' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 8, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FF9500', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#FFFFFF', marginBottom: 2 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 32, position: 'relative', zIndex: 1 }}>
        © 2026 Réseaux Immo · Belgique
      </p>
    </main>
  )
}
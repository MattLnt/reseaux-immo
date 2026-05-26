'use client'

import { useState, useEffect } from 'react'
import {
  AreaChart, Area,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const FILTERS = [
  { key: '7d',    label: '7 jours' },
  { key: 'month', label: 'Ce mois' },
  { key: '6m',    label: '6 mois' },
  { key: '12m',   label: '12 mois' },
]

export default function EmployeurCharts({ months }) {
  const [filter, setFilter] = useState('7d')
  const [viewData, setViewData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch('/api/employeur/profile-views?filter=' + filter)
      .then(r => r.json())
      .then(d => { setViewData(d.data || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [filter])

  const totalVues = viewData.reduce((s, d) => s + d.vues, 0)

  return (
    <>
      <style>{`
        @media (max-width: 1024px) {
          .emp-charts-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="emp-charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* Candidatures par mois */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px' }}>
            Candidatures — 6 derniers mois
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={months} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              <Line type="monotone" dataKey="candidatures" stroke="#249E7C" strokeWidth={2.5} dot={{ r: 4, fill: '#249E7C' }} name="Candidatures" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Vues du profil */}
        <div style={{ background: 'white', borderRadius: '14px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <p style={{ fontSize: '11px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
              Vues du profil entreprise
            </p>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1A1E49' }}>
              {totalVues} vue{totalVues !== 1 ? 's' : ''}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 600,
                  background: filter === f.key ? '#1A1E49' : '#f3f4f6',
                  color: filter === f.key ? 'white' : '#6b7280',
                  transition: 'all 0.15s'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '13px' }}>
              Chargement…
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={viewData} margin={{ top: 0, right: 4, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="vuesGradientEmp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#249E7C" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#249E7C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                  formatter={(v) => [v, 'Vues']}
                />
                <Area type="monotone" dataKey="vues" stroke="#249E7C" strokeWidth={2} fill="url(#vuesGradientEmp)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </>
  )
}
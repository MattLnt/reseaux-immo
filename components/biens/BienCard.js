"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function BienCard({ bien }) {
  const [photoIndex, setPhotoIndex] = useState(0);

  const commissionTotale = (bien.prix * bien.tauxCommission) / 100;
  const part = bien.partRetrocedee ?? 30;
  const montantRetrocede = commissionTotale * (part / 100);
  const fmt = (n) => Math.round(n).toLocaleString('fr-BE');

  const photos = bien.photos || [];
  const hasPhotos = photos.length > 0;
  const hasMultiple = photos.length > 1;

  function changePhoto(e, direction) {
    e.preventDefault();
    e.stopPropagation();
    setPhotoIndex(prev => {
      const next = prev + direction;
      if (next < 0) return photos.length - 1;
      if (next >= photos.length) return 0;
      return next;
    });
  }

  function goToPhoto(e, idx) {
    e.preventDefault();
    e.stopPropagation();
    setPhotoIndex(idx);
  }

  return (
    <Link href={`/dashboard/agence/catalogue/${bien.id}`} style={{ textDecoration: 'none' }}>
      <div className="bien-card" style={{
        background: '#FFFFFF', borderRadius: 16, border: '1px solid #E8EDF2',
        overflow: 'hidden', transition: 'all 0.2s ease', cursor: 'pointer',
        height: '100%', display: 'flex', flexDirection: 'column',
      }}>
        <style>{`
          .bien-card:hover .card-arrow { opacity: 1; }
          .card-arrow { opacity: 0; transition: opacity 0.18s ease; }
          @media (hover: none) { .card-arrow { opacity: 1; } }
        `}</style>

        {/* Image / carrousel */}
        <div style={{ height: 210, background: '#E8EDF2', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
          {hasPhotos ? (
            // Bande de toutes les photos, qu'on translate
            <div style={{
              display: 'flex',
              height: '100%',
              width: `${photos.length * 100}%`,
              transform: `translateX(-${photoIndex * (100 / photos.length)}%)`,
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
              {photos.map((photo, idx) => (
                <div key={idx} style={{ width: `${100 / photos.length}%`, height: '100%', flexShrink: 0 }}>
                  <img src={photo} alt={`${bien.localisation} ${idx + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} draggable={false} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
            </div>
          )}

          {/* Flèches — visibles au survol uniquement */}
          {hasMultiple && (
            <>
              <button className="card-arrow" onClick={(e) => changePhoto(e, -1)}
                style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,43,84,0.2)', zIndex: 2 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#002B54" strokeWidth="3"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button className="card-arrow" onClick={(e) => changePhoto(e, 1)}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.95)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,43,84,0.2)', zIndex: 2 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#002B54" strokeWidth="3"><path d="M9 18l6-6-6-6"/></svg>
              </button>

              {/* Points indicateurs — toujours visibles */}
              <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5, alignItems: 'center', zIndex: 2 }}>
                {photos.slice(0, 6).map((_, idx) => (
                  <button key={idx} onClick={(e) => goToPhoto(e, idx)}
                    style={{
                      width: idx === photoIndex ? 7 : 6, height: idx === photoIndex ? 7 : 6,
                      borderRadius: '50%', border: 'none', padding: 0, cursor: 'pointer',
                      background: idx === photoIndex ? '#FFFFFF' : 'rgba(255,255,255,0.55)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.35)',
                      transition: 'all 0.15s ease',
                    }} />
                ))}
              </div>
            </>
          )}

          {/* Badge type — en haut à gauche */}
          <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,27,56,0.85)', color: '#fff', padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: '0.03em', zIndex: 2 }}>
            {bien.typeBien}
          </div>

          {/* Badge PEB — en haut à droite */}
          {bien.peb && (
            <div style={{ position: 'absolute', top: 12, right: 12, background: '#FFFFFF', padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, color: '#002B54', boxShadow: '0 2px 8px rgba(0,43,84,0.12)', zIndex: 2 }}>
              PEB {bien.peb.replace('_PLUS', '+').replace('_', '')}
            </div>
          )}
        </div>

        {/* Contenu */}
        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', flex: 1 }}>

          {/* Titre + prix */}
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#002B54', margin: '0 0 8px', lineHeight: 1.3 }}>
              {bien.localisation}
            </h3>
            <div style={{ fontSize: 25, fontWeight: 700, color: '#FF9500' }}>
              {fmt(bien.prix)} €
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #F0F3F7' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, color: '#5A6B7D' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              </svg>
              <span style={{ fontWeight: 700, color: '#002B54' }}>{bien.nbrChambres}</span> ch.
            </div>
            {bien.nbrSdb != null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, color: '#5A6B7D' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="15" rx="2"/><path d="M12 2v5"/>
                </svg>
                <span style={{ fontWeight: 700, color: '#002B54' }}>{bien.nbrSdb}</span> sdb
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, color: '#5A6B7D' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
              </svg>
              <span style={{ fontWeight: 700, color: '#002B54' }}>{bien.m2Habitable}</span> m²
            </div>
          </div>

          {/* Carte rétrocession */}
          <div style={{ background: 'rgba(255,149,0,0.08)', border: '1px solid rgba(255,149,0,0.25)', borderRadius: 12, padding: '12px 14px', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="2"><path d="M4 10h12"/><path d="M4 14h9"/><path d="M19 6a7.7 7.7 0 00-5.2-2A7.9 7.9 0 006 12c0 4.4 3.5 8 7.8 8a7.7 7.7 0 005.2-2"/></svg>
                <span style={{ fontSize: 12, color: '#5A6B7D', fontWeight: 600 }}>Si vous apportez l'acheteur</span>
              </div>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#FF9500' }}>{fmt(montantRetrocede)} €</span>
            </div>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
              {part}% de la commission · {bien.tauxCommission}% · {fmt(commissionTotale)} €
            </div>
          </div>

          {/* Agence — collé en bas */}
          <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid #F0F3F7', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#002B54', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#FFFFFF', flexShrink: 0 }}>
              {bien.agence.nom[0].toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#002B54', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {bien.agence.nom}
              </div>
              <div style={{ fontSize: 11, color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {bien.agence.adresse}
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="2.5" style={{ flexShrink: 0 }}>
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

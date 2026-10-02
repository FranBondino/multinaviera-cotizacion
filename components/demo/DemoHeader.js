'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Ship, 
  Radio, 
  Calendar, 
  ShieldCheck, 
  ExternalLink,
  Anchor,
  Layers
} from 'lucide-react';

export default function DemoHeader({ activePreset, onSelectPreset, presets = [] }) {
  return (
    <header className="glass-panel" style={{
      marginBottom: '1.75rem',
      padding: '1.25rem 1.75rem',
      background: 'linear-gradient(180deg, rgba(13, 20, 36, 0.95) 0%, rgba(10, 16, 29, 0.95) 100%)',
      borderColor: 'var(--border-subtle)',
    }}>
      {/* Top Bar: Title, Live Status Badge, and Switch to Production */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(6, 182, 212, 0.05) 100%)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)',
          }}>
            <Ship size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                color: 'var(--text-main)',
                margin: 0,
                textTransform: 'uppercase',
              }}>
                ALMAR ROSARIO <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>//</span> COTIZADOR MARÍTIMO
              </h1>
            </div>
            <p style={{
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              margin: '0.15rem 0 0 0',
            }}>
              Agencia Marítima & Forwarder Internacional · Córdoba 1452 Piso 8, Rosario · CUIT 30-71458921-9
            </p>
          </div>
        </div>

        {/* Right side status badge and Production link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Status Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            color: '#34d399',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.03em',
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981',
              display: 'inline-block',
            }} className="pulse" />
            TARIFAS VIGENTES — SEMANA 40/41
          </div>

          {/* Link to Production */}
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.color = 'var(--text-main)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <span>Cotizador Producción</span>
            <ExternalLink size={13} />
          </Link>
        </div>
      </div>

      {/* Bottom Info Chips & Client Presets */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.85rem',
        paddingTop: '0.85rem',
      }}>
        {/* Info Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.73rem',
            color: 'var(--text-muted)',
            padding: '0.25rem 0.6rem',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '6px',
          }}>
            <Radio size={13} style={{ color: 'var(--primary)' }} />
            <span>Tarifario Eversail China Activo</span>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.73rem',
            color: 'var(--text-muted)',
            padding: '0.25rem 0.6rem',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '6px',
          }}>
            <Ship size={13} style={{ color: '#60a5fa' }} />
            <span>Itinerarios Oficiales DCSA</span>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.73rem',
            color: 'var(--text-muted)',
            padding: '0.25rem 0.6rem',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '6px',
          }}>
            <Calendar size={13} style={{ color: '#f59e0b' }} />
            <span>PCD 01-15 Oct 2026</span>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.73rem',
            color: '#10b981',
            padding: '0.25rem 0.6rem',
            background: 'rgba(16, 185, 129, 0.06)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '6px',
          }}>
            <ShieldCheck size={13} />
            <span>21 Días Libres en Destino</span>
          </div>
        </div>

        {/* Quick Presets for Key Clients */}
        {presets.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Atajos de prueba (opcionales):
            </span>
            {presets.map((preset) => {
              const isSelected = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => onSelectPreset && onSelectPreset(isSelected ? null : preset)}
                  type="button"
                  title="Cargar valores de prueba rápidamente"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(6, 182, 212, 0.16)' : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: isSelected ? 'var(--primary)' : 'var(--text-muted)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clipboard, 
  Copy, 
  Check, 
  Layers, 
  ExternalLink,
  Table,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { formatKipintochTSV } from '../../lib/demoData';

export default function KipintochExportModal({ isOpen, onClose, quote, onShowToast }) {
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      setCopiedAll(false);
      setCopiedField(null);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !quote) return null;

  const tsvData = formatKipintochTSV(quote);

  const copyToClipboard = async (text, label) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      if (label === 'ALL') {
        setCopiedAll(true);
        if (onShowToast) onShowToast('📋 Fila TSV copiada lista para Ctrl + V en Kipintoch ERP');
        setTimeout(() => setCopiedAll(false), 3000);
      } else {
        setCopiedField(label);
        if (onShowToast) onShowToast(`📋 Campo "${label}" copiado: ${text}`);
        setTimeout(() => setCopiedField(null), 2000);
      }
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(5, 8, 16, 0.82)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
        padding: '1.25rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          backgroundColor: '#0D1424',
          borderRadius: '14px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          padding: '1.75rem',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 700,
                color: '#a78bfa',
                background: 'rgba(167, 139, 250, 0.12)',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
              }}>
                Integración ERP Kipintoch
              </span>
              <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                Formato Tabulado (16 Campos)
              </span>
            </div>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              margin: '0.35rem 0 0 0',
            }}>
              Exportación Estructurada (TSV / Ctrl+V)
            </h2>
            <p style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              margin: '0.2rem 0 0 0',
            }}>
              almarrosar.kipincargo.com/sistema/cotizaciones/nueva
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Big 1-Click Copy Button */}
        <div style={{ marginTop: '1.25rem' }}>
          <button
            type="button"
            onClick={() => copyToClipboard(tsvData.tsvRow, 'ALL')}
            style={{
              width: '100%',
              padding: '0.85rem 1.25rem',
              borderRadius: '10px',
              background: copiedAll
                ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
                : 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.95rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 16px rgba(124, 58, 237, 0.35)',
              transition: 'all 0.25s ease',
            }}
          >
            {copiedAll ? <Check size={20} /> : <Copy size={20} />}
            <span>{copiedAll ? '¡Fila Copiada al Portapapeles!' : 'Copiar Ficha Completa para Kipintoch (Ctrl + V)'}</span>
          </button>
          <div style={{ fontSize: '0.73rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: '0.4rem' }}>
            Copia una fila separada por tabulaciones (TSV) lista para pegar directamente en celdas de Kipintoch o Excel.
          </div>
        </div>

        {/* Raw TSV Preview */}
        <div style={{ marginTop: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            Vista Previa de Cadena TSV:
          </span>
          <pre style={{
            background: 'rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderRadius: '8px',
            padding: '0.85rem 1rem',
            color: '#a78bfa',
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            whiteSpace: 'pre',
            overflowX: 'auto',
            marginTop: '0.35rem',
          }}>
            {tsvData.tsvRow}
          </pre>
        </div>

        {/* Micro-buttons for field-by-field copy */}
        <div style={{ marginTop: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Copiar Campos Individuales:
          </span>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '0.6rem',
            marginTop: '0.6rem',
          }}>
            {/* Field: Cliente */}
            <button
              type="button"
              onClick={() => copyToClipboard(tsvData.fields?.cliente || 'Cliente Almar', 'Cliente')}
              className="btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.75rem',
                fontSize: '0.78rem',
              }}
            >
              <span style={{ color: 'var(--text-dim)' }}>Cliente:</span>
              <strong style={{ color: 'var(--text-main)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {tsvData.fields?.cliente}
              </strong>
              {copiedField === 'Cliente' ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={13} />}
            </button>

            {/* Field: Flete Venta */}
            <button
              type="button"
              onClick={() => copyToClipboard(tsvData.fields?.fleteVentaUSD, 'Venta USD')}
              className="btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.75rem',
                fontSize: '0.78rem',
              }}
            >
              <span style={{ color: 'var(--text-dim)' }}>Venta:</span>
              <strong style={{ color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>
                USD {tsvData.fields?.fleteVentaUSD}
              </strong>
              {copiedField === 'Venta USD' ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={13} />}
            </button>

            {/* Field: Costo Compra */}
            <button
              type="button"
              onClick={() => copyToClipboard(tsvData.fields?.costoCompraUSD, 'Costo USD')}
              className="btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.75rem',
                fontSize: '0.78rem',
              }}
            >
              <span style={{ color: 'var(--text-dim)' }}>Costo:</span>
              <strong style={{ color: '#fbbf24', fontVariantNumeric: 'tabular-nums' }}>
                USD {tsvData.fields?.costoCompraUSD}
              </strong>
              {copiedField === 'Costo USD' ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={13} />}
            </button>

            {/* Field: Naviera */}
            <button
              type="button"
              onClick={() => copyToClipboard(tsvData.fields?.naviera, 'Naviera')}
              className="btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.75rem',
                fontSize: '0.78rem',
              }}
            >
              <span style={{ color: 'var(--text-dim)' }}>Naviera:</span>
              <strong style={{ color: 'var(--text-main)' }}>{tsvData.fields?.naviera}</strong>
              {copiedField === 'Naviera' ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={13} />}
            </button>

            {/* Field: POD */}
            <button
              type="button"
              onClick={() => copyToClipboard(tsvData.fields?.destino, 'POD')}
              className="btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.75rem',
                fontSize: '0.78rem',
              }}
            >
              <span style={{ color: 'var(--text-dim)' }}>POD Destino:</span>
              <strong style={{ color: 'var(--text-main)' }}>{tsvData.fields?.destino}</strong>
              {copiedField === 'POD' ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={13} />}
            </button>

            {/* Field: Días Libres */}
            <button
              type="button"
              onClick={() => copyToClipboard(tsvData.fields?.diasLibres, 'Días Libres')}
              className="btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0.75rem',
                fontSize: '0.78rem',
              }}
            >
              <span style={{ color: 'var(--text-dim)' }}>Días Libres:</span>
              <strong style={{ color: '#34d399' }}>{tsvData.fields?.diasLibres}</strong>
              {copiedField === 'Días Libres' ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={13} />}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: '1.5rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '0.73rem', color: 'var(--text-dim)' }}>
            Formato estructurado compatible con Kipintoch ERP.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

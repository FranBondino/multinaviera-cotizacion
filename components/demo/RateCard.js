'use client';

import React from 'react';
import { 
  Ship, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  FileText, 
  MessageSquare, 
  Clipboard, 
  PieChart,
  Anchor,
  Send,
  ChevronRight,
  Sparkles,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { formatUSD } from '../../lib/demoData';

// Color & branding themes per carrier
const CARRIER_THEMES = {
  MSK: {
    bgBadge: 'rgba(14, 165, 233, 0.12)',
    borderBadge: 'rgba(14, 165, 233, 0.35)',
    textBadge: '#38bdf8',
    brandName: 'Maersk Line',
    logoText: 'MAERSK',
    accentColor: '#0ea5e9',
  },
  MSC: {
    bgBadge: 'rgba(234, 179, 8, 0.12)',
    borderBadge: 'rgba(234, 179, 8, 0.35)',
    textBadge: '#facc15',
    brandName: 'Mediterranean Shipping Co.',
    logoText: 'MSC',
    accentColor: '#eab308',
  },
  ONE: {
    bgBadge: 'rgba(228, 0, 127, 0.12)',
    borderBadge: 'rgba(228, 0, 127, 0.35)',
    textBadge: '#f472b6',
    brandName: 'Ocean Network Express',
    logoText: 'ONE',
    accentColor: '#E4007F',
  },
  HAPAG: {
    bgBadge: 'rgba(234, 88, 12, 0.12)',
    borderBadge: 'rgba(234, 88, 12, 0.35)',
    textBadge: '#fb923c',
    brandName: 'Hapag-Lloyd AG',
    logoText: 'HAPAG',
    accentColor: '#ea580c',
  },
  PIL: {
    bgBadge: 'rgba(16, 185, 129, 0.12)',
    borderBadge: 'rgba(16, 185, 129, 0.35)',
    textBadge: '#34d399',
    brandName: 'Pacific International Lines',
    logoText: 'PIL SPOT',
    accentColor: '#10b981',
  },
  TIME: {
    bgBadge: 'rgba(124, 58, 237, 0.12)',
    borderBadge: 'rgba(124, 58, 237, 0.35)',
    textBadge: '#a78bfa',
    brandName: 'Time Freight Ltd.',
    logoText: 'TIME',
    accentColor: '#7c3aed',
  },
};

export default function RateCard({
  quote,
  isBestDeal = false,
  onOpenCostBreakdown,
  onOpenWhatsApp,
  onOpenPdf,
  onOpenKipintoch,
}) {
  if (!quote) return null;

  const carrierTheme = CARRIER_THEMES[quote.carrierCode] || {
    bgBadge: 'rgba(255, 255, 255, 0.05)',
    borderBadge: 'rgba(255, 255, 255, 0.1)',
    textBadge: 'var(--text-main)',
    brandName: quote.carrier,
    logoText: quote.carrierCode || 'CARRIER',
    accentColor: 'var(--primary)',
  };

  const isConfirmed = quote.status === 'CONFIRMED' || 
    quote.statusBadge?.includes('VIGENTE') || 
    quote.statusBadge?.includes('CONFIRMADA');

  return (
    <div
      className={`carrier-card glass-panel ${isBestDeal ? 'best-deal' : ''}`}
      style={{
        borderRadius: '12px',
        padding: '1.5rem',
        marginTop: isBestDeal ? '0.75rem' : '0',
        marginBottom: '1.25rem',
        background: 'var(--bg-card)',
        borderColor: isBestDeal ? 'var(--success)' : 'var(--border-subtle)',
        borderWidth: isBestDeal ? '1.5px' : '1px',
        position: 'relative',
        overflow: 'visible',
        transition: 'all 0.25s ease',
      }}
    >
      {/* Best Deal ribbon if applicable */}
      {isBestDeal && (
        <div style={{
          position: 'absolute',
          top: '-11px',
          right: '1.5rem',
          zIndex: 10,
          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
          color: '#ffffff',
          fontSize: '0.68rem',
          fontWeight: 800,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          boxShadow: '0 3px 10px rgba(16, 185, 129, 0.45)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          lineHeight: 1,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}>
          <Sparkles size={12} />
          <span>Tarifa Más Económica</span>
        </div>
      )}

      {/* Main Grid: Header & Naviera Row */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        paddingBottom: '1.1rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      }}>
        {/* Left: Carrier Badge & Route Details */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Carrier Pill Logo */}
          <div style={{
            padding: '0.45rem 0.75rem',
            borderRadius: '8px',
            background: carrierTheme.bgBadge,
            border: `1px solid ${carrierTheme.borderBadge}`,
            color: carrierTheme.textBadge,
            fontWeight: 800,
            fontSize: '0.88rem',
            letterSpacing: '0.05em',
            fontFamily: 'var(--font-heading)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}>
            <Ship size={16} />
            <span>{carrierTheme.logoText}</span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h3 style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                margin: 0,
              }}>
                {quote.carrier}
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>•</span>
              <span style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
              }}>
                Servicio: {quote.service}
              </span>
            </div>

            {/* Vessel and Voyage */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '0.2rem',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
            }}>
              <span style={{ color: 'var(--text-dim)' }}>Buque & Viaje DCSA:</span>
              <strong style={{ color: 'var(--primary)' }}>{quote.vessel}</strong>
            </div>
          </div>
        </div>

        {/* Right: Status Badge & Validity */}
        <div style={{ textAlign: 'right' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.65rem',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
            background: isConfirmed ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            border: isConfirmed ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
            color: isConfirmed ? '#34d399' : '#fbbf24',
          }}>
            <span>{quote.statusBadge || '● TARIFA VIGENTE'}</span>
          </div>
          <div style={{
            fontSize: '0.72rem',
            color: 'var(--text-dim)',
            marginTop: '0.3rem',
          }}>
            PCD Validez: <span style={{ color: 'var(--text-muted)' }}>{quote.validityToText}</span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Itinerary & Schedules & Prices */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem',
        padding: '1.25rem 0',
      }}>
        {/* Itinerary Column */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '0.65rem',
        }}>
          {/* Transit Time & Free Time Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* Free Days Badge (Prominent) */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.65rem',
              borderRadius: '6px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.02em',
            }}>
              <ShieldCheck size={14} />
              <span>🛡️ {quote.freeDays} DÍAS LIBRES EN DESTINO</span>
            </div>

            {/* Transit Time */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.3rem 0.65rem',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              fontVariantNumeric: 'tabular-nums',
            }}>
              <Clock size={13} style={{ color: 'var(--primary)' }} />
              <span>{quote.transitTimeText}</span>
            </div>
          </div>

          {/* Departure & Arrival Schedule */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.5rem',
            padding: '0.65rem 0.75rem',
            borderRadius: '8px',
            background: 'rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.03)',
            marginTop: '0.2rem',
          }}>
            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>ETD Zarpe</span>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.1rem' }}>
                {quote.etd || '10/Oct/2026'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>ETA Arribo</span>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.1rem' }}>
                {quote.eta || (quote.isTPR ? '29/Nov/2026' : '18/Nov/2026')}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Cut-Off Carga</span>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f59e0b', marginTop: '0.1rem' }}>
                {quote.cutOff || '07/Oct/2026'}
              </div>
            </div>
          </div>

          {/* Arbitrary / Feeder Note */}
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
            {quote.isTPR ? (
              <span>⚓ Escala en Rosario TPR vía barcaza feeder fluvial Paraná (Peaje Hidrovía incluido)</span>
            ) : (
              <span>🏢 Descarga oceánica directa en Terminal Puerto Buenos Aires (ARBUE)</span>
            )}
          </div>
        </div>

        {/* Pricing Box Column */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          justifyContent: 'center',
          padding: '1rem 1.25rem',
          borderRadius: '10px',
          background: quote.isSpot
            ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(0, 0, 0, 0.3) 100%)'
            : 'linear-gradient(135deg, rgba(6, 182, 212, 0.04) 0%, rgba(0, 0, 0, 0.3) 100%)',
          border: quote.isSpot
            ? '1px solid rgba(245, 158, 11, 0.25)'
            : '1px solid rgba(255, 255, 255, 0.05)',
        }}>
          {quote.isSpot ? (
            /* Flete Spot */
            <div style={{ textAlign: 'right', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                Flete Internacional Spot
              </span>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#fbbf24',
                fontFamily: 'var(--font-heading)',
                lineHeight: 1.2,
                marginTop: '0.2rem',
              }}>
                En Portal Naviero
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                Tarifa en vivo con login en {quote.portalName}
              </span>
            </div>
          ) : (
            /* Flete Venta Estándar */
            <div style={{ textAlign: 'right', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Flete Internacional Venta
              </span>
              <div style={{
                fontSize: '1.65rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                fontVariantNumeric: 'tabular-nums',
                fontFamily: 'var(--font-heading)',
                lineHeight: 1.1,
              }}>
                USD {formatUSD(quote.pricing.oceanFreightTotalUSD)}
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                Por 1x {quote.equipmentName} (inc. Margen Almar USD {quote.pricing.marginUSD})
              </span>
            </div>
          )}

          {/* Total Landed Presupuesto (o Gastos Locales Confirmados si Spot) */}
          <div style={{
            textAlign: 'right',
            paddingTop: '0.45rem',
            borderTop: '1px dashed rgba(255, 255, 255, 0.08)',
            width: '100%',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {quote.isSpot ? 'Gastos Locales en Destino:' : 'Total Landed Estimado:'}
              </span>
              <strong style={{
                fontSize: '1.05rem',
                color: 'var(--primary)',
                fontVariantNumeric: 'tabular-nums',
              }}>
                USD {formatUSD(quote.pricing.destinationChargesTotalUSD)}
              </strong>
            </div>
            <div style={{ fontSize: '0.67rem', color: 'var(--text-dim)', marginTop: '0.1rem' }}>
              {quote.isSpot 
                ? `Agencia + Doc Fee${quote.isTPR ? ' + Peaje Hidrovía' : ''} (100% confirmado en Argentina)`
                : `Incluye gastos locales en destino (${quote.destinationName}) + IVA`}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.6rem',
        paddingTop: '1rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      }}>
        {/* Left: Quick modal actions for Commercial Proposal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* 1. Cost Breakdown */}
          <button
            type="button"
            onClick={() => onOpenCostBreakdown && onOpenCostBreakdown(quote)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '7px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
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
            <PieChart size={14} style={{ color: 'var(--primary)' }} />
            <span>Desglose de Costos</span>
          </button>

          {/* 2. WhatsApp Preview */}
          <button
            type="button"
            onClick={() => onOpenWhatsApp && onOpenWhatsApp(quote)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '7px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: '#34d399',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.16)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.08)';
            }}
          >
            <MessageSquare size={14} />
            <span>WhatsApp</span>
          </button>

          {/* 3. PDF Quote */}
          <button
            type="button"
            onClick={() => onOpenPdf && onOpenPdf(quote)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '7px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
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
            <FileText size={14} style={{ color: '#38bdf8' }} />
            <span>Cotización PDF</span>
          </button>

          {/* 4. Kipintoch TSV */}
          <button
            type="button"
            onClick={() => onOpenKipintoch && onOpenKipintoch(quote)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '7px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
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
            <Clipboard size={14} style={{ color: '#a78bfa' }} />
            <span>Kipintoch ERP</span>
          </button>
        </div>

        {/* Right: Proposal Button or Direct Portal Link */}
        <div>
          {quote.isSpot ? (
            <a
              href={quote.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontSize: '0.82rem',
                padding: '0.5rem 1.1rem',
                background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                color: '#ffffff',
                textDecoration: 'none',
                border: 'none',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)',
              }}
            >
              <span>Cotizar en {quote.portalName}</span>
              <ExternalLink size={15} />
            </a>
          ) : (
            <button
              type="button"
              onClick={() => onOpenWhatsApp && onOpenWhatsApp(quote)}
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.82rem',
                padding: '0.5rem 1.1rem',
              }}
            >
              <span>Generar Propuesta</span>
              <ChevronRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

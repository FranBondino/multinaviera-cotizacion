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
  Sparkles, 
  ExternalLink,
  Info,
  ArrowRight,
  Anchor,
  CheckCircle2,
  Building2
} from 'lucide-react';
import { formatUSD } from '../../lib/demoData';

// Carrier theme definitions
const CARRIER_THEMES = {
  MSK: {
    bgBadge: 'rgba(14, 165, 233, 0.12)',
    borderBadge: 'rgba(14, 165, 233, 0.35)',
    textBadge: '#38bdf8',
    brandName: 'Maersk Line',
    logoText: 'MAERSK',
  },
  MSC: {
    bgBadge: 'rgba(234, 179, 8, 0.12)',
    borderBadge: 'rgba(234, 179, 8, 0.35)',
    textBadge: '#facc15',
    brandName: 'Mediterranean Shipping Co.',
    logoText: 'MSC',
  },
  ONE: {
    bgBadge: 'rgba(228, 0, 127, 0.12)',
    borderBadge: 'rgba(228, 0, 127, 0.35)',
    textBadge: '#f472b6',
    brandName: 'Ocean Network Express',
    logoText: 'ONE',
  },
  HAPAG: {
    bgBadge: 'rgba(234, 88, 12, 0.12)',
    borderBadge: 'rgba(234, 88, 12, 0.35)',
    textBadge: '#fb923c',
    brandName: 'Hapag-Lloyd AG',
    logoText: 'HAPAG',
  },
  PIL: {
    bgBadge: 'rgba(16, 185, 129, 0.12)',
    borderBadge: 'rgba(16, 185, 129, 0.35)',
    textBadge: '#34d399',
    brandName: 'PIL Spot',
    logoText: 'PIL SPOT',
  },
};

// Agent badge styles
const AGENT_STYLES = {
  'AGENT-EVERSAIL': {
    bg: 'rgba(6, 182, 212, 0.1)',
    border: 'rgba(6, 182, 212, 0.3)',
    text: '#22d3ee',
    short: 'Eversail',
    badge: 'Eversail (Master)',
  },
  'AGENT-TIMEFREIGHT': {
    bg: 'rgba(168, 85, 247, 0.1)',
    border: 'rgba(168, 85, 247, 0.3)',
    text: '#c084fc',
    short: 'Time Freight',
    badge: 'Time Freight (Co-Loader)',
  },
  'AGENT-DIRECT': {
    bg: 'rgba(245, 158, 11, 0.1)',
    border: 'rgba(245, 158, 11, 0.3)',
    text: '#fbbf24',
    short: 'Directo',
    badge: 'Directo Naviera',
  },
};

export default function RateListView({
  quotes = [],
  onOpenCostBreakdown,
  onOpenWhatsApp,
  onOpenPdf,
  onOpenKipintoch,
}) {
  if (!quotes || quotes.length === 0) return null;

  return (
    <div className="glass-panel" style={{
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid var(--border-subtle)',
      background: 'var(--bg-card)',
      marginBottom: '1.5rem',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
    }}>
      {/* Table Container with Horizontal Scroll support */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '0.82rem',
          minWidth: '1020px',
        }}>
          {/* Table Header */}
          <thead>
            <tr style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'var(--text-dim)',
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              <th style={{ padding: '0.85rem 1rem', width: '18%' }}>Naviera & Agente</th>
              <th style={{ padding: '0.85rem 1rem', width: '22%' }}>Buque / Itinerario (DCSA)</th>
              <th style={{ padding: '0.85rem 0.85rem', width: '12%' }}>Tránsito</th>
              <th style={{ padding: '0.85rem 0.85rem', width: '12%' }}>Días Libres</th>
              <th style={{ padding: '0.85rem 0.85rem', width: '12%', textAlign: 'right' }}>Flete Venta</th>
              <th style={{ padding: '0.85rem 0.85rem', width: '12%', textAlign: 'right' }}>Gastos Locales</th>
              <th style={{ padding: '0.85rem 1rem', width: '12%', textAlign: 'right' }}>Total Landed</th>
              <th style={{ padding: '0.85rem 1rem', width: '12%', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {quotes.map((quote, index) => {
              const isBestDeal = index === 0 && !quote.isSpot;
              const carrierTheme = CARRIER_THEMES[quote.carrierCode] || {
                bgBadge: 'rgba(255, 255, 255, 0.05)',
                borderBadge: 'rgba(255, 255, 255, 0.1)',
                textBadge: 'var(--text-main)',
                brandName: quote.carrier,
                logoText: quote.carrierCode || 'CARRIER',
              };

              const agentStyle = AGENT_STYLES[quote.agentId] || (
                quote.isSpot ? AGENT_STYLES['AGENT-DIRECT'] : AGENT_STYLES['AGENT-EVERSAIL']
              );

              return (
                <tr
                  key={quote.quoteNumber || quote.rateId || index}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    background: isBestDeal ? 'rgba(16, 185, 129, 0.04)' : (index % 2 === 0 ? 'rgba(255, 255, 255, 0.01)' : 'transparent'),
                    transition: 'background 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = isBestDeal 
                      ? 'rgba(16, 185, 129, 0.08)' 
                      : 'rgba(255, 255, 255, 0.035)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = isBestDeal 
                      ? 'rgba(16, 185, 129, 0.04)' 
                      : (index % 2 === 0 ? 'rgba(255, 255, 255, 0.01)' : 'transparent');
                  }}
                >
                  {/* 1. Naviera & Agente */}
                  <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      {/* Carrier Badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '6px',
                          background: carrierTheme.bgBadge,
                          border: `1px solid ${carrierTheme.borderBadge}`,
                          color: carrierTheme.textBadge,
                          fontWeight: 800,
                          fontSize: '0.74rem',
                          letterSpacing: '0.04em',
                        }}>
                          {carrierTheme.logoText}
                        </span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap' }}>
                          {quote.carrier}
                        </span>
                      </div>

                      {/* Agente / Proveedor Badge */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          background: agentStyle.bg,
                          border: `1px solid ${agentStyle.border}`,
                          color: agentStyle.text,
                          fontSize: '0.68rem',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                        }}>
                          <span>Agente: {quote.agentShort || agentStyle.short}</span>
                        </span>
                        {isBestDeal && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem',
                            padding: '0.15rem 0.4rem',
                            borderRadius: '9999px',
                            background: '#10b981',
                            color: '#ffffff',
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                          }}>
                            <Sparkles size={10} />
                            Mejor Opción
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* 2. Buque / Itinerario */}
                  <td style={{ padding: '1rem', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Ship size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                        <span style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.82rem' }}>
                          {quote.vessel || 'Buque Oficial DCSA'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <span><strong>ETD:</strong> {quote.etd || 'Consultar'}</span>
                        <span>•</span>
                        <span><strong>ETA:</strong> {quote.eta || 'Consultar'}</span>
                        {quote.cutOff && (
                          <>
                            <span>•</span>
                            <span style={{ color: 'var(--text-dim)' }}>Cut-off: {quote.cutOff}</span>
                          </>
                        )}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                        Servicio: {quote.service || 'Direct Express'}
                      </div>
                    </div>
                  </td>

                  {/* 3. Tránsito */}
                  <td style={{ padding: '0.85rem', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--text-main)', fontWeight: 600 }}>
                        <Clock size={13} style={{ color: 'var(--text-dim)' }} />
                        <span>{quote.transitTimeText?.split('(')[0] || '45-55 días'}</span>
                      </div>
                      <span style={{
                        fontSize: '0.68rem',
                        color: quote.isTPR ? '#38bdf8' : '#a78bfa',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.2rem',
                      }}>
                        {quote.isTPR ? <Anchor size={11} /> : <Building2 size={11} />}
                        {quote.isTPR ? 'Feeder Rosario' : 'Directo BUE'}
                      </span>
                    </div>
                  </td>

                  {/* 4. Días Libres (Free Time) */}
                  <td style={{ padding: '0.85rem', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        padding: '0.25rem 0.55rem',
                        borderRadius: '6px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#34d399',
                        fontWeight: 700,
                        fontSize: '0.73rem',
                        width: 'fit-content',
                      }}>
                        <ShieldCheck size={12} />
                        {quote.freeDays ? `${quote.freeDays} Días Libres` : '14 Días Estándar'}
                      </span>
                      {quote.pricing?.buyFreeTimeUSD > 0 && (
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
                          Inc. Buy Free Time +${quote.pricing.buyFreeTimeUSD}
                        </span>
                      )}
                      {quote.pricing?.buyFreeTimeUSD === 0 && !quote.isSpot && (
                        <span style={{ fontSize: '0.65rem', color: '#10b981' }}>
                          ✓ Sin recargo Buy FT
                        </span>
                      )}
                    </div>
                  </td>

                  {/* 5. Flete Venta */}
                  <td style={{ padding: '0.85rem', verticalAlign: 'middle', textAlign: 'right' }}>
                    {quote.isSpot ? (
                      <div>
                        <span style={{
                          display: 'inline-block',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          background: 'rgba(245, 158, 11, 0.15)',
                          color: '#fbbf24',
                          fontWeight: 700,
                          fontSize: '0.74rem',
                        }}>
                          Spot en Portal
                        </span>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>
                          {quote.portalName}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{
                          fontSize: '1.05rem',
                          fontWeight: 800,
                          color: isBestDeal ? '#10b981' : 'var(--text-main)',
                          fontVariantNumeric: 'tabular-nums',
                          fontFamily: 'var(--font-heading)',
                        }}>
                          USD {formatUSD(quote.pricing.oceanFreightTotalUSD)}
                        </div>
                        <div style={{ fontSize: '0.66rem', color: 'var(--text-dim)' }}>
                          inc. Margen Almar ${quote.pricing.marginUSD}
                        </div>
                      </div>
                    )}
                  </td>

                  {/* 6. Gastos Locales */}
                  <td style={{ padding: '0.85rem', verticalAlign: 'middle', textAlign: 'right' }}>
                    <div>
                      <div style={{
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        color: '#38bdf8',
                        fontVariantNumeric: 'tabular-nums',
                      }}>
                        USD {formatUSD(quote.pricing.destinationChargesTotalUSD)}
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
                        {quote.isTPR ? 'Agencia + Docs + Hidrovía' : 'Agencia + Docs'}
                      </div>
                    </div>
                  </td>

                  {/* 7. Total Landed */}
                  <td style={{ padding: '1rem', verticalAlign: 'middle', textAlign: 'right' }}>
                    <div>
                      <div style={{
                        fontSize: '1.15rem',
                        fontWeight: 900,
                        color: isBestDeal ? '#34d399' : (quote.isSpot ? '#fbbf24' : 'var(--text-main)'),
                        fontVariantNumeric: 'tabular-nums',
                        fontFamily: 'var(--font-heading)',
                      }}>
                        {quote.isSpot 
                          ? `USD ${formatUSD(quote.pricing.destinationChargesTotalUSD)}*`
                          : `USD ${formatUSD(quote.pricing.grandTotalUSD)}`
                        }
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
                        {quote.isSpot ? '*Base local confirmada' : 'Flete + Gastos en Destino'}
                      </div>
                    </div>
                  </td>

                  {/* 8. Acciones Comerciales */}
                  <td style={{ padding: '1rem', verticalAlign: 'middle', textAlign: 'center' }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      flexWrap: 'nowrap',
                    }}>
                      {/* WhatsApp Button */}
                      <button
                        type="button"
                        title="Generar y copiar mensaje para WhatsApp"
                        onClick={() => onOpenWhatsApp && onOpenWhatsApp(quote)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          background: 'rgba(16, 185, 129, 0.12)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          color: '#34d399',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = 'rgba(16, 185, 129, 0.25)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'rgba(16, 185, 129, 0.12)';
                          e.currentTarget.style.transform = 'none';
                        }}
                      >
                        <MessageSquare size={15} />
                      </button>

                      {/* PDF Button */}
                      <button
                        type="button"
                        title="Generar cotización formal en PDF con membrete Almar"
                        onClick={() => onOpenPdf && onOpenPdf(quote)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          background: 'rgba(14, 165, 233, 0.12)',
                          border: '1px solid rgba(14, 165, 233, 0.3)',
                          color: '#38bdf8',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = 'rgba(14, 165, 233, 0.25)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'rgba(14, 165, 233, 0.12)';
                          e.currentTarget.style.transform = 'none';
                        }}
                      >
                        <FileText size={15} />
                      </button>

                      {/* Kipintoch ERP Button */}
                      <button
                        type="button"
                        title="Copiar datos estructurados TSV para pegar en Kipintoch ERP"
                        onClick={() => onOpenKipintoch && onOpenKipintoch(quote)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          background: 'rgba(168, 85, 247, 0.12)',
                          border: '1px solid rgba(168, 85, 247, 0.3)',
                          color: '#c084fc',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = 'rgba(168, 85, 247, 0.25)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'rgba(168, 85, 247, 0.12)';
                          e.currentTarget.style.transform = 'none';
                        }}
                      >
                        <Clipboard size={15} />
                      </button>

                      {/* Cost Breakdown Button */}
                      <button
                        type="button"
                        title="Ver desglose detallado de flete, recargos y gastos locales"
                        onClick={() => onOpenCostBreakdown && onOpenCostBreakdown(quote)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                          e.currentTarget.style.color = 'var(--text-main)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                          e.currentTarget.style.color = 'var(--text-muted)';
                          e.currentTarget.style.transform = 'none';
                        }}
                      >
                        <PieChart size={15} />
                      </button>

                      {/* If Spot, direct portal link */}
                      {quote.isSpot && quote.portalUrl && (
                        <a
                          href={quote.portalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`Abrir portal oficial ${quote.portalName}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            background: 'rgba(245, 158, 11, 0.12)',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            color: '#fbbf24',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            transition: 'all 0.15s ease',
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(245, 158, 11, 0.25)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(245, 158, 11, 0.12)';
                            e.currentTarget.style.transform = 'none';
                          }}
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Operational Legend */}
      <div style={{
        padding: '0.65rem 1rem',
        background: 'rgba(255, 255, 255, 0.02)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        fontSize: '0.72rem',
        color: 'var(--text-dim)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span><strong>Acciones:</strong> 💬 WhatsApp · 📄 Cotización PDF · 📋 Kipintoch ERP (Ctrl+V) · 🔍 Desglose</span>
          <span>•</span>
          <span>Gastos en Destino: Agencia USD 800 + Docs USD 75 + IVA{quotes[0]?.isTPR ? ' + Peaje Hidrovía USD 175' : ''}</span>
        </div>
        <div>
          <span>Tip de Operación: Seleccione cualquier acción para abrir la herramienta comercial asistida.</span>
        </div>
      </div>
    </div>
  );
}

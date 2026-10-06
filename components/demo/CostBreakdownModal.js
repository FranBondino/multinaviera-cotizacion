'use client';

import React, { useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Info, 
  CheckCircle2, 
  DollarSign, 
  Anchor, 
  Building2, 
  Truck, 
  FileText 
} from 'lucide-react';
import { formatUSD } from '../../lib/demoData';

export default function CostBreakdownModal({ isOpen, onClose, quote }) {
  // Listen for Esc key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !quote) return null;

  const p = quote.pricing;

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
                color: 'var(--primary)',
                background: 'rgba(6, 182, 212, 0.1)',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
              }}>
                Composición de Tarifa
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontVariantNumeric: 'tabular-nums' }}>
                Ref: {quote.quoteNumber}
              </span>
            </div>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              margin: '0.35rem 0 0 0',
            }}>
              Desglose de Flete y Gastos en Destino
            </h2>
            <p style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              margin: '0.2rem 0 0 0',
            }}>
              {quote.carrier} · 1x {quote.equipmentName} · {quote.originName} ➔ {quote.destinationName}
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
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = 'var(--text-main)';
              e.currentTarget.style.borderColor = 'var(--primary)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Section 1: Flete Internacional Marítimo */}
        <div style={{ marginTop: '1.25rem' }}>
          <h3 style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: 'var(--primary)',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}>
            <Anchor size={14} />
            <span>1. Flete Internacional Marítimo (USD)</span>
          </h3>

          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
          }}>
            {quote.isSpot ? (
              <>
                <div className="detail-row">
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Flete Marítimo Internacional Spot
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24' }}>
                    Consultar en {quote.portalName}
                  </span>
                </div>
                <div className="detail-row">
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Portal Oficial de Cotización
                  </span>
                  <a
                    href={quote.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.82rem', color: 'var(--primary)', textDecoration: 'underline' }}
                  >
                    {quote.portalUrl} ↗
                  </a>
                </div>
                <div className="detail-row">
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Días Libres en Destino (Free Time)
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#10b981' }}>
                    {quote.freeDays}
                  </span>
                </div>
                <div className="detail-row">
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Buque y Viaje DCSA Oficial
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                    {quote.vessel}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '0.5rem',
                  paddingTop: '0.65rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>
                    Subtotal Flete Marítimo:
                  </strong>
                  <strong style={{ fontSize: '0.95rem', color: '#fbbf24' }}>
                    Tarifa Spot en Portal Naviero
                  </strong>
                </div>
              </>
            ) : (
              <>
                {/* Base Freight */}
                <div className="detail-row">
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Flete Base de Compra Naviera (Eversail W40/W41)
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                    USD {formatUSD(p.baseFreightUSD)}
                  </span>
                </div>

                {/* Buy Free Time */}
                <div className="detail-row">
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>Buy Free Time ({quote.freeDays} días libres en destino)</span>
                    <span style={{ color: '#10b981', fontSize: '0.7rem' }}>[Incluido]</span>
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                    USD {formatUSD(p.buyFreeTimeUSD)}
                  </span>
                </div>

                {/* Vessel Protection */}
                <div className="detail-row">
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Vessel Protection (VP / Cobertura Buque)
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                    USD {formatUSD(p.vesselProtectionUSD)}
                  </span>
                </div>

                {/* Arbitrario Feeder Fluvial TPR si aplica */}
                {quote.isTPR && (
                  <div className="detail-row">
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Arbitrario Feeder Fluvial Barcaza a Rosario TPR
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>
                      +USD {formatUSD(p.arbitraryFeederUSD || (quote.originCode === 'CNTAO' || quote.originCode === 'CNTXG' ? 200 : 100))}
                    </span>
                  </div>
                )}

                {/* Heavy Weight Surcharge (HWS) si aplica */}
                {p.hwsSurchargeUSD > 0 && (
                  <div className="detail-row" style={{ background: 'rgba(245, 158, 11, 0.08)', margin: '0 -0.5rem', padding: '0.4rem 0.5rem', borderRadius: '4px' }}>
                    <span style={{ fontSize: '0.82rem', color: '#fbbf24', fontWeight: 600 }}>
                      ⚠️ Recargo de Sobrepeso (HWS &gt;20tn para 20&apos;GP)
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24', fontVariantNumeric: 'tabular-nums' }}>
                      +USD {formatUSD(p.hwsSurchargeUSD)}
                    </span>
                  </div>
                )}

                {/* Almar Margin */}
                <div className="detail-row">
                  <span style={{ fontSize: '0.82rem', color: '#34d399', fontWeight: 600 }}>
                    Margen Comercial Bruto Almar Rosario
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399', fontVariantNumeric: 'tabular-nums' }}>
                    +USD {formatUSD(p.marginUSD)}
                  </span>
                </div>

                {/* Subtotal Flete Venta */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '0.5rem',
                  paddingTop: '0.65rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                }}>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>
                    Subtotal Flete Marítimo de Venta:
                  </strong>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums' }}>
                    USD {formatUSD(p.oceanFreightTotalUSD)}
                  </strong>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Section 2: Gastos Locales en Destino (Argentina) */}
        <div style={{ marginTop: '1.25rem' }}>
          <h3 style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#38bdf8',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}>
            <Building2 size={14} />
            <span>2. Gastos Locales en Destino ({quote.destinationName})</span>
          </h3>

          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.04)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
          }}>
            {/* Carrier Agency Fee (Exento) */}
            <div className="detail-row">
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Gastos de Agencia Marítima Destino (Exento IVA)
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                USD {formatUSD(p.agencyFeeUSD)}
              </span>
            </div>

            {/* Documentation Fee + VAT */}
            <div className="detail-row">
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Documentación de Embarque / BL Fee (USD 75,00 + IVA 21%)
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                USD {formatUSD(p.docFeeUSD + p.docFeeVatUSD)}
              </span>
            </div>

            {/* Peaje Hidrovía si TPR */}
            {quote.isTPR && (
              <div className="detail-row">
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Peaje Hidrovía Paraná (Dragado &amp; Balizamiento TPR)
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f59e0b', fontVariantNumeric: 'tabular-nums' }}>
                  USD {formatUSD(p.peajeHidroviaUSD)}
                </span>
              </div>
            )}

            {/* Flete Carretero si BUE activo */}
            {p.roadFreightUSD > 0 && (
              <div className="detail-row" style={{ background: 'rgba(6, 182, 212, 0.08)', margin: '0 -0.5rem', padding: '0.4rem 0.5rem', borderRadius: '4px' }}>
                <span style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 600 }}>
                  Camión Carretero Expreso BUE ➔ Planta Rosario
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', fontVariantNumeric: 'tabular-nums' }}>
                  +USD {formatUSD(p.roadFreightUSD)}
                </span>
              </div>
            )}

            {/* Seguro Opcional si activo */}
            {p.insuranceUSD > 0 && (
              <div className="detail-row">
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Seguro Internacional de Carga (USD {formatUSD(p.insuranceUSD)} + IVA)
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  USD {formatUSD(p.insuranceUSD + p.insuranceVatUSD)}
                </span>
              </div>
            )}

            {/* Subtotal Gastos Locales */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '0.5rem',
              paddingTop: '0.65rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              <strong style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>
                Subtotal Gastos en Destino (inc. IVA discriminado):
              </strong>
              <strong style={{ fontSize: '1.05rem', color: '#38bdf8', fontVariantNumeric: 'tabular-nums' }}>
                USD {formatUSD(p.destinationChargesTotalUSD)}
              </strong>
            </div>
          </div>
        </div>

        {/* Section 3: Gran Total Presupuesto Landed */}
        <div style={{
          marginTop: '1.25rem',
          padding: '1.1rem 1.25rem',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(16, 185, 129, 0.12) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {quote.isSpot ? 'Gastos Locales Confirmados en Destino' : 'Presupuesto Total Estimado'}
            </span>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', fontVariantNumeric: 'tabular-nums' }}>
              USD {formatUSD(p.destinationChargesTotalUSD)}
              {quote.isSpot && <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fbbf24', marginLeft: '0.5rem' }}>+ Flete Spot Naviero</span>}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
              {quote.isSpot
                ? '(Base de gastos en Argentina 100% calculada al centavo)'
                : `(Flete Venta USD ${formatUSD(p.oceanFreightTotalUSD)} + Locales USD ${formatUSD(p.destinationChargesTotalUSD)})`}
            </div>
          </div>

          <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            <div>Tipo de Cambio: <strong>BNA Billete Vendedor</strong></div>
            <div>Días libres: <strong style={{ color: '#10b981' }}>{quote.freeDays} Días Libres</strong></div>
          </div>
        </div>

        {/* Footer Notes */}
        <div style={{
          marginTop: '1.25rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: 'var(--text-dim)' }}>
            <Info size={14} style={{ color: 'var(--primary)' }} />
            <span>
              {quote.isSpot
                ? `Itinerario oficial DCSA verificado con naviera directa (${quote.carrier}). Flete spot sujeto a cotización en portal.`
                : 'Tarifario oficial Eversail Logistics Inc. verificado para la Semana 40/41.'}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}
          >
            Cerrar Desglose
          </button>
        </div>
      </div>
    </div>
  );
}

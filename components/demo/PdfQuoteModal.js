'use client';

import React, { useEffect, useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileText, 
  Building, 
  Calendar, 
  ShieldCheck, 
  QrCode,
  Ship,
  Anchor
} from 'lucide-react';
import { formatUSD } from '../../lib/demoData';

export default function PdfQuoteModal({ isOpen, onClose, quote }) {
  const printRef = useRef(null);

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
  const today = new Date().toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
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
        backgroundColor: 'rgba(5, 8, 16, 0.85)',
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
          maxWidth: '820px',
          maxHeight: '92vh',
          overflowY: 'auto',
          backgroundColor: '#0D1424',
          borderRadius: '14px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          padding: '1.5rem',
          position: 'relative',
        }}
      >
        {/* Modal Controls Bar (Hidden in print) */}
        <div 
          className="no-print"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
              Previsualización de Presupuesto Institucional
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              type="button"
              onClick={handlePrint}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, var(--primary), var(--accent-cyan))',
                border: 'none',
                color: '#000000',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
              }}
            >
              <Printer size={15} />
              <span>Imprimir / Guardar como PDF</span>
            </button>

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
        </div>

        {/* PRINTABLE LETTERHEAD DOCUMENT CONTAINER */}
        <div 
          id="printable-quote"
          ref={printRef}
          style={{
            backgroundColor: '#ffffff',
            color: '#0f172a',
            padding: '2.5rem',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
            fontFamily: 'var(--font-body), Arial, sans-serif',
          }}
        >
          {/* Header Row: Company Details & Quote Number */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            paddingBottom: '1.5rem',
            borderBottom: '2px solid #06b6d4',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: '#0284c7',
                  letterSpacing: '0.04em',
                  fontFamily: 'var(--font-heading)',
                }}>
                  ALMAR ROSARIO S.R.L.
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '0.25rem', lineHeight: 1.4 }}>
                Agencia Marítima &amp; Logística Internacional<br />
                Córdoba 1452, Piso 8 — (2000) Rosario, Santa Fe, Argentina<br />
                CUIT: 30-71458921-9 · Tel: +54 (341) 527-8800 · www.almarrosario.com
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#0f172a',
                fontVariantNumeric: 'tabular-nums',
                fontFamily: 'var(--font-heading)',
              }}>
                COTIZACIÓN Nº {quote.quoteNumber}
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' }}>
                Fecha de Emisión: <strong>{today}</strong>
              </div>
              <div style={{
                fontSize: '0.78rem',
                color: '#b45309',
                background: '#fef3c7',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                marginTop: '0.35rem',
                fontWeight: 600,
                display: 'inline-block',
              }}>
                Validez Tarifa: {quote.validityToText}
              </div>
            </div>
          </div>

          {/* Client & Shipment Info Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.5rem',
            padding: '1.25rem 0',
            borderBottom: '1px solid #e2e8f0',
          }}>
            {/* Left: Client info */}
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>
                Cliente / Razón Social:
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.15rem' }}>
                {quote.clientName || 'Cliente Corporativo Almar'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>
                Atn: Departamento de Comercio Exterior / Compras
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Condición de Venta: <strong>FOB / CFR Destino</strong>
              </div>
            </div>

            {/* Right: Route info */}
            <div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700, letterSpacing: '0.05em' }}>
                Itinerario &amp; Buque Oficial:
              </div>
              <div style={{ fontSize: '0.85rem', color: '#0f172a', marginTop: '0.15rem', lineHeight: 1.45 }}>
                • <strong>Origen (POL):</strong> {quote.originName} ({quote.originCode})<br />
                • <strong>Destino (POD):</strong> {quote.destinationName} ({quote.destinationCode})<br />
                • <strong>Naviera:</strong> {quote.carrier} (Servicio {quote.service})<br />
                • <strong>Buque / Viaje:</strong> {quote.vessel}<br />
                • <strong>Tránsito:</strong> {quote.transitTimeText}
              </div>
            </div>
          </div>

          {/* Table of Items */}
          <div style={{ marginTop: '1.25rem' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.84rem',
            }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
                  <th style={{ textAlign: 'left', padding: '0.65rem 0.75rem', fontWeight: 700, color: '#334155' }}>
                    Concepto / Detalle
                  </th>
                  <th style={{ textAlign: 'center', padding: '0.65rem', fontWeight: 700, color: '#334155' }}>
                    Equipo / Base
                  </th>
                  <th style={{ textAlign: 'center', padding: '0.65rem', fontWeight: 700, color: '#334155' }}>
                    Condición IVA
                  </th>
                  <th style={{ textAlign: 'right', padding: '0.65rem 0.75rem', fontWeight: 700, color: '#334155' }}>
                    Importe (USD)
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* 1. Ocean Freight */}
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#0f172a' }}>
                    <strong>Flete Internacional Marítimo</strong><br />
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Incluye Vessel Protection (VP) y <strong>{quote.freeDays} días libres de estadía</strong> en destino
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', padding: '0.65rem', color: '#475569' }}>
                    1x {quote.equipmentName}
                  </td>
                  <td style={{ textAlign: 'center', padding: '0.65rem', color: '#64748b', fontSize: '0.78rem' }}>
                    Exento
                  </td>
                  <td style={{ textAlign: 'right', padding: '0.65rem 0.75rem', fontWeight: 700, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                    {formatUSD(p.oceanFreightTotalUSD)}
                  </td>
                </tr>

                {/* 2. Agency Fee */}
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#0f172a' }}>
                    Gastos de Agencia Marítima en Destino (Carrier Agency Fee)
                  </td>
                  <td style={{ textAlign: 'center', padding: '0.65rem', color: '#475569' }}>
                    Fijo
                  </td>
                  <td style={{ textAlign: 'center', padding: '0.65rem', color: '#64748b', fontSize: '0.78rem' }}>
                    Exento
                  </td>
                  <td style={{ textAlign: 'right', padding: '0.65rem 0.75rem', fontWeight: 600, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                    {formatUSD(p.agencyFeeUSD)}
                  </td>
                </tr>

                {/* 3. Doc Fee + VAT */}
                <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.65rem 0.75rem', color: '#0f172a' }}>
                    Documentación de Embarque / BL Fee Destino
                  </td>
                  <td style={{ textAlign: 'center', padding: '0.65rem', color: '#475569' }}>
                    Fijo
                  </td>
                  <td style={{ textAlign: 'center', padding: '0.65rem', color: '#64748b', fontSize: '0.78rem' }}>
                    Gravado 21%
                  </td>
                  <td style={{ textAlign: 'right', padding: '0.65rem 0.75rem', fontWeight: 600, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                    {formatUSD(p.docFeeUSD + p.docFeeVatUSD)}
                  </td>
                </tr>

                {/* 4. Peaje Hidrovia si TPR */}
                {quote.isTPR && (
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.65rem 0.75rem', color: '#0f172a' }}>
                      Peaje Dragado y Balizamiento Hidrovía Paraná (Escala TPR)
                    </td>
                    <td style={{ textAlign: 'center', padding: '0.65rem', color: '#475569' }}>
                      Escala Fluvial
                    </td>
                    <td style={{ textAlign: 'center', padding: '0.65rem', color: '#64748b', fontSize: '0.78rem' }}>
                      Exento
                    </td>
                    <td style={{ textAlign: 'right', padding: '0.65rem 0.75rem', fontWeight: 600, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                      {formatUSD(p.peajeHidroviaUSD)}
                    </td>
                  </tr>
                )}

                {/* 5. Road Freight si BUE */}
                {p.roadFreightUSD > 0 && (
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.65rem 0.75rem', color: '#0f172a' }}>
                      Flete Carretero Expreso Terminal BUE ➔ Planta Rosario
                    </td>
                    <td style={{ textAlign: 'center', padding: '0.65rem', color: '#475569' }}>
                      1 Camión
                    </td>
                    <td style={{ textAlign: 'center', padding: '0.65rem', color: '#64748b', fontSize: '0.78rem' }}>
                      Gravado 21%
                    </td>
                    <td style={{ textAlign: 'right', padding: '0.65rem 0.75rem', fontWeight: 600, color: '#0f172a', fontVariantNumeric: 'tabular-nums' }}>
                      {formatUSD(p.roadFreightUSD)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals Box */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '1rem',
          }}>
            <div style={{
              width: '320px',
              borderTop: '2px solid #0f172a',
              paddingTop: '0.65rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#475569', marginBottom: '0.25rem' }}>
                <span>Subtotal Flete de Venta:</span>
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>USD {formatUSD(p.oceanFreightTotalUSD)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#475569', marginBottom: '0.35rem' }}>
                <span>Gastos en Destino (inc. IVA):</span>
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>USD {formatUSD(p.destinationChargesTotalUSD)}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.15rem',
                fontWeight: 800,
                color: '#0f172a',
                borderTop: '1px solid #cbd5e1',
                paddingTop: '0.45rem',
              }}>
                <span>TOTAL PRESUPUESTO:</span>
                <span style={{ fontVariantNumeric: 'tabular-nums', color: '#0284c7' }}>
                  USD {formatUSD(p.grandTotalUSD)}
                </span>
              </div>
            </div>
          </div>

          {/* Terms & Conditions & Signatures */}
          <div style={{
            marginTop: '2rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e2e8f0',
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '1.5rem',
            alignItems: 'flex-end',
          }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.45 }}>
              <strong>CONDICIONES GENERALES:</strong><br />
              1. Cotización válida hasta el <strong>{quote.validityToText}</strong> sujeta a espacio y disponibilidad de equipo en origen.<br />
              2. Flete pagadero al tipo de cambio oficial BNA billete vendedor del día previo al pago.<br />
              3. Días libres: <strong>{quote.freeDays} días libres de estadía de contenedor</strong> en puerto de destino.<br />
              4. Toda operación está sujeta a las Condiciones Generales de Almar Rosario S.R.L. y de la Asociación de Agentes de Carga (AAACI).
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                borderBottom: '1px solid #94a3b8',
                width: '180px',
                margin: '0 auto 0.4rem auto',
                paddingBottom: '2.5rem',
              }}>
                <span style={{ fontSize: '0.8rem', fontStyle: 'italic', color: '#0284c7' }}>
                  Almar Rosario S.R.L.
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
                Departamento Comercial &amp; Pricing
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                Agencia Marítima &amp; Forwarder Internacional
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global CSS for Print */}
      <style jsx global>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
            padding: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          #printable-quote {
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

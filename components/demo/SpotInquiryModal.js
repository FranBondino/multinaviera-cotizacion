'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  Clock, 
  AlertCircle, 
  Mail, 
  CheckCircle2, 
  User, 
  Calendar, 
  FileCheck,
  Flame,
  Shield,
  Copy,
  Check
} from 'lucide-react';
import { generateSpotTicket } from '../../lib/demoData';

export default function SpotInquiryModal({ isOpen, onClose, quote, onShowToast }) {
  const [ticket, setTicket] = useState(null);
  const [secondsRemaining, setSecondsRemaining] = useState(45 * 60); // 45 minutes SLA
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Form states
  const [client, setClient] = useState('');
  const [cuit, setCuit] = useState('30-71234567-8');
  const [cargoReadyDate, setCargoReadyDate] = useState('2026-10-15');
  const [isImo, setIsImo] = useState(false);
  const [isFlatRack, setIsFlatRack] = useState(false);
  const [targetRate, setTargetRate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen && quote) {
      setClient(quote.clientName || 'Cliente Corporativo Almar');
      const generated = generateSpotTicket({
        client: quote.clientName || 'Cliente Corporativo Almar',
        origin: `${quote.originCode} - ${quote.originName}`,
        destination: `${quote.destinationCode} - ${quote.destinationName}`,
        equipment: quote.equipmentName,
      });
      setTicket(generated);
      setIsSubmitted(false);
      setSecondsRemaining(45 * 60);
    }
  }, [isOpen, quote]);

  // SLA countdown timer
  useEffect(() => {
    if (!isOpen || secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, secondsRemaining]);

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

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (onShowToast) {
      onShowToast(`🎯 Solicitud Spot ${ticket?.ticketId} radicada con SLA < 45m para la Mesa de Pricing`);
    }
  };

  const emailDraft = `Estimado Partner / Pricing Desk,

Por favor cotizar flete spot marítimo con validez para embarque:
- Ticket Operativo: ${ticket?.ticketId}
- Cliente: ${client} (CUIT ${cuit})
- Origen (POL): ${quote.originName} (${quote.originCode})
- Destino (POD): ${quote.destinationName} (${quote.destinationCode})
- Equipo Requerido: 1x ${quote.equipmentName}
- Cargo Ready Date (CRD): ${cargoReadyDate}
- Carga Peligrosa (IMO/DG): ${isImo ? 'SÍ (Clase DG / Hoja MSDS adjunta)' : 'NO (Carga General)'}
- Equipo Especial: ${isFlatRack ? 'Flat Rack / Open Top (OOG)' : 'Standard Box'}
- Target Rate Solicitado: ${targetRate ? `USD ${targetRate}` : 'Mejor alternativa de mercado'}
- Observaciones: ${notes || 'Priorizar naviera con 21 días libres en destino.'}

Aguardamos su cotización formal antes de las ${ticket?.slaDeadlineFormatted} hs (SLA 45 min).
Saludos cordiales,
Departamento Comercial & Pricing | Almar Rosario S.R.L.
pricing@almarrosario.com · comercial@almarrosario.com`;

  const copyEmail = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(emailDraft);
      }
      setCopiedEmail(true);
      if (onShowToast) onShowToast('📋 Borrador de correo copiado al portapapeles');
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch (err) {
      console.error(err);
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
                color: '#fbbf24',
                background: 'rgba(245, 158, 11, 0.12)',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
              }}>
                Mesa Operativa On-Demand
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontVariantNumeric: 'tabular-nums' }}>
                Ticket: {ticket?.ticketId}
              </span>
            </div>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              margin: '0.35rem 0 0 0',
            }}>
              Solicitud de Cotización Spot (Pricing Desk)
            </h2>
            <p style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              margin: '0.2rem 0 0 0',
            }}>
              Canal directo con el área de Pricing de Almar Rosario para tráficos especiales o fuera de matriz.
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

        {/* Live SLA Countdown Banner */}
        <div style={{
          marginTop: '1.25rem',
          padding: '0.85rem 1.15rem',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.05) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fbbf24',
            }}>
              <Clock size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fbbf24' }}>
                Tiempo Estimado de Respuesta: &lt; 45 Minutos Hábiles
              </div>
              <div style={{ fontSize: '0.73rem', color: '#fde68a' }}>
                Canal: <strong>pricing@almarrosario.com</strong> (Mesa Operativa de Pricing)
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#fbbf24',
              fontVariantNumeric: 'tabular-nums',
              fontFamily: 'var(--font-heading)',
            }}>
              {timeFormatted}
            </div>
            <div style={{ fontSize: '0.68rem', color: '#fde68a' }}>
              Límite respuesta: {ticket?.slaDeadlineFormatted} hs
            </div>
          </div>
        </div>

        {!isSubmitted ? (
          /* Form */
          <form onSubmit={handleSubmit} style={{ marginTop: '1.25rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
            }}>
              {/* Cliente */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Empresa Cliente
                </label>
                <input
                  type="text"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  className="number-input"
                  required
                />
              </div>

              {/* CUIT */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  CUIT Importador / Exportador
                </label>
                <input
                  type="text"
                  value={cuit}
                  onChange={(e) => setCuit(e.target.value)}
                  className="number-input"
                  required
                />
              </div>

              {/* Cargo Ready Date */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Cargo Ready Date (CRD)
                </label>
                <input
                  type="date"
                  value={cargoReadyDate}
                  onChange={(e) => setCargoReadyDate(e.target.value)}
                  className="number-input"
                  required
                />
              </div>

              {/* Target Rate USD */}
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                  Target Rate Cliente (USD / opcional)
                </label>
                <input
                  type="number"
                  placeholder="Ej: 5200"
                  value={targetRate}
                  onChange={(e) => setTargetRate(e.target.value)}
                  className="number-input"
                />
              </div>
            </div>

            {/* Special Cargo Checkboxes */}
            <div style={{
              marginTop: '1rem',
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              flexWrap: 'wrap',
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)' }}>
                Requisitos Especiales:
              </span>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', cursor: 'pointer', color: isImo ? '#fbbf24' : 'var(--text-muted)' }}>
                <input
                  type="checkbox"
                  checked={isImo}
                  onChange={(e) => setIsImo(e.target.checked)}
                  style={{ accentColor: '#f59e0b' }}
                />
                <Flame size={14} style={{ color: '#f59e0b' }} />
                <span>Mercancía Peligrosa (IMO / DG)</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', cursor: 'pointer', color: isFlatRack ? 'var(--primary)' : 'var(--text-muted)' }}>
                <input
                  type="checkbox"
                  checked={isFlatRack}
                  onChange={(e) => setIsFlatRack(e.target.checked)}
                  style={{ accentColor: 'var(--primary)' }}
                />
                <Shield size={14} style={{ color: 'var(--primary)' }} />
                <span>Equipo Especial (Flat Rack / Open Top / OOG)</span>
              </label>
            </div>

            {/* Notes */}
            <div style={{ marginTop: '1rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                Observaciones Particulares para la Mesa Operativa:
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Indicar naviera preferida, si requiere transbordo específico, o flete de importación/exportación..."
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.25)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '0.65rem',
                  color: 'var(--text-main)',
                  fontSize: '0.8rem',
                  outline: 'none',
                  fontFamily: 'var(--font-body)',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Actions */}
            <div style={{
              marginTop: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            }}>
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                style={{ fontSize: '0.82rem' }}
              >
                Cancelar
              </button>

              <button
                type="submit"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                  border: 'none',
                  color: '#000000',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)',
                }}
              >
                <Send size={15} />
                <span>Enviar Solicitud a Mesa de Pricing</span>
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation & Generated Email Draft */
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{
              padding: '1rem 1.25rem',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1rem',
            }}>
              <CheckCircle2 size={24} />
              <div>
                <strong style={{ fontSize: '0.92rem' }}>Solicitud {ticket?.ticketId} Notificada con Éxito</strong>
                <div style={{ fontSize: '0.75rem', color: '#a7f3d0' }}>
                  Solicitud registrada en la Mesa Operativa de Pricing (pricing@almarrosario.com).
                </div>
              </div>
            </div>

            {/* Email draft */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.4rem',
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)' }}>
                  Borrador de Solicitud para Armadores / Agentes de Origen:
                </span>
                <button
                  type="button"
                  onClick={copyEmail}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: 'none',
                    border: 'none',
                    color: copiedEmail ? '#10b981' : 'var(--primary)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {copiedEmail ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedEmail ? '¡Copiado!' : 'Copiar Email'}</span>
                </button>
              </div>

              <pre style={{
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                borderRadius: '8px',
                padding: '1rem',
                color: '#e2e8f0',
                fontSize: '0.75rem',
                lineHeight: '1.5',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                maxHeight: '220px',
                overflowY: 'auto',
              }}>
                {emailDraft}
              </pre>
            </div>

            <div style={{
              marginTop: '1.25rem',
              display: 'flex',
              justifyContent: 'flex-end',
              paddingTop: '0.85rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            }}>
              <button
                type="button"
                onClick={onClose}
                className="btn-primary"
                style={{ fontSize: '0.82rem', padding: '0.5rem 1.25rem' }}
              >
                Entendido / Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

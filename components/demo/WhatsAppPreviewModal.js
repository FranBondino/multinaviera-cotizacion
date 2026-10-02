'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageSquare, 
  Copy, 
  Check, 
  ExternalLink, 
  Send,
  User,
  Phone,
  Sparkles
} from 'lucide-react';
import { formatWhatsAppMessage } from '../../lib/demoData';

export default function WhatsAppPreviewModal({ isOpen, onClose, quote, onShowToast }) {
  const [copied, setCopied] = useState(false);
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      setCopied(false);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !quote) return null;

  const rawMessage = formatWhatsAppMessage(quote);

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(rawMessage);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = rawMessage;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      if (onShowToast) {
        onShowToast('✅ Propuesta formal copiada al portapapeles para WhatsApp/Email');
      }
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleOpenWhatsApp = () => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(rawMessage);
    const url = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank');
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
          maxWidth: '640px',
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
                color: '#10b981',
                background: 'rgba(16, 185, 129, 0.12)',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
              }}>
                Generador de Propuesta Comercial
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                WhatsApp Directo
              </span>
            </div>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              margin: '0.35rem 0 0 0',
            }}>
              Propuesta Comercial Formal
            </h2>
            <p style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              margin: '0.2rem 0 0 0',
            }}>
              Plantilla estándar de cotización comercial para clientes.
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
          >
            <X size={18} />
          </button>
        </div>

        {/* Optional Phone input */}
        <div style={{
          marginTop: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: 'rgba(0,0,0,0.25)',
          padding: '0.65rem 0.85rem',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}>
          <Phone size={15} style={{ color: '#10b981' }} />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            N° Celular Cliente (Opcional):
          </span>
          <input
            type="text"
            placeholder="Ej: +54 9 341 555 1234"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main)',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-body)',
              flex: 1,
            }}
          />
        </div>

        {/* Proposal Text Box */}
        <div style={{ marginTop: '1rem', position: 'relative' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.4rem',
          }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-dim)' }}>
              Texto Renderizado Listo para Enviar:
            </span>
            <span style={{ fontSize: '0.72rem', color: '#10b981' }}>
              Incluye buque DCSA, 21 días libres y tipo de cambio BNA
            </span>
          </div>

          <pre style={{
            background: 'rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderRadius: '10px',
            padding: '1.1rem',
            color: '#e2e8f0',
            fontSize: '0.78rem',
            lineHeight: '1.55',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            maxHeight: '340px',
            overflowY: 'auto',
          }}>
            {rawMessage}
          </pre>
        </div>

        {/* Action Buttons */}
        <div style={{
          marginTop: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        }}>
          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.6rem 1.1rem',
              borderRadius: '8px',
              background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
              border: copied ? '1px solid #10b981' : '1px solid var(--border-subtle)',
              color: copied ? '#34d399' : 'var(--text-main)',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? '¡Copiado con Éxito!' : 'Copiar Texto para WhatsApp / Email'}</span>
          </button>

          {/* Direct Launch WhatsApp Web */}
          <button
            type="button"
            onClick={handleOpenWhatsApp}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.6rem 1.25rem',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              color: '#ffffff',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
            }}
          >
            <MessageSquare size={16} />
            <span>Abrir WhatsApp Web</span>
            <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

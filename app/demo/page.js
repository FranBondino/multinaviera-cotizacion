'use client';

import React, { useState, useMemo, useEffect } from 'react';
import DemoHeader from '../../components/demo/DemoHeader';
import PortSelectorChips from '../../components/demo/PortSelectorChips';
import FilterBar from '../../components/demo/FilterBar';
import RateCard from '../../components/demo/RateCard';
import CostBreakdownModal from '../../components/demo/CostBreakdownModal';
import WhatsAppPreviewModal from '../../components/demo/WhatsAppPreviewModal';
import KipintochExportModal from '../../components/demo/KipintochExportModal';
import PdfQuoteModal from '../../components/demo/PdfQuoteModal';

import { 
  getDemoRates, 
  calculateQuote, 
  formatUSD, 
  ORIGIN_PORTS, 
  PORT_OPTIONS,
  DCSA_VESSELS
} from '../../lib/demoData';

import { 
  Ship, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Compass, 
  ArrowRight,
  TrendingDown,
  Clock,
  ShieldCheck,
  Zap,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export default function DemoPage() {
  // 1. Reactive State (Starts completely neutral with no preset or client pre-filled)
  const [selectedDestination, setSelectedDestination] = useState('ARROS');
  const [origin, setOrigin] = useState('CNNGB');
  const [equipment, setEquipment] = useState('40HC');
  const [cargoWeightKg, setCargoWeightKg] = useState(18500);
  const [marginUSD, setMarginUSD] = useState(250);
  const [includeRoadFreight, setIncludeRoadFreight] = useState(false);
  const [sortBy, setSortBy] = useState('cheapest');
  const [clientName, setClientName] = useState('');

  // Modal states
  const [modalType, setModalType] = useState(null); // 'cost' | 'whatsapp' | 'pdf' | 'kipintoch' | 'spot'
  const [activeQuote, setActiveQuote] = useState(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Switch equipment helper to adjust default margin automatically
  const handleEquipmentChange = (newEquip) => {
    setEquipment(newEquip);
    if (newEquip === '20GP') {
      setMarginUSD(200);
    } else if (newEquip === '40HC') {
      setMarginUSD(250);
    }
  };

  // Compute live quotes from verified Eversail W40/W41 dataset
  const quotes = useMemo(() => {
    const rawQuotes = getDemoRates({
      originCode: origin,
      destinationCode: selectedDestination,
      equipment,
      cargoWeightKg,
      marginUSD,
      includeRoadFreight,
      clientName,
    });

    // Apply sorting
    const sorted = [...rawQuotes].sort((a, b) => {
      if (sortBy === 'cheapest') {
        return a.pricing.oceanFreightTotalUSD - b.pricing.oceanFreightTotalUSD;
      }
      if (sortBy === 'fastest') {
        const getDays = (q) => {
          const match = q.transitTimeText.match(/(\d+)/);
          return match ? parseInt(match[0], 10) : 50;
        };
        return getDays(a) - getDays(b);
      }
      if (sortBy === 'best_deal') {
        // Maersk or ONE preferred
        const scoreA = (a.carrierCode === 'MSK' ? 10 : 0) - a.pricing.oceanFreightTotalUSD / 1000;
        const scoreB = (b.carrierCode === 'MSK' ? 10 : 0) - b.pricing.oceanFreightTotalUSD / 1000;
        return scoreB - scoreA;
      }
      return 0;
    });

    return sorted;
  }, [
    origin, 
    selectedDestination, 
    equipment, 
    cargoWeightKg, 
    marginUSD, 
    includeRoadFreight, 
    sortBy, 
    clientName, 
  ]);

  // Handler to open specific modal
  const handleOpenModal = (type, quote) => {
    setActiveQuote(quote);
    setModalType(type);
  };

  const handleCloseModal = () => {
    setModalType(null);
    setActiveQuote(null);
  };

  // Metrics summary
  const lowestRate = quotes.length > 0
    ? Math.min(...quotes.map(q => q.pricing.oceanFreightTotalUSD))
    : 0;

  return (
    <main style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* 1. Header */}
      <DemoHeader />

      {/* 2. Destination Port Selector Chips */}
      <PortSelectorChips
        selectedDestination={selectedDestination}
        onSelectDestination={setSelectedDestination}
        includeRoadFreight={includeRoadFreight}
        onToggleRoadFreight={setIncludeRoadFreight}
      />

      {/* 3. Parameter & Filter Bar */}
      <FilterBar
        origin={origin}
        onChangeOrigin={setOrigin}
        equipment={equipment}
        onChangeEquipment={handleEquipmentChange}
        cargoWeightKg={cargoWeightKg}
        onChangeCargoWeight={setCargoWeightKg}
        marginUSD={marginUSD}
        onChangeMargin={setMarginUSD}
        sortBy={sortBy}
        onChangeSortBy={setSortBy}
        clientName={clientName}
        onChangeClientName={setClientName}
      />

      {/* 4. Live Results Header & Metrics Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1rem',
        padding: '0.75rem 1rem',
        borderRadius: '10px',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Ship size={18} style={{ color: 'var(--primary)' }} />
          <div>
            <h3 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
              {quotes.length} Alternativas Oficiales Disponibles
            </h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Ruta: {quotes[0]?.originName} ({origin}) ➔ {quotes[0]?.destinationName} ({selectedDestination}) · 1x {equipment}
            </span>
          </div>
        </div>

        {/* Quick summary stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Tarifa Mínima Venta</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#10b981', fontVariantNumeric: 'tabular-nums' }}>
              USD {formatUSD(lowestRate)}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Días Libres en Destino</span>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#38bdf8' }}>
              21 Días Libres
            </div>
          </div>
        </div>
      </div>

      {/* 5. Rate Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {quotes.map((quote, index) => (
          <RateCard
            key={quote.quoteNumber || index}
            quote={quote}
            isBestDeal={index === 0}
            onOpenCostBreakdown={(q) => handleOpenModal('cost', q)}
            onOpenWhatsApp={(q) => handleOpenModal('whatsapp', q)}
            onOpenPdf={(q) => handleOpenModal('pdf', q)}
            onOpenKipintoch={(q) => handleOpenModal('kipintoch', q)}
          />
        ))}

        {quotes.length === 0 && (
          <div className="glass-panel" style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            color: 'var(--text-muted)',
          }}>
            <AlertCircle size={36} style={{ color: '#f59e0b', margin: '0 auto 0.75rem auto' }} />
            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              Ruta no disponible en tarifario consolidado semanal
            </h4>
            <p style={{ fontSize: '0.85rem', maxWidth: '540px', margin: '0 auto 1.5rem auto', lineHeight: 1.5 }}>
              Para corredores fuera de Asia (Europa, EE.UU. o cargas especiales), las tarifas no se reciben en listas fijas semanales; se consultan directamente en el portal oficial de cada naviera con la cuenta comercial de Almar.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a
                href="https://www.maersk.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}
              >
                <span>Portal Maersk Spot</span>
                <ExternalLink size={13} />
              </a>
              <a
                href="https://www.hapag-lloyd.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}
              >
                <span>Hapag Quick Quotes</span>
                <ExternalLink size={13} />
              </a>
              <a
                href="https://www.msc.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem' }}
              >
                <span>Portal myMSC</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* 6. Modals */}
      <CostBreakdownModal
        isOpen={modalType === 'cost'}
        onClose={handleCloseModal}
        quote={activeQuote}
      />

      <WhatsAppPreviewModal
        isOpen={modalType === 'whatsapp'}
        onClose={handleCloseModal}
        quote={activeQuote}
        onShowToast={showToast}
      />

      <KipintochExportModal
        isOpen={modalType === 'kipintoch'}
        onClose={handleCloseModal}
        quote={activeQuote}
        onShowToast={showToast}
      />

      <PdfQuoteModal
        isOpen={modalType === 'pdf'}
        onClose={handleCloseModal}
        quote={activeQuote}
      />

      {/* 7. Toast Notification Floating Banner */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          backgroundColor: '#0D1424',
          color: 'var(--text-main)',
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          border: '1px solid var(--primary)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 0 15px rgba(6, 182, 212, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          zIndex: 9999,
          fontSize: '0.85rem',
          fontWeight: 600,
          animation: 'slideUpFade 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          <CheckCircle2 size={18} style={{ color: '#10b981' }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </main>
  );
}

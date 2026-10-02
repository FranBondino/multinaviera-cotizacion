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
import SpotInquiryModal from '../../components/demo/SpotInquiryModal';

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
  HelpCircle
} from 'lucide-react';

// Real commercial presets representing frequent operations
const OPERATIONAL_PRESETS = [
  {
    id: 'preset-fundemap',
    label: 'Fundemap (40HC Ningbo TPR)',
    clientName: 'Fundemap S.R.L.',
    origin: 'CNNGB',
    destination: 'ARROS',
    equipment: '40HC',
    weightKg: 18500,
    marginUSD: 250,
    includeRoadFreight: false,
  },
  {
    id: 'preset-secco',
    label: 'Secco (20GP Shanghai BUE + Camión)',
    clientName: 'Industrias Secco S.A.',
    origin: 'CNSHA',
    destination: 'ARBUE',
    equipment: '20GP',
    weightKg: 22400, // > 20 tn to trigger HWS alert
    marginUSD: 200,
    includeRoadFreight: true,
  },
  {
    id: 'preset-disden',
    label: 'Disden (40HC Shenzhen TPR)',
    clientName: 'Disden S.A.',
    origin: 'CNSZX',
    destination: 'ARROS',
    equipment: '40HC',
    weightKg: 19800,
    marginUSD: 250,
    includeRoadFreight: false,
  },
  {
    id: 'preset-ternium',
    label: 'Ternium (20GP Tianjin TPR Heavy)',
    clientName: 'Ternium Siderar S.A.',
    origin: 'CNTXG',
    destination: 'ARROS',
    equipment: '20GP',
    weightKg: 24500, // Heavy weight
    marginUSD: 200,
    includeRoadFreight: false,
  },
  {
    id: 'preset-spot-europe',
    label: 'Hamburgo Spot (Europa / LCL)',
    clientName: 'Importadora Centro S.R.L.',
    origin: 'DEHAM',
    destination: 'ARROS',
    equipment: '40HC',
    weightKg: 16000,
    marginUSD: 300,
    includeRoadFreight: false,
  },
];

export default function DemoPage() {
  // 1. Reactive State
  const [selectedDestination, setSelectedDestination] = useState('ARROS');
  const [origin, setOrigin] = useState('CNNGB');
  const [equipment, setEquipment] = useState('40HC');
  const [cargoWeightKg, setCargoWeightKg] = useState(18500);
  const [marginUSD, setMarginUSD] = useState(250);
  const [includeRoadFreight, setIncludeRoadFreight] = useState(false);
  const [sortBy, setSortBy] = useState('cheapest');
  const [clientName, setClientName] = useState('Fundemap S.R.L.');
  const [activePreset, setActivePreset] = useState('preset-fundemap');

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

  // Apply quick preset
  const handleSelectPreset = (preset) => {
    setActivePreset(preset.id);
    setClientName(preset.clientName);
    setOrigin(preset.origin);
    setSelectedDestination(preset.destination);
    setEquipment(preset.equipment);
    setCargoWeightKg(preset.weightKg);
    setMarginUSD(preset.marginUSD);
    setIncludeRoadFreight(preset.includeRoadFreight);
    showToast(`🎯 Parámetros cargados: Caso real ${preset.clientName}`);
  };

  // Determine if origin is Spot (non-Asia)
  const isSpotOrigin = !['CNSHA', 'CNNGB', 'CNSZX', 'CNTAO', 'CNTXG'].includes(origin) ||
    equipment === '40NOR' ||
    equipment === 'LCL';

  // Compute live quotes
  const quotes = useMemo(() => {
    if (isSpotOrigin) {
      // Generate realistic assisted Spot Options for European / American / LCL routes
      const spotVessel = DCSA_VESSELS[0];
      const destObj = PORT_OPTIONS.find(p => p.code === selectedDestination) || PORT_OPTIONS[0];
      const isTPR = selectedDestination === 'ARROS';

      const spotMock1 = {
        quoteNumber: `SPOT-2026-${Math.floor(1100 + Math.random() * 200)}`,
        clientName,
        originCode: origin,
        originName: origin === 'DEHAM' ? 'Hamburgo' : origin === 'ITGOA' ? 'Génova' : origin === 'USCHS' ? 'Charleston' : 'Santos',
        originFullName: origin,
        destinationCode: selectedDestination,
        destinationName: destObj.name,
        destinationFullName: destObj.fullName,
        isTPR,
        isBUE: selectedDestination === 'ARBUE',
        equipment,
        equipmentName: equipment === '40HC' ? "40' High Cube" : equipment === '20GP' ? "20' GP" : equipment,
        carrier: 'Hapag-Lloyd / Consolidadores Europeos',
        carrierCode: 'HAPAG',
        carrierColor: '#ea580c',
        service: 'Atlantic / Mediterranean Express',
        vessel: 'King of the Seas / 2103N',
        etd: '2026-10-18',
        eta: isTPR ? '2026-11-25' : '2026-11-15',
        cutOff: '2026-10-14',
        transitTimeText: isTPR ? '38-44 días (vía feeder)' : '28-34 días (directo)',
        freeDays: 21,
        cargoWeightKg,
        appliesHWS: false,
        validityToText: '15/Oct/2026',
        statusBadge: '🟡 EN COTIZACIÓN ASISTIDA POR MESA OPERATIVA',
        isSpot: true,
        pricing: {
          baseFreightUSD: equipment === '40HC' ? 4800 : 4200,
          buyFreeTimeUSD: 100,
          vesselProtectionUSD: 29,
          arbitraryFeederUSD: isTPR ? 150 : 0,
          hwsSurchargeUSD: 0,
          marginUSD,
          oceanFreightCostUSD: equipment === '40HC' ? 4929 : 4329,
          oceanFreightTotalUSD: (equipment === '40HC' ? 4929 : 4329) + marginUSD,
          agencyFeeUSD: 800,
          docFeeUSD: 75,
          docFeeVatUSD: 15.75,
          peajeHidroviaUSD: isTPR ? 175 : 0,
          roadFreightUSD: (selectedDestination === 'ARBUE' && includeRoadFreight) ? 700 : 0,
          insuranceUSD: 0,
          insuranceVatUSD: 0,
          destinationChargesTotalUSD: (isTPR ? 1065.75 : 890.75) + ((selectedDestination === 'ARBUE' && includeRoadFreight) ? 700 : 0),
          grandTotalUSD: ((equipment === '40HC' ? 4929 : 4329) + marginUSD) + (isTPR ? 1065.75 : 890.75) + ((selectedDestination === 'ARBUE' && includeRoadFreight) ? 700 : 0),
        },
      };

      const spotMock2 = {
        quoteNumber: `SPOT-2026-${Math.floor(1300 + Math.random() * 200)}`,
        clientName,
        originCode: origin,
        originName: spotMock1.originName,
        originFullName: origin,
        destinationCode: selectedDestination,
        destinationName: destObj.name,
        destinationFullName: destObj.fullName,
        isTPR,
        isBUE: selectedDestination === 'ARBUE',
        equipment,
        equipmentName: spotMock1.equipmentName,
        carrier: 'MSC (Mediterranean Shipping Co.)',
        carrierCode: 'MSC',
        carrierColor: '#1a1a1a',
        service: 'North West Europe / South America East Coast',
        vessel: 'MSC CLEA / 2639S',
        etd: '2026-10-15',
        eta: isTPR ? '2026-11-22' : '2026-11-12',
        cutOff: '2026-10-11',
        transitTimeText: isTPR ? '37-42 días' : '27-32 días',
        freeDays: 21,
        cargoWeightKg,
        appliesHWS: false,
        validityToText: '15/Oct/2026',
        statusBadge: '🟡 EN COTIZACIÓN ASISTIDA POR MESA OPERATIVA',
        isSpot: true,
        pricing: {
          baseFreightUSD: equipment === '40HC' ? 4950 : 4350,
          buyFreeTimeUSD: 100,
          vesselProtectionUSD: 29,
          arbitraryFeederUSD: isTPR ? 150 : 0,
          hwsSurchargeUSD: 0,
          marginUSD,
          oceanFreightCostUSD: equipment === '40HC' ? 5079 : 4479,
          oceanFreightTotalUSD: (equipment === '40HC' ? 5079 : 4479) + marginUSD,
          agencyFeeUSD: 800,
          docFeeUSD: 75,
          docFeeVatUSD: 15.75,
          peajeHidroviaUSD: isTPR ? 175 : 0,
          roadFreightUSD: (selectedDestination === 'ARBUE' && includeRoadFreight) ? 700 : 0,
          insuranceUSD: 0,
          insuranceVatUSD: 0,
          destinationChargesTotalUSD: (isTPR ? 1065.75 : 890.75) + ((selectedDestination === 'ARBUE' && includeRoadFreight) ? 700 : 0),
          grandTotalUSD: ((equipment === '40HC' ? 5079 : 4479) + marginUSD) + (isTPR ? 1065.75 : 890.75) + ((selectedDestination === 'ARBUE' && includeRoadFreight) ? 700 : 0),
        },
      };

      return [spotMock1, spotMock2];
    }

    // Standard Asia trade lanes: query actual Eversail W40/W41 dataset
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
    isSpotOrigin
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
      <DemoHeader
        activePreset={activePreset}
        onSelectPreset={handleSelectPreset}
        presets={OPERATIONAL_PRESETS}
      />

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
            isBestDeal={index === 0 && !isSpotOrigin}
            isSpotRoute={isSpotOrigin}
            onOpenCostBreakdown={(q) => handleOpenModal('cost', q)}
            onOpenWhatsApp={(q) => handleOpenModal('whatsapp', q)}
            onOpenPdf={(q) => handleOpenModal('pdf', q)}
            onOpenKipintoch={(q) => handleOpenModal('kipintoch', q)}
            onOpenSpotInquiry={(q) => handleOpenModal('spot', q)}
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
              No se encontraron itinerarios directos para este tráfico
            </h4>
            <p style={{ fontSize: '0.82rem', maxWidth: '480px', margin: '0 auto 1.25rem auto' }}>
              La combinación seleccionada requiere cotización personalizada con la Mesa Operativa de Pricing.
            </p>
            <button
              type="button"
              onClick={() => handleOpenModal('spot', calculateQuote({ originCode: origin, destinationCode: selectedDestination, equipment, clientName }))}
              className="btn-primary"
              style={{ fontSize: '0.85rem' }}
            >
              Solicitar Cotización Spot a Pricing
            </button>
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

      <SpotInquiryModal
        isOpen={modalType === 'spot'}
        onClose={handleCloseModal}
        quote={activeQuote}
        onShowToast={showToast}
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

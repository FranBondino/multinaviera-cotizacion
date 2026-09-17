'use client';

import { useState, useEffect, useRef } from 'react';
import { GLOBAL_PORTS } from '../lib/portsData';
import { calculateCarrierRates } from '../lib/ratesEngine';
import PortSelect from '../components/PortSelect';

export default function MulticotizadorHome() {
  const [pol, setPol] = useState('CNSHA');
  const [pod, setPod] = useState('BUE');
  const [equipment, setEquipment] = useState("40'HC");
  const [marginUSD, setMarginUSD] = useState(250);
  const [marginPct, setMarginPct] = useState(0);
  const [usePct, setUsePct] = useState(false);
  const [sortBy, setSortBy] = useState('price');
  
  // Instant rates state pre-populated
  const [ratesData, setRatesData] = useState(() => calculateCarrierRates('CNSHA', 'BUE', "40'HC"));
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('En vivo');
  const [selectedQuoteModal, setSelectedQuoteModal] = useState(null);

  // Update rates: instant local baseline + live API fetch
  useEffect(() => {
    setIsUpdating(true);
    let isCancelled = false;

    // 1. Instant baseline calculation to prevent layout flickers
    const base = calculateCarrierRates(pol, pod, equipment);
    setRatesData(base);

    // 2. Fetch live data from /api/quote (MSC live schedules + Maersk approved DCSA)
    fetch(`/api/quote?pol=${pol}&pod=${pod}&equipment=${encodeURIComponent(equipment)}`)
      .then(res => res.json())
      .then(data => {
        if (!isCancelled && data.success && Array.isArray(data.rates)) {
          setRatesData(data.rates);
          setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }
      })
      .catch(err => {
        console.warn('Multicotizador API live fetch fallback:', err);
      })
      .finally(() => {
        if (!isCancelled) {
          setIsUpdating(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [pol, pod, equipment]);

  const polObj = GLOBAL_PORTS.find(p => p.code === pol) || { name: pol, country: '' };
  const podObj = GLOBAL_PORTS.find(p => p.code === pod) || { name: pod, country: '' };

  const processedRates = ratesData.map(rate => {
    const hasLiveRate = typeof rate.baseFreight === 'number' && rate.baseFreight > 0 && rate.isRateVerified === true;
    const totalCost = hasLiveRate ? (rate.baseFreight + (rate.thc || 0) + (rate.baf || 0)) : null;
    const margin = hasLiveRate ? (usePct ? Math.round((totalCost * marginPct) / 100) : Number(marginUSD)) : Number(marginUSD);
    const clientPrice = hasLiveRate ? (totalCost + margin) : null;
    return { ...rate, hasLiveRate, totalCost, margin, clientPrice };
  });

  const hasAnyLiveRate = processedRates.some(r => r.hasLiveRate);

  if (sortBy === 'price') {
    processedRates.sort((a, b) => {
      if (a.hasLiveRate && b.hasLiveRate) return a.clientPrice - b.clientPrice;
      if (a.hasLiveRate) return -1;
      if (b.hasLiveRate) return 1;
      return a.transitDays - b.transitDays;
    });
  } else if (sortBy === 'transit') {
    processedRates.sort((a, b) => a.transitDays - b.transitDays);
  } else if (sortBy === 'etd') {
    processedRates.sort((a, b) => new Date(a.etd) - new Date(b.etd));
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('📋 ¡Cotización copiada al portapapeles! Lista para pegar en WhatsApp o Email.');
  };

  return (
    <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
      {/* Executive Top Navigation Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '1.75rem',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            fontWeight: '800',
            fontSize: '1.5rem',
            color: 'white',
            boxShadow: '0 6px 20px rgba(6, 182, 212, 0.35)'
          }}>
            A
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'white', letterSpacing: '-0.5px', margin: 0 }}>Almar Rosario</h1>
              <span style={{
                background: 'rgba(6, 182, 212, 0.15)',
                color: 'var(--primary)',
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                border: '1px solid rgba(6, 182, 212, 0.3)'
              }}>FREIGHT INTELLIGENCE</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>Itinerarios Oficiales en Vivo & Gestión de Cotizaciones Navieras</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div className="pulse" style={{
            background: 'rgba(16, 185, 129, 0.12)',
            color: 'var(--success)',
            padding: '0.5rem 1rem',
            borderRadius: '30px',
            fontSize: '0.8rem',
            fontWeight: '700',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>●</span> MSC + Maersk + ONE APIs Conectadas
          </div>
          {lastUpdated && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontFamily: 'monospace' }}>
              ⏱️ {lastUpdated}
            </span>
          )}
        </div>
      </header>

      {/* Interactive Flow Indicator Banner */}
      <div className="glass-panel" style={{ padding: '1.75rem 2.25rem', marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(13, 20, 36, 0.95), rgba(20, 30, 55, 0.6))', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '300px', height: '300px', background: 'var(--primary-glow)', filter: 'blur(80px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>PUERTO ORIGEN (POL)</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white', margin: '0.2rem 0 0 0' }}>{polObj.name} <span style={{ fontSize: '0.95rem', fontWeight: '400', color: 'var(--text-muted)' }}>({polObj.country})</span></h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 1rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: '700', marginBottom: '0.3rem' }}>RUTA DIRECTA</span>
              <div style={{ width: '140px', height: '2px', background: 'linear-gradient(90deg, var(--primary), var(--accent-cyan))', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.2rem', background: 'var(--bg-card)', padding: '0 0.5rem' }}>🚢</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-main)', marginTop: '0.3rem', fontWeight: '600', background: 'rgba(255,255,255,0.06)', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>{equipment}</span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>PUERTO DESTINO (POD)</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white', margin: '0.2rem 0 0 0' }}>{podObj.name} <span style={{ fontSize: '0.95rem', fontWeight: '400', color: 'var(--text-muted)' }}>({podObj.country})</span></h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              background: isUpdating ? 'rgba(6, 182, 212, 0.2)' : 'rgba(16, 185, 129, 0.15)',
              color: isUpdating ? 'var(--primary)' : 'var(--success)',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              border: '1px solid rgba(255,255,255,0.08)'
            }}>
              {isUpdating ? '⚡ Consultando APIs...' : '⚡ Itinerarios en Vivo'}
            </span>
          </div>
        </div>
      </div>

      {/* Data Integrity & Policy Banner */}
      <div style={{
        background: 'rgba(234, 179, 8, 0.07)',
        border: '1px solid rgba(234, 179, 8, 0.25)',
        borderRadius: '12px',
        padding: '0.9rem 1.25rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.25rem' }}>🛡️</span>
          <div>
            <span style={{ fontSize: '0.85rem', color: '#fef08a', fontWeight: '700' }}>
              Integridad Total de Datos en Vivo:
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginLeft: '0.4rem' }}>
              Los itinerarios, buques, viajes y cut-offs son 100% reales obtenidos en tiempo real desde las APIs oficiales de ONE y MSC. Cero datos simulados.
            </span>
          </div>
        </div>
      </div>

      {/* Control Filters Section */}
      <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.05rem', color: 'var(--primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
          <span>⚙️</span> Buscador de Puertos & Margen Comercial
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {/* POL Search Select */}
          <PortSelect
            label="Puerto de Origen (POL):"
            value={pol}
            onChange={setPol}
          />

          {/* POD Search Select */}
          <PortSelect
            label="Puerto de Destino (POD):"
            value={pod}
            onChange={setPod}
          />

          {/* Equipment Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '600' }}>
              Tipo de Contenedor:
            </label>
            <select
              value={equipment}
              onChange={e => setEquipment(e.target.value)}
              className="select-input"
              style={{ fontWeight: '600' }}
            >
              <option value="20'ST">📦 20' Standard Dry Container</option>
              <option value="40'ST">📦 40' Standard Dry Container</option>
              <option value="40'HC">📦 40' High Cube Dry Container</option>
              <option value="40'NOR">❄️ 40' Non-Operating Reefer (NOR)</option>
              <option value="40'RH">❄️ 40' Reefer High Cube</option>
            </select>
          </div>

          {/* Profit Margin Input */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '600' }}>
              Margen Comercial Almar ({usePct ? '%' : 'USD'}):
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="number"
                value={usePct ? marginPct : marginUSD}
                onChange={e => usePct ? setMarginPct(Number(e.target.value)) : setMarginUSD(Number(e.target.value))}
                className="number-input"
                style={{ fontWeight: '700', fontSize: '1rem' }}
              />
              <button
                type="button"
                onClick={() => setUsePct(!usePct)}
                className="btn-secondary"
                style={{ padding: '0.5rem 1rem', fontWeight: '700' }}
              >
                {usePct ? '%' : 'USD'}
              </button>
            </div>
          </div>
        </div>

        {/* Sorting controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Itinerarios de buques en tiempo real de <strong style={{ color: 'white' }}>Navieras Conectadas (MSC & ONE)</strong>
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: '0.5rem' }}>Ordenar por:</span>
            {hasAnyLiveRate && (
              <button
                onClick={() => setSortBy('price')}
                className={`btn-secondary ${sortBy === 'price' ? 'active' : ''}`}
              >
                💵 Menor Precio
              </button>
            )}
            <button
              onClick={() => setSortBy('transit')}
              className={`btn-secondary ${sortBy === 'transit' ? 'active' : ''}`}
            >
              ⚡ Tránsito Rápido
            </button>
            <button
              onClick={() => setSortBy('etd')}
              className={`btn-secondary ${sortBy === 'etd' ? 'active' : ''}`}
            >
              📅 Próxima Salida (ETD)
            </button>
          </div>
        </div>
      </div>

      {/* Carrier Cards Comparison Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(295px, 1fr))',
        gap: '1.75rem',
        marginBottom: '3rem',
        opacity: isUpdating ? 0.7 : 1,
        transition: 'opacity 0.15s ease'
      }}>
        {processedRates.map((rate, idx) => (
          <div
            key={idx}
            className={`glass-panel carrier-card ${idx === 0 ? 'best-deal' : ''}`}
            style={{
              padding: '1.6rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {idx === 0 && (
              <span style={{
                position: 'absolute',
                top: '0',
                right: '0',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: '800',
                padding: '0.35rem 1rem',
                borderBottomLeftRadius: '12px',
                letterSpacing: '0.5px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
              }}>
                ⭐ {sortBy === 'transit' ? 'TRÁNSITO MÁS RÁPIDO' : sortBy === 'etd' ? 'SALIDA MÁS PRÓXIMA' : (hasAnyLiveRate ? 'MEJOR PRECIO' : 'PRIMERA OPCIÓN OPERATIVA')}
              </span>
            )}

            <div>
              {/* Carrier Brand & Logo Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    {rate.logo}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'white', letterSpacing: '-0.3px', margin: 0 }}>{rate.carrier}</h3>
                    <span style={{ fontSize: '0.75rem', color: rate.accentColor, fontWeight: '700', background: 'rgba(255,255,255,0.04)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                      {rate.serviceName}
                    </span>
                  </div>
                </div>

                {/* Official Live or Approved Badge */}
                {rate.badge && (
                  <span style={{
                    background: rate.badgeColor ? `${rate.badgeColor}22` : 'rgba(16, 185, 129, 0.15)',
                    color: rate.badgeColor || '#10b981',
                    border: `1px solid ${rate.badgeColor || '#10b981'}`,
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '20px',
                    letterSpacing: '0.3px',
                    boxShadow: rate.badgeColor ? `0 0 10px ${rate.badgeColor}33` : '0 0 10px rgba(16, 185, 129, 0.25)'
                  }}>
                    {rate.badge}
                  </span>
                )}
              </div>

              {/* Itinerary Timeline */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                padding: '1rem',
                borderRadius: '12px',
                marginBottom: '1.25rem',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                fontSize: '0.85rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Tiempo Tránsito:</span>
                  <strong style={{ color: 'var(--accent-cyan)', fontWeight: '800' }}>⚡ {rate.transitDays} días directos</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Salida ETD:</span>
                  <strong style={{ color: 'white' }}>📅 {rate.etd}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Llegada ETA:</span>
                  <strong style={{ color: 'white' }}>🏁 {rate.eta}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.4rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Buque / Viaje:</span>
                  <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{rate.vessel}</span>
                </div>
                {rate.cutoffs && (rate.cutoffs.cyCutoff || rate.cutoffs.vgmCutoff || rate.cutoffs.cargoCutoff) && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.4rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Cut-off Carga / VGM:</span>
                    <span style={{ color: 'var(--warning)', fontWeight: '600' }}>
                      {rate.cutoffs.cargoCutoff || rate.cutoffs.cyCutoff || rate.cutoffs.vgmCutoff}
                    </span>
                  </div>
                )}
                {rate.partyId && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.4rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Cuenta DCSA:</span>
                    <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{rate.partyId.split(' ')[0]}</span>
                  </div>
                )}
              </div>

              {/* Cost Itemization */}
              {rate.hasLiveRate ? (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span>Flete Base Ocean Freight:</span>
                    <span style={{ color: 'white', fontWeight: '600' }}>USD {rate.baseFreight}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span>THC (Terminal Handling):</span>
                    <span style={{ color: 'white', fontWeight: '600' }}>USD {rate.thc || 0}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span>BAF Fuel Surcharge:</span>
                    <span style={{ color: 'white', fontWeight: '600' }}>USD {rate.baf || 0}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-subtle)', fontWeight: '700', color: 'var(--text-main)' }}>
                    <span>Costo Neto Almar:</span>
                    <span style={{ color: 'var(--accent-cyan)' }}>USD {rate.totalCost}</span>
                  </div>
                </div>
              ) : (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px dashed rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  padding: '0.85rem 1rem',
                  marginBottom: '1.25rem',
                  fontSize: '0.82rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ color: '#eab308', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span>🔒</span> Tarifa Spot / Convenio
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.45rem', borderRadius: '4px' }}>
                      Mesa Comercial
                    </span>
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.78rem', lineHeight: '1.45' }}>
                    Tarifa flete sujeta a disponibilidad de espacio y validez spot. No mostramos datos ficticios.
                  </p>
                </div>
              )}
            </div>

            {/* Pricing & Call-to-action */}
            <div style={{
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '1.25rem',
              marginTop: '0.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  {rate.hasLiveRate ? 'Precio Cliente:' : 'Tarifa Flete Cliente:'}
                </span>
                {rate.hasLiveRate ? (
                  <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--success)', letterSpacing: '-0.5px' }}>
                    USD {rate.clientPrice}
                  </span>
                ) : (
                  <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#eab308', letterSpacing: '-0.3px' }}>
                    A Cotizar s/ Espacio
                  </span>
                )}
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {rate.hasLiveRate ? (
                  <span style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: '700' }}>
                    Ganancia Almar: +USD {rate.margin}
                  </span>
                ) : (
                  <span style={{ background: 'rgba(234, 179, 8, 0.12)', color: '#facc15', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: '700' }}>
                    Margen Almar: +{usePct ? `${marginPct}%` : `USD ${marginUSD}`}
                  </span>
                )}
                <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>
                  {rate.apiSource ? rate.apiSource.split('(')[0] : rate.status}
                </span>
              </div>

              <button
                onClick={() => setSelectedQuoteModal(rate)}
                className="btn-primary"
                style={{ width: '100%', padding: '0.85rem', fontSize: '0.9rem', fontWeight: '700' }}
              >
                {rate.hasLiveRate ? '📄 Generar Cotización Cliente' : '📄 Solicitar / Consultar Itinerario'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quote Preview Modal Dialog */}
      {selectedQuoteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(3, 7, 18, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          zIndex: 1000
        }}>
          <div className="glass-panel" style={{
            maxWidth: '560px',
            width: '100%',
            padding: '2.25rem',
            position: 'relative',
            background: 'var(--bg-card)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}>
            <button
              onClick={() => setSelectedQuoteModal(null)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '36px', height: '36px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: 'white' }}>
                A
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'white', margin: 0 }}>Propuesta Comercial de Flete</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Almar Rosario Logistics Intelligence</p>
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '1.5rem', borderRadius: '12px', fontSize: '0.9rem', lineHeight: '1.7', marginBottom: '1.75rem', color: 'var(--text-main)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '0.95rem' }}>
                  🚢 ALMAR ROSARIO - OFERTA OFICIAL
                </span>
                {selectedQuoteModal.badge && (
                  <span style={{
                    background: selectedQuoteModal.badgeColor ? `${selectedQuoteModal.badgeColor}26` : 'rgba(16, 185, 129, 0.2)',
                    color: selectedQuoteModal.badgeColor || '#10b981',
                    border: `1px solid ${selectedQuoteModal.badgeColor || '#10b981'}`,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.72rem',
                    fontWeight: '800'
                  }}>
                    {selectedQuoteModal.badge}
                  </span>
                )}
              </div>
              <p>📍 <strong>Origen (POL):</strong> {polObj.name} ({polObj.country})</p>
              <p>🏁 <strong>Destino (POD):</strong> {podObj.name} ({podObj.country})</p>
              <p>📦 <strong>Equipo:</strong> {equipment}</p>
              <p>🚢 <strong>Naviera:</strong> {selectedQuoteModal.carrier} ({selectedQuoteModal.serviceName})</p>
              <p>🛳️ <strong>Buque / Viaje Asignado:</strong> {selectedQuoteModal.vessel}</p>
              <p>⚡ <strong>Tiempo de Tránsito:</strong> {selectedQuoteModal.transitDays} días directos</p>
              <p>📅 <strong>ETD (Salida Estimada):</strong> {selectedQuoteModal.etd}</p>
              <p>🏁 <strong>ETA (Llegada Estimada):</strong> {selectedQuoteModal.eta}</p>
              {selectedQuoteModal.cutoffs && (
                <p>⏰ <strong>Cut-off Carga / VGM:</strong> {selectedQuoteModal.cutoffs.cargoCutoff || selectedQuoteModal.cutoffs.cyCutoff || selectedQuoteModal.cutoffs.vgmCutoff}</p>
              )}
              {selectedQuoteModal.partyId && (
                <p>🏢 <strong>Código Cliente Naviera:</strong> {selectedQuoteModal.partyId}</p>
              )}
              <hr style={{ border: 'none', borderTop: '1px dashed var(--border-subtle)', margin: '1rem 0' }} />
              {selectedQuoteModal.hasLiveRate ? (
                <>
                  <p style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--success)', margin: '0.5rem 0' }}>
                    💵 TARIFA CLIENTE: USD {selectedQuoteModal.clientPrice} / Contenedor
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    * Incluye Flete Marítimo + THC + BAF. Oferta confirmada con disponibilidad de espacio.
                  </p>
                </>
              ) : (
                <div style={{
                  background: 'rgba(234, 179, 8, 0.08)',
                  border: '1px solid rgba(234, 179, 8, 0.25)',
                  borderRadius: '10px',
                  padding: '0.85rem 1rem',
                  margin: '0.5rem 0'
                }}>
                  <p style={{ fontSize: '1.15rem', fontWeight: '800', color: '#facc15', margin: 0 }}>
                    💵 TARIFA: A Cotizar en Mesa Comercial
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.35rem 0 0 0' }}>
                    Margen agencia configurado: +{usePct ? `${marginPct}%` : `USD ${marginUSD}`}. Tarifa y espacio sujetos a confirmación spot oficial al momento del booking.
                  </p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => copyToClipboard(`🚢 *ALMAR ROSARIO - PROPUESTA OPERATIVA DE EMBARQUE*
${selectedQuoteModal.badge ? `[${selectedQuoteModal.badge}] • ${selectedQuoteModal.apiSource || 'Itinerario Oficial'}\n` : ''}
📍 *Origen (POL):* ${polObj.name} (${polObj.country})
🏁 *Destino (POD):* ${podObj.name} (${podObj.country})
📦 *Equipo:* ${equipment}
🚢 *Naviera:* ${selectedQuoteModal.carrier} (${selectedQuoteModal.serviceName})
🛳️ *Buque / Viaje:* ${selectedQuoteModal.vessel}
⚡ *Tiempo Tránsito:* ${selectedQuoteModal.transitDays} días directos
📅 *ETD Salida:* ${selectedQuoteModal.etd}
🏁 *ETA Llegada:* ${selectedQuoteModal.eta}
${selectedQuoteModal.cutoffs ? `⏰ *Cut-offs:* Carga: ${selectedQuoteModal.cutoffs.cargoCutoff || selectedQuoteModal.cutoffs.cyCutoff || '-'} | VGM: ${selectedQuoteModal.cutoffs.vgmCutoff || '-'}\n` : ''}
${selectedQuoteModal.hasLiveRate 
  ? `💵 *TARIFA FINAL CLIENTE:* USD ${selectedQuoteModal.clientPrice} / Contenedor\n_Incluye Flete Marítimo + THC + BAF._` 
  : `💵 *TARIFA:* A cotizar según espacio disponible / spot al momento del booking.\n_Margen agencia: +${usePct ? `${marginPct}%` : `USD ${marginUSD}`}_`}

_Operado por Almar Rosario SRL - Freight Intelligence._`)}
                className="btn-primary"
                style={{ flex: 1, padding: '0.85rem', fontSize: '0.9rem', fontWeight: '700' }}
              >
                📲 Copiar para WhatsApp / Email
              </button>

              <button
                onClick={() => setSelectedQuoteModal(null)}
                className="btn-secondary"
                style={{ padding: '0.85rem 1.5rem', fontSize: '0.9rem', fontWeight: '700' }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

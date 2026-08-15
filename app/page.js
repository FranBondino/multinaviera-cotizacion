'use client';

import { useState, useEffect } from 'react';
import { GLOBAL_PORTS } from '../lib/portsData';
import PortSelect from '../components/PortSelect';

export default function MulticotizadorHome() {
  const [pol, setPol] = useState('CNSHA');
  const [pod, setPod] = useState('BUE');
  const [equipment, setEquipment] = useState("40'HC");
  const [marginUSD, setMarginUSD] = useState(250);
  const [marginPct, setMarginPct] = useState(0);
  const [usePct, setUsePct] = useState(false);
  const [sortBy, setSortBy] = useState('price');
  
  const [loading, setLoading] = useState(false);
  const [ratesData, setRatesData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedQuoteModal, setSelectedQuoteModal] = useState(null);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/quote?pol=${pol}&pod=${pod}&equipment=${encodeURIComponent(equipment)}`);
      const json = await res.json();
      if (json.success && json.rates) {
        setRatesData(json.rates);
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (err) {
      console.error('Error fetching live quotes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [pol, pod, equipment]);

  const polObj = GLOBAL_PORTS.find(p => p.code === pol) || { name: pol, country: '' };
  const podObj = GLOBAL_PORTS.find(p => p.code === pod) || { name: pod, country: '' };

  const processedRates = ratesData.map(rate => {
    const totalCost = rate.baseFreight + rate.thc + rate.baf;
    const margin = usePct ? Math.round((totalCost * marginPct) / 100) : Number(marginUSD);
    const clientPrice = totalCost + margin;
    return { ...rate, totalCost, margin, clientPrice };
  });

  if (sortBy === 'price') {
    processedRates.sort((a, b) => a.clientPrice - b.clientPrice);
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
    <div style={{ maxWidth: '1320px', margin: '0 auto', animation: 'slideUpFade 0.6s ease-out' }}>
      {/* Executive Top Navigation Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '1.75rem',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '2.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, var(--primary), var(--accent-cyan))',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '1.75rem',
            color: '#000',
            boxShadow: '0 8px 16px var(--primary-glow)',
            transform: 'rotate(-3deg)'
          }}>
            A
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Almar Rosario</h1>
              <span style={{
                background: 'rgba(6, 182, 212, 0.1)',
                color: 'var(--primary)',
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '0.25rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(6, 182, 212, 0.2)'
              }}>FREIGHT ENGINE v2.5</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>Maritime Freight Intelligence Hub</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="pulse" style={{
            background: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--success)',
            padding: '0.5rem 1.25rem',
            borderRadius: '30px',
            fontSize: '0.85rem',
            fontWeight: '600',
            border: '1px solid var(--success-glow)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></div>
            API Global Conectada
          </div>
          {lastUpdated && (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', background: 'rgba(0,0,0,0.3)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontFamily: 'monospace' }}>
              ACTUALIZADO: {lastUpdated}
            </span>
          )}
        </div>
      </header>

      {/* Interactive Flow Indicator Banner */}
      <div className="glass-panel animate-in" style={{ padding: '2rem 2.5rem', marginBottom: '2.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '300px', height: '300px', background: 'var(--primary-glow)', filter: 'blur(80px)', borderRadius: '50%', zIndex: 0, pointerEvents: 'none' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
            <div style={{ textAlign: 'right', minWidth: '160px' }}>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '700', marginBottom: '0.4rem' }}>POL / ORIGEN</span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.5px' }}>{polObj.name}</h2>
              <span style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>{polObj.country}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 1.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: '600', marginBottom: '0.75rem', letterSpacing: '1px' }}>RUTA DIRECTA</span>
              <div style={{ width: '180px', height: '2px', background: 'var(--border-active)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.5rem', background: 'var(--bg-card)', padding: '0 0.75rem', zIndex: 1 }}>🚢</span>
                <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '50%', background: 'var(--primary)', boxShadow: '0 0 8px var(--primary)' }}></div>
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '0.75rem', fontWeight: '600', background: 'var(--border-subtle)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>{equipment}</span>
            </div>

            <div style={{ minWidth: '160px' }}>
              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '700', marginBottom: '0.4rem' }}>POD / DESTINO</span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.5px' }}>{podObj.name}</h2>
              <span style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>{podObj.country}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={fetchQuotes}
              disabled={loading}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', padding: '0.8rem 1.5rem' }}
            >
              {loading ? 'Sincronizando...' : 'Ejecutar Motor de Tarifas ⚡'}
            </button>
          </div>
        </div>
      </div>

      {/* Control Filters Section */}
      <div className="glass-panel animate-in" style={{ padding: '2rem', marginBottom: '3rem', animationDelay: '0.1s' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: '700' }}>
          <span style={{ color: 'var(--primary)' }}>⬡</span> Parámetros de Cotización
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
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
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.6rem', fontWeight: '600' }}>
              Equipo Requerido
            </label>
            <select
              value={equipment}
              onChange={e => setEquipment(e.target.value)}
              className="select-input"
            >
              <option value="20'ST">20' Standard Dry</option>
              <option value="40'ST">40' Standard Dry</option>
              <option value="40'HC">40' High Cube Dry</option>
              <option value="40'NOR">40' Non-Operating Reefer</option>
              <option value="40'RH">40' Reefer High Cube</option>
            </select>
          </div>

          {/* Profit Margin Input */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.6rem', fontWeight: '600' }}>
              Markup Comercial ({usePct ? '%' : 'USD'})
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="number"
                value={usePct ? marginPct : marginUSD}
                onChange={e => usePct ? setMarginPct(Number(e.target.value)) : setMarginUSD(Number(e.target.value))}
                className="number-input"
              />
              <button
                type="button"
                onClick={() => setUsePct(!usePct)}
                className="btn-secondary"
                style={{ padding: '0.5rem 1rem' }}
              >
                {usePct ? '%' : 'USD'}
              </button>
            </div>
          </div>
        </div>

        {/* Sorting controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Comparativa Multi-Naviera: <strong style={{ color: 'var(--text-main)' }}>Maersk, CMA CGM, Hapag-Lloyd, MSC</strong>
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.25rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setSortBy('price')}
              className={`btn-secondary ${sortBy === 'price' ? 'active' : ''}`}
              style={{ border: 'none', background: sortBy === 'price' ? 'rgba(6,182,212,0.15)' : 'transparent' }}
            >
              💵 Mejor Precio
            </button>
            <button
              onClick={() => setSortBy('transit')}
              className={`btn-secondary ${sortBy === 'transit' ? 'active' : ''}`}
              style={{ border: 'none', background: sortBy === 'transit' ? 'rgba(6,182,212,0.15)' : 'transparent' }}
            >
              ⚡ Tránsito Óptimo
            </button>
            <button
              onClick={() => setSortBy('etd')}
              className={`btn-secondary ${sortBy === 'etd' ? 'active' : ''}`}
              style={{ border: 'none', background: sortBy === 'etd' ? 'rgba(6,182,212,0.15)' : 'transparent' }}
            >
              📅 Próxima Salida
            </button>
          </div>
        </div>
      </div>

      {/* Loading Overlay State */}
      {loading && (
        <div className="glass-panel animate-in" style={{ textAlign: 'center', padding: '5rem 2rem', marginBottom: '3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--primary)', fontSize: '2.5rem', marginBottom: '1.5rem', boxShadow: '0 0 30px var(--primary-glow)' }} className="pulse">
            ⚓
          </div>
          <h3 style={{ color: 'var(--text-main)', fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.75rem', letterSpacing: '-0.5px' }}>Procesando Rutas e Inventario</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
            Interconectando con sistemas EDI de Maersk, CMA CGM, Hapag-Lloyd y MSC para obtener las tarifas más competitivas...
          </p>
        </div>
      )}

      {/* Carrier Cards Comparison Grid */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {processedRates.map((rate, idx) => (
            <div
              key={idx}
              className={`glass-panel carrier-card animate-in ${idx === 0 ? 'best-deal' : ''}`}
              style={{
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                animationDelay: `${idx * 0.1}s`
              }}
            >
              {idx === 0 && (
                <div style={{
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  background: 'linear-gradient(135deg, var(--success), #059669)',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: '800',
                  padding: '0.4rem 1.25rem',
                  borderBottomLeftRadius: '12px',
                  letterSpacing: '1px',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                }}>
                  ★ RECOMENDADO: {sortBy === 'price' ? 'MEJOR TARIFA' : sortBy === 'transit' ? 'MÁS RÁPIDO' : 'PRÓXIMO BUQUE'}
                </div>
              )}

              <div>
                {/* Carrier Brand & Logo Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: 'rgba(0,0,0,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.8rem',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.05)'
                    }}>
                      {rate.logo}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>{rate.carrier}</h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {rate.serviceName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Itinerary Timeline */}
                <div style={{
                  background: 'rgba(0,0,0,0.3)',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  marginBottom: '1.5rem',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.85rem'
                }}>
                  <div className="detail-row">
                    <span style={{ color: 'var(--text-muted)' }}>Tránsito:</span>
                    <strong style={{ color: 'var(--text-main)', fontWeight: '800' }}>⚡ {rate.transitDays} DÍAS</strong>
                  </div>
                  <div className="detail-row">
                    <span style={{ color: 'var(--text-muted)' }}>ETD (Salida):</span>
                    <strong style={{ color: 'var(--text-main)', fontFamily: 'monospace', fontSize: '0.9rem' }}>{rate.etd}</strong>
                  </div>
                  <div className="detail-row">
                    <span style={{ color: 'var(--text-muted)' }}>ETA (Llegada):</span>
                    <strong style={{ color: 'var(--text-main)', fontFamily: 'monospace', fontSize: '0.9rem' }}>{rate.eta}</strong>
                  </div>
                  <div className="detail-row" style={{ marginTop: '0.25rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Vessel:</span>
                    <span style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.8rem' }}>{rate.vessel}</span>
                  </div>
                </div>

                {/* Cost Itemization */}
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  <div className="detail-row">
                    <span>Base Freight (O/F):</span>
                    <span style={{ color: 'var(--text-main)', fontFamily: 'monospace' }}>${rate.baseFreight}</span>
                  </div>
                  <div className="detail-row">
                    <span>THC Origin/Dest:</span>
                    <span style={{ color: 'var(--text-main)', fontFamily: 'monospace' }}>${rate.thc}</span>
                  </div>
                  <div className="detail-row">
                    <span>BAF Surcharge:</span>
                    <span style={{ color: 'var(--text-main)', fontFamily: 'monospace' }}>${rate.baf}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', marginTop: '0.5rem', borderTop: '1px dashed var(--border-subtle)', fontWeight: '700', color: 'var(--text-main)' }}>
                    <span>Net Cost (Buy):</span>
                    <span style={{ color: 'var(--text-main)', fontFamily: 'monospace', fontSize: '0.95rem' }}>${rate.totalCost}</span>
                  </div>
                </div>
              </div>

              {/* Pricing & Call-to-action */}
              <div style={{
                background: 'rgba(6, 182, 212, 0.05)',
                margin: '0 -2rem -2rem -2rem',
                padding: '1.5rem 2rem',
                borderTop: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sell Rate</span>
                  <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-1px', lineHeight: 1 }}>
                    <span style={{ fontSize: '1rem', color: 'var(--primary)', verticalAlign: 'top', marginRight: '4px' }}>USD</span>
                    {rate.clientPrice}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <span style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span style={{ fontSize: '1rem' }}>↑</span> Margin: ${rate.margin}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', background: 'rgba(0,0,0,0.3)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{rate.status}</span>
                </div>

                <button
                  onClick={() => setSelectedQuoteModal(rate)}
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  Exportar Proforma
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quote Preview Modal Dialog */}
      {selectedQuoteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          zIndex: 1000,
          animation: 'slideUpFade 0.3s ease-out'
        }}>
          <div className="glass-panel" style={{
            maxWidth: '600px',
            width: '100%',
            padding: '0',
            position: 'relative',
            background: 'var(--bg-card)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px var(--border-subtle)',
            overflow: 'hidden'
          }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.1), rgba(0,0,0,0))', padding: '2.5rem 2.5rem 2rem 2.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <button
                onClick={() => setSelectedQuoteModal(null)}
                style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-muted)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => { e.currentTarget.style.color = 'var(--text-main)'; e.currentTarget.style.borderColor = 'var(--text-main)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
              >
                ✕
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '42px', height: '42px', background: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#000', fontSize: '1.2rem' }}>
                  A
                </div>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Proforma Comercial</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600', letterSpacing: '1px' }}>ALMAR LOGISTICS INTELLIGENCE</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>Origen</span>
                  <strong style={{ color: 'var(--text-main)', fontSize: '1.1rem' }}>{polObj.name}</strong>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>Destino</span>
                  <strong style={{ color: 'var(--text-main)', fontSize: '1.1rem' }}>{podObj.name}</strong>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>Carrier / Servicio</span>
                  <strong style={{ color: 'var(--text-main)' }}>{selectedQuoteModal.carrier} - {selectedQuoteModal.serviceName}</strong>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>Equipo</span>
                  <strong style={{ color: 'var(--text-main)' }}>{equipment}</strong>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>Fechas</span>
                  <strong style={{ color: 'var(--text-main)' }}>{selectedQuoteModal.etd} → {selectedQuoteModal.eta}</strong>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.2rem' }}>Tránsito</span>
                  <strong style={{ color: 'var(--text-main)' }}>{selectedQuoteModal.transitDays} Días</strong>
                </div>
              </div>
            </div>

            <div style={{ padding: '2.5rem', background: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: '600' }}>Inversión Total</span>
                <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '-1px', lineHeight: 1 }}>
                  <span style={{ fontSize: '1.2rem', verticalAlign: 'top', marginRight: '6px' }}>USD</span>
                  {selectedQuoteModal.clientPrice}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2.5rem', textAlign: 'right' }}>
                * Flete marítimo integral sujeto a disponibilidad y recargos locales.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button
                  onClick={() => copyToClipboard(`🚢 *ALMAR ROSARIO - PROFORMA DE FLETE*\n\n📍 *POL:* ${polObj.name}\n🏁 *POD:* ${podObj.name}\n📦 *Equipo:* ${equipment}\n\n🚢 *Carrier:* ${selectedQuoteModal.carrier} (${selectedQuoteModal.serviceName})\n⚡ *Tránsito:* ${selectedQuoteModal.transitDays} días\n📅 *ETD:* ${selectedQuoteModal.etd} | *ETA:* ${selectedQuoteModal.eta}\n\n💵 *INVERSIÓN TOTAL:* USD ${selectedQuoteModal.clientPrice} / Contenedor\n\n_Tarifa incluye Flete Marítimo, THC y BAF. Sujeta a confirmación de booking._`)}
                  className="btn-primary"
                  style={{ padding: '1rem', fontSize: '0.95rem', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  Copiar Proforma
                </button>

                <button
                  onClick={() => copyToClipboard(`https://wa.me/?text=${encodeURIComponent(`🚢 *ALMAR ROSARIO - PROFORMA DE FLETE*\n\n📍 *POL:* ${polObj.name}\n🏁 *POD:* ${podObj.name}\n📦 *Equipo:* ${equipment}\n\n🚢 *Carrier:* ${selectedQuoteModal.carrier}\n💵 *TARIFA:* USD ${selectedQuoteModal.clientPrice}\n\n_Sujeta a disponibilidad._`)}`)}
                  className="btn-secondary"
                  style={{ padding: '1rem', fontSize: '0.95rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', background: '#25D366', color: '#000', borderColor: '#25D366', fontWeight: '700' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                  Enviar WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

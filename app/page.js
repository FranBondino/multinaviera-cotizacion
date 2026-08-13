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
    <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
      {/* Executive Top Navigation Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        paddingBottom: '1.75rem',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #2563eb, #0891b2)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            fontWeight: '800',
            fontSize: '1.5rem',
            color: 'white',
            boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)'
          }}>
            A
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'white', letterSpacing: '-0.5px' }}>Almar Rosario</h1>
              <span style={{
                background: 'rgba(59, 130, 246, 0.15)',
                color: 'var(--primary)',
                fontSize: '0.75rem',
                fontWeight: '600',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}>FREIGHT ENGINE v2.5</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Plataforma Inteligente de Cotización & Tarifario Multinaviera UN/LOCODE Global</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div className="pulse" style={{
            background: 'rgba(16, 185, 129, 0.12)',
            color: 'var(--success)',
            padding: '0.5rem 1rem',
            borderRadius: '30px',
            fontSize: '0.8rem',
            fontWeight: '600',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>●</span> Base Global UN/LOCODE Activa
          </div>
          {lastUpdated && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
              ⏱️ Refrescado: {lastUpdated}
            </span>
          )}
        </div>
      </header>

      {/* Interactive Flow Indicator Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.5))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>PUERTO ORIGEN (POL)</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white' }}>{polObj.name} <span style={{ fontSize: '1rem', fontWeight: '400' }}>({polObj.country})</span></h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 1rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: '600', marginBottom: '0.2rem' }}>RUTA MARÍTIMA DIRECTA</span>
              <div style={{ width: '120px', height: '2px', background: 'linear-gradient(90deg, var(--primary), var(--accent-cyan))', position: 'relative' }}>
                <span style={{ position: 'absolute', top: '-10px', left: '45%', fontSize: '1.1rem' }}>🚢</span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{equipment}</span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>PUERTO DESTINO (POD)</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white' }}>{podObj.name} <span style={{ fontSize: '1rem', fontWeight: '400' }}>({podObj.country})</span></h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={fetchQuotes}
              disabled={loading}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {loading ? '🔄 Buscando Fletes en Vivo...' : '🔍 Buscar Cotizaciones en Vivo'}
            </button>
          </div>
        </div>
      </div>

      {/* Control Filters Section */}
      <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.05rem', color: 'var(--primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>⚙️</span> Buscador de Puertos Mundiales (UN/LOCODE) & Margen
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
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>
              Tipo de Contenedor / Equipo:
            </label>
            <select
              value={equipment}
              onChange={e => setEquipment(e.target.value)}
              className="select-input"
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
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>
              Margen de Ganancia Almar ({usePct ? '%' : 'USD'}):
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Comparando <strong style={{ color: 'white' }}>4 Navieras Líderes</strong> para {polObj.name} ➔ {podObj.name}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: '0.5rem' }}>Ordenar por:</span>
            <button
              onClick={() => setSortBy('price')}
              className={`btn-secondary ${sortBy === 'price' ? 'active' : ''}`}
            >
              💵 Menor Precio Total
            </button>
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

      {/* Loading Overlay State */}
      {loading && (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', marginBottom: '2rem' }}>
          <div className="pulse" style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚢 ⚡</div>
          <h3 style={{ color: 'var(--accent-cyan)', fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.5rem' }}>Consultando Tarifas e Itinerarios en Vivo...</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Conectando con servidores y scrapers de Maersk, CMA CGM, Hapag-Lloyd y MSC...
          </p>
        </div>
      )}

      {/* Carrier Cards Comparison Grid */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(295px, 1fr))', gap: '1.75rem', marginBottom: '3rem' }}>
          {processedRates.map((rate, idx) => (
            <div
              key={idx}
              className={`glass-panel carrier-card ${idx === 0 ? 'best-deal' : ''}`}
              style={{
                padding: '1.6rem',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between'
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
                  fontWeight: '700',
                  padding: '0.35rem 1rem',
                  borderBottomLeftRadius: '12px',
                  letterSpacing: '0.5px',
                  boxShadow: '0 4px 10px rgba(16, 185, 129, 0.4)'
                }}>
                  ⭐ MEJOR OPCIÓN ({sortBy === 'price' ? 'PRECIO' : sortBy === 'transit' ? 'TRÁNSITO' : 'SALIDA'})
                </span>
              )}

              <div>
                {/* Carrier Brand & Logo Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'center',
                      fontSize: '1.8rem',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      {rate.logo}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: '700', color: 'white', letterSpacing: '-0.3px' }}>{rate.carrier}</h3>
                      <span style={{ fontSize: '0.75rem', color: rate.accentColor, fontWeight: '600', background: 'rgba(255,255,255,0.04)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                        {rate.serviceName}
                      </span>
                    </div>
                  </div>
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
                    <strong style={{ color: 'var(--accent-cyan)', fontWeight: '700' }}>⚡ {rate.transitDays} días directos</strong>
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
                    <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{rate.vessel}</span>
                  </div>
                </div>

                {/* Cost Itemization */}
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span>Flete Base Ocean Freight:</span>
                    <span style={{ color: 'white' }}>USD {rate.baseFreight}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span>THC (Terminal Handling):</span>
                    <span style={{ color: 'white' }}>USD {rate.thc}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span>BAF Fuel Surcharge:</span>
                    <span style={{ color: 'white' }}>USD {rate.baf}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px dashed var(--border-subtle)', fontWeight: '600', color: 'var(--text-main)' }}>
                    <span>Costo Neto Almar:</span>
                    <span style={{ color: 'var(--accent-cyan)' }}>USD {rate.totalCost}</span>
                  </div>
                </div>
              </div>

              {/* Pricing & Call-to-action */}
              <div style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '1.25rem',
                marginTop: '0.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>Precio Cliente:</span>
                  <span style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--success)', letterSpacing: '-0.5px' }}>
                    USD {rate.clientPrice}
                  </span>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ background: 'rgba(6, 182, 212, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    Ganancia Neto Almar: +USD {rate.margin}
                  </span>
                  <span style={{ color: 'var(--text-dim)' }}>{rate.status}</span>
                </div>

                <button
                  onClick={() => setSelectedQuoteModal(rate)}
                  className="btn-primary"
                  style={{ width: '100%', padding: '0.8rem', fontSize: '0.9rem' }}
                >
                  📄 Generar Cotización Cliente
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
          background: 'rgba(3, 7, 18, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
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
                justify: 'center',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '36px', height: '36px', background: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: 'white' }}>
                A
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'white' }}>Propuesta Comercial de Flete</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Almar Rosario Logistics Intelligence</p>
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '1.5rem', borderRadius: '12px', fontSize: '0.9rem', lineHeight: '1.7', marginBottom: '1.75rem', color: 'var(--text-main)', border: '1px solid var(--border-subtle)' }}>
              <p style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                🚢 ALMAR ROSARIO - OFERTA DE FLETE MARÍTIMO
              </p>
              <p>📍 <strong>Origen (POL):</strong> {polObj.name} ({polObj.country})</p>
              <p>🏁 <strong>Destino (POD):</strong> {podObj.name} ({podObj.country})</p>
              <p>📦 <strong>Equipo:</strong> {equipment}</p>
              <p>🚢 <strong>Naviera:</strong> {selectedQuoteModal.carrier} ({selectedQuoteModal.serviceName})</p>
              <p>⚡ <strong>Tiempo de Tránsito:</strong> {selectedQuoteModal.transitDays} días directos</p>
              <p>📅 <strong>ETD (Salida Estimada):</strong> {selectedQuoteModal.etd}</p>
              <p>🏁 <strong>ETA (Llegada Estimada):</strong> {selectedQuoteModal.eta}</p>
              <hr style={{ border: 'none', borderTop: '1px dashed var(--border-subtle)', margin: '1rem 0' }} />
              <p style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--success)' }}>
                💵 TARIFA CLIENTE: USD {selectedQuoteModal.clientPrice} / Contenedor
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                * Incluye Flete Marítimo + THC + BAF. Oferta válida por 15 días sujeta a disponibilidad de espacio.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => copyToClipboard(`🚢 *ALMAR ROSARIO - COTIZACIÓN DE FLETE MARÍTIMO*\n\n📍 *Origen:* ${polObj.name} (${polObj.country})\n🏁 *Destino:* ${podObj.name} (${podObj.country})\n📦 *Equipo:* ${equipment}\n🚢 *Naviera:* ${selectedQuoteModal.carrier} (${selectedQuoteModal.serviceName})\n⚡ *Tiempo Tránsito:* ${selectedQuoteModal.transitDays} días\n📅 *ETD Salida:* ${selectedQuoteModal.etd}\n🏁 *ETA Llegada:* ${selectedQuoteModal.eta}\n\n💵 *TARIFA FINAL CLIENTE:* USD ${selectedQuoteModal.clientPrice} / Contenedor\n\n_Incluye Flete Marítimo + THC + BAF. Oferta sujeta a disponibilidad._`)}
                className="btn-primary"
                style={{ flex: 1, padding: '0.85rem', fontSize: '0.9rem' }}
              >
                📲 Copiar para WhatsApp / Email
              </button>

              <button
                onClick={() => setSelectedQuoteModal(null)}
                className="btn-secondary"
                style={{ padding: '0.85rem 1.5rem', fontSize: '0.9rem' }}
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

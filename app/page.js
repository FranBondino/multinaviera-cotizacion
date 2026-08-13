'use client';

import { useState, useEffect } from 'react';

const PORTS = [
  { code: 'CNSHA', name: 'Shanghai (China)' },
  { code: 'CNNBO', name: 'Ningbo (China)' },
  { code: 'CNSHK', name: 'Shekou / Shenzhen (China)' },
  { code: 'BUE', name: 'Buenos Aires (Argentina)' },
  { code: 'ROS', name: 'Rosario (Argentina)' },
  { code: 'SSZ', name: 'Santos (Brasil)' },
  { code: 'NLRTM', name: 'Rotterdam (Países Bajos)' },
  { code: 'DEHAM', name: 'Hamburgo (Alemania)' },
  { code: 'USMIA', name: 'Miami (EEUU)' }
];

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

  // Fetch live quotes from API Route (Scraper Engine)
  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/quote?pol=${pol}&pod=${pod}&equipment=${encodeURIComponent(equipment)}`);
      const json = await res.json();
      if (json.success && json.rates) {
        setRatesData(json.rates);
        setLastUpdated(new Date().toLocaleTimeString());
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

  const polObj = PORTS.find(p => p.code === pol) || { name: pol };
  const podObj = PORTS.find(p => p.code === pod) || { name: pod };

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

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Top Brand Bar */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid var(--border)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            fontWeight: '700',
            fontSize: '1.3rem',
            color: 'white'
          }}>
            A
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white' }}>Almar Rosario</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Multicotizador & Extractor Web Naviero</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{
            background: 'rgba(6, 182, 212, 0.15)',
            color: 'var(--accent)',
            padding: '0.4rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600',
            border: '1px solid rgba(6, 182, 212, 0.3)'
          }}>
            🤖 Web Scraper Engine Activo
          </span>
          {lastUpdated && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Actualizado: {lastUpdated}
            </span>
          )}
        </div>
      </header>

      {/* Control Panel / Filters */}
      <div style={{
        background: 'var(--bg-card)',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>
            🔍 Búsqueda & Extracción de Fletes Marítimos
          </h2>
          <button
            onClick={fetchQuotes}
            disabled={loading}
            className="pagination-btn"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            {loading ? '🔄 Extrayendo en vivo...' : '🔄 Actualizar Cotizaciones'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Puerto de Origen (POL):
            </label>
            <select
              value={pol}
              onChange={e => setPol(e.target.value)}
              className="chat-input"
              style={{ width: '100%', padding: '0.6rem' }}
            >
              {PORTS.map(p => (
                <option key={p.code} value={p.code}>{p.name} ({p.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Puerto de Destino (POD):
            </label>
            <select
              value={pod}
              onChange={e => setPod(e.target.value)}
              className="chat-input"
              style={{ width: '100%', padding: '0.6rem' }}
            >
              {PORTS.map(p => (
                <option key={p.code} value={p.code}>{p.name} ({p.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Tipo de Equipamiento:
            </label>
            <select
              value={equipment}
              onChange={e => setEquipment(e.target.value)}
              className="chat-input"
              style={{ width: '100%', padding: '0.6rem' }}
            >
              <option value="20'ST">20' Standard Dry</option>
              <option value="40'ST">40' Standard Dry</option>
              <option value="40'HC">40' High Cube Dry</option>
              <option value="40'NOR">40' Non-Operating Reefer</option>
              <option value="40'RH">40' Reefer High Cube</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Margen Comercial ({usePct ? '%' : 'USD'}):
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="number"
                value={usePct ? marginPct : marginUSD}
                onChange={e => usePct ? setMarginPct(Number(e.target.value)) : setMarginUSD(Number(e.target.value))}
                className="chat-input"
                style={{ width: '100%', padding: '0.6rem' }}
              />
              <button
                type="button"
                onClick={() => setUsePct(!usePct)}
                className="pagination-btn"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
              >
                {usePct ? '%' : 'USD'}
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Ruta: <strong>{polObj.name} ➔ {podObj.name}</strong> ({equipment})
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Ordenar por:</span>
            <button
              onClick={() => setSortBy('price')}
              className={`pagination-btn ${sortBy === 'price' ? 'active' : ''}`}
              style={{ padding: '0.3rem 0.7rem' }}
            >
              💵 Menor Precio
            </button>
            <button
              onClick={() => setSortBy('transit')}
              className={`pagination-btn ${sortBy === 'transit' ? 'active' : ''}`}
              style={{ padding: '0.3rem 0.7rem' }}
            >
              ⚡ Tránsito Más Rápido
            </button>
            <button
              onClick={() => setSortBy('etd')}
              className={`pagination-btn ${sortBy === 'etd' ? 'active' : ''}`}
              style={{ padding: '0.3rem 0.7rem' }}
            >
              📅 Próxima Salida
            </button>
          </div>
        </div>
      </div>

      {/* Loading Overlay State */}
      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          background: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          marginBottom: '2rem'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🚢 🤖</div>
          <h3 style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>Extrayendo cotizaciones e itinerarios en vivo de las navieras...</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
            Consultando webs oficiales de Maersk, CMA CGM, Hapag-Lloyd y MSC...
          </p>
        </div>
      )}

      {/* Comparison Grid */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {processedRates.map((rate, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-card)',
                borderRadius: '12px',
                border: `1px solid ${idx === 0 ? 'var(--success)' : 'var(--border)'}`,
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                boxShadow: idx === 0 ? '0 0 20px rgba(16, 185, 129, 0.15)' : 'none'
              }}
            >
              {idx === 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-12px',
                  right: '15px',
                  background: 'var(--success)',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '12px'
                }}>
                  ⭐ MEJOR OPCIÓN ({sortBy === 'price' ? 'PRECIO' : sortBy === 'transit' ? 'TIEMPO' : 'SALIDA'})
                </span>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.6rem' }}>{rate.logo}</span>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white' }}>{rate.carrier}</h3>
                      <span style={{ fontSize: '0.75rem', color: rate.accentColor, fontWeight: '600' }}>{rate.serviceName}</span>
                    </div>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Tiempo de Tránsito:</span>
                    <strong style={{ color: 'var(--text-main)' }}>⚡ {rate.transitDays} días</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Fecha Salida (ETD):</span>
                    <strong>📅 {rate.etd}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Fecha Llegada (ETA):</span>
                    <strong>🏁 {rate.eta}</strong>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span>Flete Base ({equipment}):</span>
                    <span>USD {rate.baseFreight}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span>THC Origin / Dest:</span>
                    <span>USD {rate.thc}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span>BAF Fuel Surcharge:</span>
                    <span>USD {rate.baf}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.4rem', borderTop: '1px dashed var(--border)', fontWeight: '600', color: 'var(--text-main)' }}>
                    <span>Costo Neto Almar:</span>
                    <span>USD {rate.totalCost}</span>
                  </div>
                </div>
              </div>

              <div style={{
                borderTop: '1px solid var(--border)',
                paddingTop: '1rem',
                marginTop: '0.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.8rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Precio Final Cliente:</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--success)' }}>
                    USD {rate.clientPrice}
                  </span>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Margen Neto: +USD {rate.margin}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{rate.apiSource}</span>
                </div>

                <button
                  onClick={() => alert(`Cotización generada para ${rate.carrier}:\n• Ruta: ${polObj.name} ➔ ${podObj.name}\n• Servicio: ${rate.serviceName}\n• Flete Costo: USD ${rate.totalCost}\n• Margen: USD ${rate.margin}\n• Precio Cliente: USD ${rate.clientPrice}`)}
                  className="chat-send-btn"
                  style={{ width: '100%', textAlign: 'center', padding: '0.66rem' }}
                >
                  📄 Generar Cotización Cliente
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Integration Guide Section for Juan */}
      <div style={{
        background: 'var(--bg-card)',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid var(--border)'
      }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--primary)' }}>
          🤖 Estado del Motor de Extracción (Web Scraper Engine)
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1rem' }}>
          Este módulo ejecuta scrapers automatizados en vivo sobre las webs públicas de Maersk, CMA CGM, Hapag-Lloyd y MSC para extraer datos de itinerarios, tiempos de tránsito y tarifas spot sin requerir aprobaciones previas.
        </p>
      </div>
    </div>
  );
}

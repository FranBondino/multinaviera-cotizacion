'use client';

import { useState, useEffect } from 'react';

const PORTS = [
  // Asia / China
  { code: 'CNSHA', name: 'Shanghai', country: 'China 🇨🇳', region: 'Asia' },
  { code: 'CNNBO', name: 'Ningbo', country: 'China 🇨🇳', region: 'Asia' },
  { code: 'CNSHK', name: 'Shekou / Shenzhen', country: 'China 🇨🇳', region: 'Asia' },
  { code: 'CNTAO', name: 'Qingdao', country: 'China 🇨🇳', region: 'Asia' },
  { code: 'CNXMN', name: 'Xiamen', country: 'China 🇨🇳', region: 'Asia' },
  { code: 'HKHKG', name: 'Hong Kong', country: 'Hong Kong 🇭🇰', region: 'Asia' },
  { code: 'KRPUS', name: 'Busan', country: 'Corea del Sur 🇰🇷', region: 'Asia' },
  { code: 'SGSIN', name: 'Singapore', country: 'Singapur 🇸🇬', region: 'Asia' },
  { code: 'MYPKG', name: 'Port Klang', country: 'Malasia 🇲🇾', region: 'Asia' },
  
  // Sudamérica (ECSA / WCSA)
  { code: 'BUE', name: 'Buenos Aires', country: 'Argentina 🇦🇷', region: 'Sudamérica' },
  { code: 'ROS', name: 'Rosario', country: 'Argentina 🇦🇷', region: 'Sudamérica' },
  { code: 'ZAR', name: 'Zárate', country: 'Argentina 🇦🇷', region: 'Sudamérica' },
  { code: 'SSZ', name: 'Santos', country: 'Brasil 🇧🇷', region: 'Sudamérica' },
  { code: 'PNG', name: 'Paranaguá', country: 'Brasil 🇧🇷', region: 'Sudamérica' },
  { code: 'RIG', name: 'Rio Grande', country: 'Brasil 🇧🇷', region: 'Sudamérica' },
  { code: 'MVD', name: 'Montevideo', country: 'Uruguay 🇺🇾', region: 'Sudamérica' },
  { code: 'VAP', name: 'Valparaíso', country: 'Chile 🇨🇱', region: 'Sudamérica' },
  { code: 'CALL', name: 'Callao', country: 'Perú 🇵🇪', region: 'Sudamérica' },
  
  // Europa
  { code: 'NLRTM', name: 'Rotterdam', country: 'Países Bajos 🇳🇱', region: 'Europa' },
  { code: 'DEHAM', name: 'Hamburgo', country: 'Alemania 🇩🇪', region: 'Europa' },
  { code: 'BEANR', name: 'Amberes (Antwerp)', country: 'Bélgica 🇧🇪', region: 'Europa' },
  { code: 'ESVLC', name: 'Valencia', country: 'España 🇪🇸', region: 'Europa' },
  { code: 'ESBCN', name: 'Barcelona', country: 'España 🇪🇸', region: 'Europa' },
  { code: 'ITGOA', name: 'Génova', country: 'Italia 🇮🇹', region: 'Europa' },
  
  // Norteamérica / Centroamérica
  { code: 'USMIA', name: 'Miami', country: 'EEUU 🇺🇸', region: 'Norteamérica' },
  { code: 'USNYC', name: 'New York / New Jersey', country: 'EEUU 🇺🇸', region: 'Norteamérica' },
  { code: 'USLAX', name: 'Los Angeles', country: 'EEUU 🇺🇸', region: 'Norteamérica' },
  { code: 'USHOU', name: 'Houston', country: 'EEUU 🇺🇸', region: 'Norteamérica' },
  { code: 'MXZLO', name: 'Manzanillo', country: 'México 🇲🇽', region: 'Norteamérica' },
  { code: 'PABLB', name: 'Balboa / Cristóbal', country: 'Panamá 🇵🇦', region: 'Centroamérica' }
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

  // Modal quote state
  const [selectedQuoteModal, setSelectedQuoteModal] = useState(null);

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

  const polObj = PORTS.find(p => p.code === pol) || { name: pol, country: '' };
  const podObj = PORTS.find(p => p.code === pod) || { name: pod, country: '' };

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
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Top Header */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid var(--border)',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            background: 'linear-gradient(135deg, var(--primary), var(--accent))',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            fontWeight: '700',
            fontSize: '1.4rem',
            color: 'white',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}>
            A
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: '700', color: 'white' }}>Almar Rosario</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Multicotizador & Comparador de Fletes Marítimos (APIs DCSA & Web Scraping)</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{
            background: 'rgba(16, 185, 129, 0.15)',
            color: 'var(--success)',
            padding: '0.4rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            ● 4 Navieras Conectadas (Maersk, CMA, Hapag, MSC)
          </span>
        </div>
      </header>

      {/* Guide Banner: ¿Cómo funciona este cotizador? */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.05))',
        border: '1px solid rgba(59, 130, 246, 0.25)',
        borderRadius: '12px',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--accent)', marginBottom: '0.5rem' }}>
          💡 ¿Cómo funciona este Multicotizador?
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <div>
            <strong style={{ color: 'white' }}>1. Elegí Origen y Destino:</strong> Seleccioná el puerto de origen (POL) y puerto de destino (POD) del flete marítimo.
          </div>
          <div>
            <strong style={{ color: 'white' }}>2. Elegí Contenedor:</strong> Seleccioná el tipo de equipo (20'ST, 40'ST, 40'HC, Reefer).
          </div>
          <div>
            <strong style={{ color: 'white' }}>3. Ajustá tu Margen:</strong> Ingresá la ganancia de Almar Rosario en USD o en porcentaje (%).
          </div>
          <div>
            <strong style={{ color: 'white' }}>4. Cotizá en 1 Clic:</strong> Hacé clic en "Generar Cotización" para emitir la propuesta lista para el cliente.
          </div>
        </div>
      </div>

      {/* Main Search Panel */}
      <div style={{
        background: 'var(--bg-card)',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <h2 style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: '600' }}>
            🔍 Buscador de Fletes Marítimos
          </h2>
          <button
            onClick={fetchQuotes}
            disabled={loading}
            className="pagination-btn"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '600' }}
          >
            {loading ? '🔄 Extrayendo en vivo...' : '🔄 Actualizar Cotizaciones'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
          {/* POL Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: '500' }}>
              Puerto de Origen (POL):
            </label>
            <select
              value={pol}
              onChange={e => setPol(e.target.value)}
              className="chat-input"
              style={{ width: '100%', padding: '0.7rem', fontSize: '0.9rem' }}
            >
              <optgroup label="🌏 Asia / China">
                {PORTS.filter(p => p.region === 'Asia').map(p => (
                  <option key={p.code} value={p.code}>{p.name} - {p.country} ({p.code})</option>
                ))}
              </optgroup>
              <optgroup label="🌍 Europa">
                {PORTS.filter(p => p.region === 'Europa').map(p => (
                  <option key={p.code} value={p.code}>{p.name} - {p.country} ({p.code})</option>
                ))}
              </optgroup>
              <optgroup label="🌎 Sudamérica (ECSA/WCSA)">
                {PORTS.filter(p => p.region === 'Sudamérica').map(p => (
                  <option key={p.code} value={p.code}>{p.name} - {p.country} ({p.code})</option>
                ))}
              </optgroup>
              <optgroup label="🌎 Norteamérica & Centroamérica">
                {PORTS.filter(p => p.region === 'Norteamérica' || p.region === 'Centroamérica').map(p => (
                  <option key={p.code} value={p.code}>{p.name} - {p.country} ({p.code})</option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* POD Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: '500' }}>
              Puerto de Destino (POD):
            </label>
            <select
              value={pod}
              onChange={e => setPod(e.target.value)}
              className="chat-input"
              style={{ width: '100%', padding: '0.7rem', fontSize: '0.9rem' }}
            >
              <optgroup label="🌎 Sudamérica (ECSA/WCSA)">
                {PORTS.filter(p => p.region === 'Sudamérica').map(p => (
                  <option key={p.code} value={p.code}>{p.name} - {p.country} ({p.code})</option>
                ))}
              </optgroup>
              <optgroup label="🌏 Asia / China">
                {PORTS.filter(p => p.region === 'Asia').map(p => (
                  <option key={p.code} value={p.code}>{p.name} - {p.country} ({p.code})</option>
                ))}
              </optgroup>
              <optgroup label="🌍 Europa">
                {PORTS.filter(p => p.region === 'Europa').map(p => (
                  <option key={p.code} value={p.code}>{p.name} - {p.country} ({p.code})</option>
                ))}
              </optgroup>
              <optgroup label="🌎 Norteamérica & Centroamérica">
                {PORTS.filter(p => p.region === 'Norteamérica' || p.region === 'Centroamérica').map(p => (
                  <option key={p.code} value={p.code}>{p.name} - {p.country} ({p.code})</option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Equipment Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: '500' }}>
              Tipo de Contenedor:
            </label>
            <select
              value={equipment}
              onChange={e => setEquipment(e.target.value)}
              className="chat-input"
              style={{ width: '100%', padding: '0.7rem', fontSize: '0.9rem' }}
            >
              <option value="20'ST">📦 20' Standard Dry Container</option>
              <option value="40'ST">📦 40' Standard Dry Container</option>
              <option value="40'HC">📦 40' High Cube Dry Container</option>
              <option value="40'NOR">❄️ 40' Non-Operating Reefer (NOR)</option>
              <option value="40'RH">❄️ 40' Reefer High Cube</option>
            </select>
          </div>

          {/* Margin Input */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: '500' }}>
              Margen Comercial Almar ({usePct ? '%' : 'USD'}):
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="number"
                value={usePct ? marginPct : marginUSD}
                onChange={e => usePct ? setMarginPct(Number(e.target.value)) : setMarginUSD(Number(e.target.value))}
                className="chat-input"
                style={{ width: '100%', padding: '0.7rem', fontSize: '0.9rem' }}
              />
              <button
                type="button"
                onClick={() => setUsePct(!usePct)}
                className="pagination-btn"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', fontWeight: '600' }}
              >
                {usePct ? '%' : 'USD'}
              </button>
            </div>
          </div>
        </div>

        {/* Route Summary & Sorting */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
            Ruta Seleccionada: <strong style={{ color: 'var(--accent)' }}>{polObj.name} ({polObj.country}) ➔ {podObj.name} ({podObj.country})</strong> | Equipo: <strong>{equipment}</strong>
          </span>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Ordenar por:</span>
            <button
              onClick={() => setSortBy('price')}
              className={`pagination-btn ${sortBy === 'price' ? 'active' : ''}`}
              style={{ padding: '0.35rem 0.75rem', fontWeight: '600' }}
            >
              💵 Menor Precio
            </button>
            <button
              onClick={() => setSortBy('transit')}
              className={`pagination-btn ${sortBy === 'transit' ? 'active' : ''}`}
              style={{ padding: '0.35rem 0.75rem', fontWeight: '600' }}
            >
              ⚡ Tránsito Rápido
            </button>
            <button
              onClick={() => setSortBy('etd')}
              className={`pagination-btn ${sortBy === 'etd' ? 'active' : ''}`}
              style={{ padding: '0.35rem 0.75rem', fontWeight: '600' }}
            >
              📅 Próxima Salida
            </button>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div style={{
          textAlign: 'center',
          padding: '3.5rem',
          background: 'var(--bg-card)',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          marginBottom: '2rem'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🚢 🤖</div>
          <h3 style={{ color: 'var(--accent)', fontSize: '1.3rem', fontWeight: '600' }}>Consultando tarifas e itinerarios en vivo de las navieras...</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Consultando webs oficiales de Maersk, CMA CGM, Hapag-Lloyd y MSC...
          </p>
        </div>
      )}

      {/* Comparison Grid */}
      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(285px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {processedRates.map((rate, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-card)',
                borderRadius: '14px',
                border: `1px solid ${idx === 0 ? 'var(--success)' : 'var(--border)'}`,
                padding: '1.35rem',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                position: 'relative',
                boxShadow: idx === 0 ? '0 0 25px rgba(16, 185, 129, 0.18)' : 'none'
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
                  padding: '0.25rem 0.7rem',
                  borderRadius: '12px',
                  letterSpacing: '0.5px'
                }}>
                  ⭐ MEJOR OPCIÓN ({sortBy === 'price' ? 'PRECIO' : sortBy === 'transit' ? 'TRÁNSITO' : 'SALIDA'})
                </span>
              )}

              <div>
                {/* Naviera Brand Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '1.8rem' }}>{rate.logo}</span>
                    <div>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'white' }}>{rate.carrier}</h3>
                      <span style={{ fontSize: '0.75rem', color: rate.accentColor, fontWeight: '600' }}>Servicio: {rate.serviceName}</span>
                    </div>
                  </div>
                </div>

                {/* Itinerary Box */}
                <div style={{
                  background: 'rgba(255,255,255,0.03)',
                  padding: '0.85rem',
                  borderRadius: '10px',
                  marginBottom: '1.1rem',
                  fontSize: '0.85rem',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Tiempo de Tránsito:</span>
                    <strong style={{ color: 'var(--text-main)' }}>⚡ {rate.transitDays} días directos</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Fecha Salida (ETD):</span>
                    <strong>📅 {rate.etd}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Fecha Llegada (ETA):</span>
                    <strong>🏁 {rate.eta}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.3rem', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.8rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Buque / Viaje:</span>
                    <span style={{ color: 'var(--accent)', fontWeight: '500' }}>{rate.vessel}</span>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span>Flete Base Ocean Freight ({equipment}):</span>
                    <span>USD {rate.baseFreight}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span>THC Terminal Handling Charge:</span>
                    <span>USD {rate.thc}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span>BAF Fuel Surcharge:</span>
                    <span>USD {rate.baf}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px dashed var(--border)', fontWeight: '600', color: 'var(--text-main)' }}>
                    <span>Costo Neto Almar:</span>
                    <span>USD {rate.totalCost}</span>
                  </div>
                </div>
              </div>

              {/* Price for Client & Action Button */}
              <div style={{
                borderTop: '1px solid var(--border)',
                paddingTop: '1rem',
                marginTop: '0.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Precio Final Cliente:</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--success)' }}>
                    USD {rate.clientPrice}
                  </span>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginBottom: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Margen Almar: +USD {rate.margin}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{rate.apiSource}</span>
                </div>

                <button
                  onClick={() => setSelectedQuoteModal(rate)}
                  className="chat-send-btn"
                  style={{ width: '100%', textAlign: 'center', padding: '0.75rem', fontSize: '0.9rem' }}
                >
                  📄 Generar Cotización Cliente
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quote Preview Modal */}
      {selectedQuoteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          padding: '1rem',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            maxWidth: '550px',
            width: '100%',
            padding: '2rem',
            position: 'relative'
          }}>
            <button
              onClick={() => setSelectedQuoteModal(null)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white', marginBottom: '0.4rem' }}>
              📄 Cotización de Flete Marítimo
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Almar Rosario - Propuesta Comercial para Cliente
            </p>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '10px', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem', color: 'var(--text-main)', border: '1px solid var(--border)' }}>
              <p style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                🚢 ALMAR ROSARIO - OFERTA DE FLETE MARÍTIMO
              </p>
              <p>📍 <strong>Origen:</strong> {polObj.name} ({polObj.country})</p>
              <p>🏁 <strong>Destino:</strong> {podObj.name} ({podObj.country})</p>
              <p>📦 <strong>Equipo:</strong> {equipment}</p>
              <p>🚢 <strong>Naviera:</strong> {selectedQuoteModal.carrier} ({selectedQuoteModal.serviceName})</p>
              <p>⚡ <strong>Tiempo Tránsito:</strong> {selectedQuoteModal.transitDays} días directos</p>
              <p>📅 <strong>ETD (Salida estimada):</strong> {selectedQuoteModal.etd}</p>
              <p>🏁 <strong>ETA (Llegada estimada):</strong> {selectedQuoteModal.eta}</p>
              <hr style={{ border: 'none', borderTop: '1px dashed var(--border)', margin: '0.75rem 0' }} />
              <p style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--success)' }}>
                💵 Tarifa Final Cliente: USD {selectedQuoteModal.clientPrice} / Contenedor
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                * Incluye Flete Marítimo + THC + BAF. Oferta sujeta a disponibilidad de espacio y validez de tarifa.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => copyToClipboard(`🚢 *ALMAR ROSARIO - COTIZACIÓN DE FLETE MARÍTIMO*\n\n📍 *Origen:* ${polObj.name} (${polObj.country})\n🏁 *Destino:* ${podObj.name} (${podObj.country})\n📦 *Equipo:* ${equipment}\n🚢 *Naviera:* ${selectedQuoteModal.carrier} (${selectedQuoteModal.serviceName})\n⚡ *Tiempo Tránsito:* ${selectedQuoteModal.transitDays} días\n📅 *ETD Salida:* ${selectedQuoteModal.etd}\n🏁 *ETA Llegada:* ${selectedQuoteModal.eta}\n\n💵 *TARIFA FINAL CLIENTE:* USD ${selectedQuoteModal.clientPrice} / Contenedor\n\n_Incluye Flete Marítimo + THC + BAF. Oferta sujeta a disponibilidad._`)}
                className="chat-send-btn"
                style={{ flex: 1, padding: '0.75rem', fontSize: '0.9rem' }}
              >
                📲 Copiar para WhatsApp / Email
              </button>

              <button
                onClick={() => setSelectedQuoteModal(null)}
                className="pagination-btn"
                style={{ padding: '0.75rem 1.25rem', fontSize: '0.9rem' }}
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

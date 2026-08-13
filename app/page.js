'use client';

import { useState } from 'react';

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

const INITIAL_RATES = [
  {
    carrier: 'Maersk',
    logo: '🚢',
    color: '#00243d',
    accentColor: '#42b0d5',
    serviceName: 'AE1 / FE4 Express',
    transitDays: 24,
    etd: '2026-08-20',
    eta: '2026-09-13',
    vessel: 'MAERSK MC-KINNEY MOLLER / 2608E',
    baseFreight: 2100,
    thc: 250,
    baf: 150,
    currency: 'USD',
    apiSource: 'Maersk Instant Quote API',
    status: 'Vigente hasta 31/08'
  },
  {
    carrier: 'CMA CGM',
    logo: '⚓',
    color: '#002554',
    accentColor: '#e30613',
    serviceName: 'SEAS 1 Service',
    transitDays: 28,
    etd: '2026-08-22',
    eta: '2026-09-19',
    vessel: 'CMA CGM ANTOINE DE SAINT EXUPERY',
    baseFreight: 1950,
    thc: 230,
    baf: 140,
    currency: 'USD',
    apiSource: 'CMA CGM Spot Pricing API',
    status: 'Vigente hasta 31/08'
  },
  {
    carrier: 'Hapag-Lloyd',
    logo: '🌐',
    color: '#003056',
    accentColor: '#ff6600',
    serviceName: 'AL5 / SW2 Direct',
    transitDays: 22,
    etd: '2026-08-19',
    eta: '2026-09-10',
    vessel: 'EXPRESS BERLIN / 2631W',
    baseFreight: 2050,
    thc: 240,
    baf: 145,
    currency: 'USD',
    apiSource: 'Hapag-Lloyd Quick Quotes API',
    status: 'Vigente hasta 31/08'
  },
  {
    carrier: 'MSC',
    logo: '🛥️',
    color: '#1a1a1a',
    accentColor: '#f7b500',
    serviceName: 'Ipanema Service',
    transitDays: 30,
    etd: '2026-08-25',
    eta: '2026-09-24',
    vessel: 'MSC GÜLSÜN / 2634E',
    baseFreight: 1900,
    thc: 220,
    baf: 135,
    currency: 'USD',
    apiSource: 'MSC DCSA Rates API',
    status: 'Vigente hasta 31/08'
  }
];

export default function MulticotizadorHome() {
  const [pol, setPol] = useState('CNSHA');
  const [pod, setPod] = useState('BUE');
  const [equipment, setEquipment] = useState("40'HC");
  const [marginUSD, setMarginUSD] = useState(250);
  const [marginPct, setMarginPct] = useState(0);
  const [usePct, setUsePct] = useState(false);
  const [sortBy, setSortBy] = useState('price');

  const polObj = PORTS.find(p => p.code === pol) || { name: pol };
  const podObj = PORTS.find(p => p.code === pod) || { name: pod };

  const processedRates = INITIAL_RATES.map(rate => {
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
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Multicotizador Naviero (API DCSA)</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span style={{
            background: 'rgba(16, 185, 129, 0.15)',
            color: 'var(--success)',
            padding: '0.4rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            ● Conexión API DCSA Activa
          </span>
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
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--primary)' }}>
          🔍 Búsqueda & Cotización de Fletes Marítimos
        </h2>

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

      {/* Comparison Grid */}
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
                <span>{rate.status}</span>
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

      {/* Integration Guide Section for Juan */}
      <div style={{
        background: 'var(--bg-card)',
        padding: '1.5rem',
        borderRadius: '12px',
        border: '1px solid var(--border)'
      }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--primary)' }}>
          🛠️ Guía de Conexión de APIs Oficiales Navieras (DCSA Standard)
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1rem' }}>
          Para conectar las tarifas corporativas en tiempo real de Almar Rosario, registrar la cuenta de empresa <code>@almarrosario.com</code> en los siguientes portales de desarrolladores:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <strong>1. Maersk Developer Portal</strong>
            <p style={{ color: 'var(--text-muted)', margin: '0.4rem 0' }}>Registrar en <code>developer.maersk.com</code></p>
            <span style={{ color: 'var(--accent)', fontSize: '0.75rem' }}>APIs: Instant Quote & Schedules</span>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <strong>2. CMA CGM API Portal</strong>
            <p style={{ color: 'var(--text-muted)', margin: '0.4rem 0' }}>Registrar en <code>api-portal.cma-cgm.com</code></p>
            <span style={{ color: 'var(--accent)', fontSize: '0.75rem' }}>APIs: Spot Pricing & Schedules</span>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <strong>3. Hapag-Lloyd Developer</strong>
            <p style={{ color: 'var(--text-muted)', margin: '0.4rem 0' }}>Registrar en <code>developer.hapag-lloyd.com</code></p>
            <span style={{ color: 'var(--accent)', fontSize: '0.75rem' }}>APIs: Quick Quotes & Schedules</span>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <strong>4. MSC Developer Portal</strong>
            <p style={{ color: 'var(--text-muted)', margin: '0.4rem 0' }}>Registrar en <code>developer.msc.com</code></p>
            <span style={{ color: 'var(--accent)', fontSize: '0.75rem' }}>APIs: DCSA Rates & Schedules</span>
          </div>
        </div>
      </div>
    </div>
  );
}

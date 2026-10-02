'use client';

import React from 'react';
import { 
  Compass, 
  Box, 
  Weight, 
  DollarSign, 
  ArrowUpDown, 
  AlertTriangle,
  User,
  Sliders,
  Check
} from 'lucide-react';
import { ORIGIN_PORTS, EQUIPMENT_OPTIONS } from '../../lib/demoData';

// Additional Spot Origins for Europe / USA / LATAM
const SPOT_ORIGINS = [
  { code: 'DEHAM', name: 'Hamburgo', country: 'Alemania 🇩🇪', region: 'Europa Norte', spot: true },
  { code: 'ITGOA', name: 'Génova', country: 'Italia 🇮🇹', region: 'Mediterráneo', spot: true },
  { code: 'USCHS', name: 'Charleston', country: 'EEUU 🇺🇸', region: 'Norteamérica', spot: true },
  { code: 'BRSSZ', name: 'Santos', country: 'Brasil 🇧🇷', region: 'Sudamérica', spot: true },
];

export default function FilterBar({
  origin = 'CNNGB',
  onChangeOrigin,
  equipment = '40HC',
  onChangeEquipment,
  cargoWeightKg = 18500,
  onChangeCargoWeight,
  marginUSD = 250,
  onChangeMargin,
  sortBy = 'cheapest',
  onChangeSortBy,
  clientName = 'Fundemap S.R.L.',
  onChangeClientName,
}) {
  const is20GP = equipment === '20GP';
  const weightNum = Number(cargoWeightKg) || 0;
  const isHWSActive = is20GP && weightNum > 20000;

  return (
    <div className="glass-panel" style={{
      padding: '1.25rem 1.5rem',
      marginBottom: '1.75rem',
      background: 'var(--bg-card)',
      borderColor: 'var(--border-subtle)',
    }}>
      {/* Step Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1.25rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 700,
            color: 'var(--primary)',
            background: 'rgba(6, 182, 212, 0.1)',
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
          }}>
            Paso 2: Parámetros del Embarque
          </span>
          <h2 style={{
            fontSize: '0.95rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            margin: 0,
          }}>
            Origen, Contenedor, Peso y Rentabilidad
          </h2>
        </div>

        {/* Client Selector / Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          background: 'rgba(0, 0, 0, 0.25)',
          padding: '0.35rem 0.75rem',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)',
        }}>
          <User size={14} style={{ color: 'var(--primary)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Cliente:</span>
          <input
            type="text"
            value={clientName}
            onChange={(e) => onChangeClientName && onChangeClientName(e.target.value)}
            placeholder="Empresa cliente..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-main)',
              fontSize: '0.8rem',
              fontWeight: 600,
              width: '160px',
            }}
          />
        </div>
      </div>

      {/* Main Filter Controls Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        alignItems: 'flex-start',
      }}>
        {/* 1. Origin Selector */}
        <div>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            marginBottom: '0.4rem',
          }}>
            <Compass size={14} style={{ color: 'var(--primary)' }} />
            <span>Puerto de Origen (POL)</span>
          </label>
          <select
            value={origin}
            onChange={(e) => onChangeOrigin(e.target.value)}
            className="select-input"
            style={{
              height: '42px',
              fontWeight: 600,
            }}
          >
            <optgroup label="🇨🇳 China / Far East (Tarifarios Eversail W40/W41)">
              {ORIGIN_PORTS.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name} ({p.code})
                </option>
              ))}
            </optgroup>
            <optgroup label="🌍 Europa, USA & Tráficos Spot (Mesa Operativa)">
              {SPOT_ORIGINS.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.name} ({p.code}) · {p.region}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {/* 2. Equipment Selector */}
        <div>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            marginBottom: '0.4rem',
          }}>
            <Box size={14} style={{ color: 'var(--primary)' }} />
            <span>Tipo de Equipo</span>
          </label>
          <select
            value={equipment}
            onChange={(e) => onChangeEquipment(e.target.value)}
            className="select-input"
            style={{
              height: '42px',
              fontWeight: 600,
            }}
          >
            <option value="40HC">40&apos; High Cube (40&apos;HC)</option>
            <option value="20GP">20&apos; General Purpose (20&apos;GP)</option>
            <option value="40NOR">40&apos; NOR (Non-Operating Reefer)</option>
            <option value="LCL">LCL Consolidado (Carga Suelta)</option>
          </select>
        </div>

        {/* 3. VGM Gross Weight Input */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.4rem',
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
            }}>
              <Weight size={14} style={{ color: 'var(--primary)' }} />
              <span>Peso Bruto VGM (kg)</span>
            </label>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontVariantNumeric: 'tabular-nums' }}>
              {(weightNum / 1000).toFixed(1)} tn
            </span>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              step="100"
              min="1000"
              max="32000"
              value={cargoWeightKg}
              onChange={(e) => onChangeCargoWeight(Number(e.target.value))}
              className="number-input"
              style={{
                height: '42px',
                fontVariantNumeric: 'tabular-nums',
                paddingRight: '3rem',
                fontWeight: 600,
              }}
            />
            <span style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '0.75rem',
              color: 'var(--text-dim)',
              pointerEvents: 'none',
            }}>
              kg
            </span>
          </div>
        </div>

        {/* 4. Almar Margin Input */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.4rem',
          }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
            }}>
              <DollarSign size={14} style={{ color: '#10b981' }} />
              <span>Margen Almar (USD)</span>
            </label>
            <span style={{
              fontSize: '0.7rem',
              color: '#10b981',
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
            }}>
              USD {marginUSD}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="number"
              step="25"
              min="50"
              max="2000"
              value={marginUSD}
              onChange={(e) => onChangeMargin(Number(e.target.value))}
              className="number-input"
              style={{
                height: '42px',
                fontVariantNumeric: 'tabular-nums',
                fontWeight: 600,
                flex: 1,
              }}
            />
            {/* Quick reset buttons */}
            <button
              type="button"
              onClick={() => onChangeMargin(is20GP ? 200 : 250)}
              title="Restablecer margen estándar Almar"
              style={{
                height: '42px',
                padding: '0 0.65rem',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                color: 'var(--text-muted)',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Std
            </button>
          </div>
        </div>

        {/* 5. Sort By Control */}
        <div>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--text-muted)',
            marginBottom: '0.4rem',
          }}>
            <ArrowUpDown size={14} style={{ color: 'var(--primary)' }} />
            <span>Criterio de Orden</span>
          </label>
          <select
            value={sortBy}
            onChange={(e) => onChangeSortBy(e.target.value)}
            className="select-input"
            style={{
              height: '42px',
              fontWeight: 600,
            }}
          >
            <option value="cheapest">Más Económico</option>
            <option value="fastest">Más Rápido (Menor Tiempo)</option>
            <option value="best_deal">Recomendado Almar</option>
          </select>
        </div>
      </div>

      {/* Live Heavy Weight Alert Badge (Triggered when 20'GP and weight > 20,000 kg) */}
      {isHWSActive && (
        <div style={{
          marginTop: '1rem',
          padding: '0.65rem 1rem',
          borderRadius: '8px',
          background: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          color: '#fbbf24',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          animation: 'slideUpFade 0.3s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', fontWeight: 600 }}>
            <AlertTriangle size={17} style={{ color: '#f59e0b' }} />
            <span>⚠️ Recargo de sobrepeso HWS (+USD 200) aplicado automáticamente</span>
          </div>
          <div style={{ fontSize: '0.74rem', color: '#fde68a' }}>
            Regla de naviera: Peso VGM de contenedor 20&apos;GP supera el límite operativo de 20.000 kg ({weightNum.toLocaleString()} kg).
          </div>
        </div>
      )}
    </div>
  );
}

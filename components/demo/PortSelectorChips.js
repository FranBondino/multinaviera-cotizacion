'use client';

import React, { useState } from 'react';
import { 
  Anchor, 
  Building2, 
  Factory, 
  Globe, 
  Truck, 
  Clock, 
  Info,
  ChevronDown,
  Search,
  Check
} from 'lucide-react';
import { PORT_OPTIONS } from '../../lib/demoData';

export default function PortSelectorChips({
  selectedDestination = 'ARROS',
  onSelectDestination,
  includeRoadFreight = false,
  onToggleRoadFreight,
}) {
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Primary chips
  const popularPorts = PORT_OPTIONS.filter(p => p.isPopular);
  const otherPorts = PORT_OPTIONS.filter(p => !p.isPopular);

  // Current selected port details
  const activePort = PORT_OPTIONS.find(p => p.code === selectedDestination) || PORT_OPTIONS[0];

  const filteredPorts = PORT_OPTIONS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPortIcon = (code) => {
    switch (code) {
      case 'ARROS': return <Anchor size={16} />;
      case 'ARBUE': return <Building2 size={16} />;
      case 'ARZAE': return <Factory size={16} />;
      case 'UYMVD': return <Globe size={16} />;
      default: return <Globe size={16} />;
    }
  };

  return (
    <div className="glass-panel" style={{
      padding: '1.25rem 1.5rem',
      marginBottom: '1.5rem',
      background: 'var(--bg-card)',
      borderColor: 'var(--border-subtle)',
    }}>
      {/* Label and Subtitle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1rem',
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
            Paso 1: Destino
          </span>
          <h2 style={{
            fontSize: '0.95rem',
            fontWeight: 700,
            color: 'var(--text-main)',
            margin: 0,
          }}>
            Terminal Portuaria de Destino (POD)
          </h2>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.75rem',
          color: 'var(--text-dim)',
        }}>
          <Info size={13} style={{ color: 'var(--primary)' }} />
          <span>Terminal de arribo fluvial directo o trasbordo para el Cordón Industrial</span>
        </div>
      </div>

      {/* Chips Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '0.75rem',
        marginBottom: '1rem',
      }}>
        {popularPorts.map((port) => {
          const isSelected = selectedDestination === port.code;
          return (
            <button
              key={port.code}
              type="button"
              onClick={() => onSelectDestination(port.code)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                background: isSelected 
                  ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(13, 20, 36, 0.8) 100%)' 
                  : 'rgba(255, 255, 255, 0.02)',
                border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border-subtle)',
                boxShadow: isSelected ? '0 0 15px rgba(6, 182, 212, 0.15)' : 'none',
                cursor: 'pointer',
                textAlign: 'left',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                }
              }}
              onMouseOut={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                }
              }}
            >
              {/* Top row: Name & Share badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                marginBottom: '0.35rem',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: isSelected ? 'var(--text-main)' : 'var(--text-muted)',
                }}>
                  <span style={{ color: isSelected ? 'var(--primary)' : 'var(--text-dim)' }}>
                    {getPortIcon(port.code)}
                  </span>
                  <span>{port.name}</span>
                </div>

                {port.share && (
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                    background: port.isPrimary ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    color: port.isPrimary ? 'var(--primary)' : 'var(--text-dim)',
                    border: port.isPrimary ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                  }}>
                    {port.share}
                  </span>
                )}
              </div>

              {/* Transit & Feeder status badge */}
              <div style={{
                fontSize: '0.72rem',
                color: isSelected ? '#38bdf8' : 'var(--text-dim)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                marginTop: '0.2rem',
                fontWeight: 500,
                fontVariantNumeric: 'tabular-nums',
              }}>
                <Clock size={12} />
                <span>{port.transitTimeText}</span>
              </div>

              {/* Subtle feeder indicator */}
              <div style={{
                fontSize: '0.68rem',
                color: 'var(--text-dim)',
                marginTop: '0.25rem',
              }}>
                {port.feederMode}
              </div>
            </button>
          );
        })}

        {/* 5th Option: Search / International Port dropdown */}
        <button
          type="button"
          onClick={() => setShowSearchModal(true)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            background: !popularPorts.some(p => p.code === selectedDestination)
              ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(13, 20, 36, 0.8) 100%)' 
              : 'rgba(255, 255, 255, 0.02)',
            border: !popularPorts.some(p => p.code === selectedDestination)
              ? '1.5px solid var(--primary)'
              : '1px dashed var(--border-subtle)',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary)';
          }}
          onMouseOut={(e) => {
            if (popularPorts.some(p => p.code === selectedDestination)) {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontWeight: 600,
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
            }}>
              <Globe size={16} style={{ color: 'var(--primary)' }} />
              <span>
                {!popularPorts.some(p => p.code === selectedDestination)
                  ? `${activePort.name} (${activePort.code})`
                  : 'Otro Puerto Internacional...'}
              </span>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-dim)' }} />
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>
            Hamburgo, Génova, Santos, Charleston
          </span>
        </button>
      </div>

      {/* Interactive Checkbox for Road Freight (Active ONLY if Buenos Aires is selected) */}
      {selectedDestination === 'ARBUE' && (
        <div style={{
          marginTop: '0.85rem',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          background: 'rgba(6, 182, 212, 0.06)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          animation: 'slideUpFade 0.3s ease',
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            cursor: 'pointer',
            userSelect: 'none',
          }}>
            <input
              type="checkbox"
              checked={includeRoadFreight}
              onChange={(e) => onToggleRoadFreight(e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                accentColor: 'var(--primary)',
                cursor: 'pointer',
              }}
            />
            <div>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}>
                <Truck size={16} style={{ color: 'var(--primary)' }} />
                <span>Incluir flete carretero expreso a planta Rosario (+USD 700)</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                Camión portacontenedor directo desde terminal portuaria BUE / Dock Sud hasta el Cordón Industrial Rosario (35-40d flete marítimo + 24h carretero)
              </div>
            </div>
          </label>

          <span style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            color: 'var(--primary)',
            background: 'rgba(6, 182, 212, 0.12)',
            padding: '0.2rem 0.6rem',
            borderRadius: '6px',
            fontVariantNumeric: 'tabular-nums',
          }}>
            +USD 700,00
          </span>
        </div>
      )}

      {/* Selected Port Informative Banner */}
      <div style={{
        marginTop: '0.75rem',
        padding: '0.65rem 0.85rem',
        borderRadius: '6px',
        background: 'rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.5rem',
        fontSize: '0.76rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--text-dim)' }}>POD Seleccionado:</span>
          <strong style={{ color: 'var(--text-main)' }}>{activePort.fullName}</strong>
          <span style={{ color: 'var(--text-dim)' }}>({activePort.unlocode})</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-dim)', fontVariantNumeric: 'tabular-nums' }}>
          {activePort.tollHidroviaUSD > 0 && (
            <span>Peaje Hidrovía: <strong style={{ color: '#f59e0b' }}>USD {activePort.tollHidroviaUSD}</strong></span>
          )}
          {activePort.arbitraryFeederUSD > 0 && (
            <span>Arbitrario Barcaza: <strong style={{ color: 'var(--primary)' }}>+USD {activePort.arbitraryFeederUSD}</strong></span>
          )}
          <span>Tiempo de Tránsito: <strong style={{ color: '#38bdf8' }}>{activePort.transitTimeText}</strong></span>
        </div>
      </div>

      {/* International Port Search Dropdown / Modal */}
      {showSearchModal && (
        <div 
          onClick={() => setShowSearchModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '540px',
              background: '#0D1424',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '1.25rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-main)' }}>
                Seleccionar Puerto de Destino o Tráfico Especial
              </h3>
              <button 
                type="button" 
                onClick={() => setShowSearchModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                }}
              >
                ✕
              </button>
            </div>

            {/* Search Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '0.5rem 0.85rem',
              marginBottom: '1rem',
            }}>
              <Search size={16} style={{ color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder="Buscar por puerto, código UN/LOCODE o país..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-main)',
                  width: '100%',
                  fontSize: '0.85rem',
                }}
                autoFocus
              />
            </div>

            {/* Port List */}
            <div style={{
              maxHeight: '320px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
            }}>
              {filteredPorts.map((port) => {
                const isSelected = selectedDestination === port.code;
                return (
                  <button
                    key={port.code}
                    type="button"
                    onClick={() => {
                      onSelectDestination(port.code);
                      setShowSearchModal(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '6px',
                      background: isSelected ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255,255,255,0.02)',
                      border: isSelected ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.04)',
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                    }}
                    onMouseOut={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                        {port.name} <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>({port.code})</span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {port.fullName} · {port.country}
                      </div>
                    </div>
                    {isSelected && <Check size={16} style={{ color: 'var(--primary)' }} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

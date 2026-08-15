'use client';

import { useState, useEffect, useRef } from 'react';
import { GLOBAL_PORTS } from '../lib/portsData';

export default function PortSelect({ label, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const selectedPort = GLOBAL_PORTS.find(p => p.code === value) || { name: value, country: '', code: value, unlocode: value };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    } else {
      setActiveIndex(-1);
    }
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % filteredPorts.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 + filteredPorts.length) % filteredPorts.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < filteredPorts.length) {
        onChange(filteredPorts[activeIndex].code);
        setIsOpen(false);
        setSearch('');
      }
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const filteredPorts = GLOBAL_PORTS.filter(p => {
    if (!debouncedSearch || debouncedSearch.trim() === '') return true;
    const q = debouncedSearch.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(q) ||
      p.country.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.unlocode.toLowerCase().includes(q) ||
      p.region.toLowerCase().includes(q)
    );
  });

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', boxSizing: 'border-box' }}>
      <style>{`
        .port-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .port-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 4px;
        }
        .port-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .port-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
      <label id={`label-${label.replace(/\s+/g, '-')}`} style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>
        {label}
      </label>

      {/* Trigger Button Field */}
      <div
        role="combobox"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={`label-${label.replace(/\s+/g, '-')}`}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          } else if (e.key === 'Escape') {
            setIsOpen(false);
          }
        }}
        className="select-input"
        style={{
          cursor: 'pointer',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.95)',
          padding: '0.8rem 1rem',
          minHeight: '44px',
          borderRadius: '8px',
          border: '1px solid var(--border-active)',
          width: '100%',
          boxSizing: 'border-box',
          transition: 'all 0.2s ease',
          outlineOffset: '2px'
        }}
      >
        <span style={{ fontWeight: '600', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {selectedPort.name} <span style={{ fontSize: '0.85rem', fontWeight: '400', color: '#d1d5db' }}>({selectedPort.country})</span>
        </span>
        <span style={{ fontSize: '0.75rem', color: '#22d3ee', background: 'rgba(34, 211, 238, 0.15)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: '600' }}>
          {selectedPort.unlocode || selectedPort.code} ▾
        </span>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: 0,
          right: 0,
          background: '#0f172a',
          border: '1px solid var(--border-active)',
          borderRadius: '12px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
          zIndex: 500,
          padding: '0.75rem',
          maxHeight: '320px',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          width: '100%'
        }}>
          {/* Search Input Box */}
          <input
            ref={inputRef}
            type="text"
            placeholder="🔎 Tipeá ciudad, puerto o código (ej: Shanghai, Buenos Aires...)"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setActiveIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            aria-label="Buscar puerto"
            className="number-input"
            style={{ 
              marginBottom: '0.75rem', 
              padding: '0.6rem 0.8rem', 
              minHeight: '44px',
              fontSize: '0.85rem', 
              width: '100%', 
              boxSizing: 'border-box',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#ffffff',
              borderRadius: '6px',
              outlineOffset: '2px'
            }}
          />

          {/* List Results */}
          <div role="listbox" className="port-scrollbar" style={{ overflowY: 'auto', flex: 1, width: '100%', paddingRight: '4px' }}>
            {filteredPorts.length === 0 ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.85rem' }}>
                No se encontraron puertos para "{search}"
              </div>
            ) : (
              filteredPorts.map((p, index) => (
                <div
                  key={p.code + p.unlocode}
                  role="option"
                  aria-selected={p.code === value}
                  onClick={() => {
                    onChange(p.code);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  style={{
                    padding: '0.6rem 0.8rem',
                    minHeight: '44px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    background: activeIndex === index ? 'rgba(255,255,255,0.1)' : (p.code === value ? 'rgba(59, 130, 246, 0.15)' : 'transparent'),
                    marginBottom: '0.2rem',
                    transition: 'background 0.2s',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(-1)}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', overflow: 'hidden' }}>
                    <strong style={{ color: '#ffffff', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>{p.name}</strong>
                    <span style={{ fontSize: '0.8rem', color: '#d1d5db', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.country}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.7rem', color: '#d1d5db', background: 'rgba(255,255,255,0.08)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                      {p.region}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#22d3ee', fontWeight: '600' }}>
                      {p.unlocode}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

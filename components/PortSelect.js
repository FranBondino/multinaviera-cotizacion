'use client';

import { useState, useEffect, useRef } from 'react';
import { GLOBAL_PORTS } from '../lib/portsData';

export default function PortSelect({ label, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);

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

  const filteredPorts = GLOBAL_PORTS.filter(p => {
    if (!search || search.trim() === '') return true;
    const q = search.toLowerCase().trim();
    return (
      p.name.toLowerCase().includes(q) ||
      p.country.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      p.unlocode.toLowerCase().includes(q) ||
      p.region.toLowerCase().includes(q)
    );
  });

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: '500' }}>
        {label}
      </label>

      {/* Trigger Button Field */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="select-input"
        style={{
          cursor: 'pointer',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          background: 'rgba(15, 23, 42, 0.95)'
        }}
      >
        <span style={{ fontWeight: '600', color: 'white' }}>
          {selectedPort.name} <span style={{ fontSize: '0.85rem', fontWeight: '400', color: 'var(--text-muted)' }}>({selectedPort.country})</span>
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
          {selectedPort.unlocode || selectedPort.code} ▾
        </span>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '105%',
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
          flexDirection: 'column'
        }}>
          {/* Search Input Box */}
          <input
            type="text"
            placeholder="🔎 Tipeá ciudad, puerto o código (ej: Shanghai, Buenos Aires, Ningbo...)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="number-input"
            autoFocus
            style={{ marginBottom: '0.75rem', padding: '0.6rem 0.8rem', fontSize: '0.85rem' }}
          />

          {/* List Results */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filteredPorts.length === 0 ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No se encontraron puertos para "{search}"
              </div>
            ) : (
              filteredPorts.map(p => (
                <div
                  key={p.code + p.unlocode}
                  onClick={() => {
                    onChange(p.code);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  style={{
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    background: p.code === value ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                    marginBottom: '0.2rem',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.background = p.code === value ? 'rgba(59, 130, 246, 0.15)' : 'transparent'}
                >
                  <div>
                    <strong style={{ color: 'white', fontSize: '0.9rem' }}>{p.name}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>{p.country}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.03)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                      {p.region}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600' }}>
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

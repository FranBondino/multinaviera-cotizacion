'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg('Por favor ingrese usuario y contraseña.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        window.location.href = '/';
      } else {
        setErrorMsg(data.error || 'Credenciales inválidas. Intente nuevamente.');
      }
    } catch (err) {
      setErrorMsg('Error de red al conectar con el servidor de autenticación.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '440px',
        width: '100%',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8)',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
            borderRadius: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            fontSize: '1.75rem',
            color: 'white',
            boxShadow: '0 8px 24px rgba(6, 182, 212, 0.35)',
            marginBottom: '1rem'
          }}>
            A
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white', letterSpacing: '-0.5px', margin: 0 }}>
            Almar Rosario
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '0.35rem' }}>
            <span style={{
              background: 'rgba(6, 182, 212, 0.15)',
              color: 'var(--primary)',
              fontSize: '0.72rem',
              fontWeight: '700',
              padding: '0.2rem 0.5rem',
              borderRadius: '6px',
              border: '1px solid rgba(6, 182, 212, 0.3)'
            }}>
              FREIGHT INTELLIGENCE TMS
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
            Acceso operativo para equipo interno de cotización marítima
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#f87171',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.85rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.82rem',
              fontWeight: '600',
              color: 'var(--text-muted)',
              marginBottom: '0.4rem'
            }}>
              Usuario o Correo Operativo
            </label>
            <input
              type="text"
              autoComplete="username"
              placeholder="almar o expo@almarrosario.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="number-input"
              style={{ width: '100%', fontSize: '0.95rem' }}
              disabled={isLoading}
            />
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.82rem',
              fontWeight: '600',
              color: 'var(--text-muted)',
              marginBottom: '0.4rem'
            }}>
              Contraseña
            </label>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="number-input"
              style={{ width: '100%', fontSize: '0.95rem' }}
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '0.85rem',
              fontSize: '0.95rem',
              fontWeight: '700',
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? '🔐 Verificando credenciales...' : '🔓 Ingresar al Multicotizador'}
          </button>
        </form>

        {/* Security Footer Notice */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-dim)',
          lineHeight: '1.5'
        }}>
          <span>🛡️ Conexión cifrada con Token de Sesión HttpOnly.</span><br />
          <span>Almar Rosario S.R.L. • Uso Interno Confidencial</span>
        </div>
      </div>
    </div>
  );
}

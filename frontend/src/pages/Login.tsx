import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { unlock } = useAuth();
  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError('');

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 4 digits filled
    if (value && index === 3) {
      const fullPin = [...newPin.slice(0, 3), value].join('');
      if (fullPin.length === 4) submitPin(fullPin);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const submitPin = async (fullPin: string) => {
    if (submitting) return;
    setSubmitting(true);
    const success = await unlock(fullPin);
    setSubmitting(false);
    if (success) {
      navigate('/');
    } else {
      setShake(true);
      setError('Incorrect PIN');
      setPin(['', '', '', '']);
      setTimeout(() => {
        setShake(false);
        inputRefs.current[0]?.focus();
      }, 600);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitPin(pin.join(''));
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 40%, #16213e 70%, #0f3460 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        backgroundColor: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(16px)',
        borderRadius: '16px',
        padding: '2.5rem 2rem',
        width: '90%',
        maxWidth: '340px',
        textAlign: 'center',
        border: '1px solid rgba(255,255,255,0.12)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔐</div>
        <h2 style={{ color: '#fff', marginBottom: '0.25rem', fontSize: '1.4rem', fontWeight: 'bold' }}>
          Sri Rama Prints
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Enter your 4-digit PIN
        </p>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              animation: shake ? 'shake 0.5s ease' : 'none',
            }}
          >
            {pin.map((digit, i) => (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el; }}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                style={{
                  width: '56px',
                  height: '56px',
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  border: `2px solid ${error ? '#ff6b6b' : digit ? '#fff' : 'rgba(255,255,255,0.4)'}`,
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
              />
            ))}
          </div>

          {error && (
            <p style={{ color: '#ff6b6b', marginBottom: '1rem', fontSize: '0.9rem', fontWeight: 'bold' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pin.join('').length < 4 || submitting}
            style={{
              width: '100%',
              padding: '0.85rem',
              backgroundColor: pin.join('').length === 4 && !submitting ? '#007bff' : 'rgba(255,255,255,0.2)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: pin.join('').length === 4 && !submitting ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s',
            }}
          >
            {submitting ? 'Unlocking...' : 'Unlock'}
          </button>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Shield, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/ui/Logo';

export function Login() {
  const navigate = useNavigate();
  const { setAuthToken } = useAppStore();
  const [password, setPassword] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'Invalid Master Key');
      }

      setAuthToken(data.data.token);
      localStorage.setItem('vtx_jwt', data.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ob-page">
      <div className="ob-card">
        <div className="ob-brand">
          <Logo height={32} />
          <span className="ob-logo-text">VERTEX</span>
        </div>

        <form className="ob-step" onSubmit={handleLogin}>
          <div className="ob-icon-wrap ob-icon-purple"><Shield size={24} /></div>
          <h1 className="ob-title">Master Sequence</h1>
          <p className="ob-sub">Enter your master key to unlock Vertex.</p>

          <div className="ob-field-group mb-xl w-full">
            <div className="ob-pin-wrap">
              <input 
                type={showPin ? 'text' : 'password'}
                className="ob-input ob-pin-input text-center" 
                placeholder="Master Password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
              />
              <button type="button" className="ob-pin-toggle" onClick={() => setShowPin(!showPin)}>
                {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="ob-error mb-lg">{error}</p>}
          <Button type="submit" className="ob-btn-primary mt-md w-full" disabled={isLoading}>
            {isLoading ? 'Decrypting...' : 'Unlock Orbit'} <ArrowRight size={16} />
          </Button>
        </form>
      </div>
    </div>
  );
}

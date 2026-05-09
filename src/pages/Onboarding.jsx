import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setContext, createUser, getTheme } from '../utils/storage';
import { Shield, Sparkles, ArrowRight, Eye, EyeOff, CheckCircle, Palette } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ModeToggle } from '../components/ui/ModeToggle';
import { Logo } from '../components/ui/Logo';
import './Onboarding.css';

const STEP = { THEME: 0, WELCOME: 1, PROFILE: 2, CREDS: 3, SUCCESS: 4 };

export function Onboarding() {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Initialize theme outside the main app shell
    const theme = getTheme();
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  const [step, setStep] = useState(STEP.THEME);
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);

  // Form States
  const [userForm, setUserForm] = useState({ 
    name: '', 
    email: '', 
    username: '', 
    password: '', 
    bio: '', 
    profession: '' 
  });

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleNext = () => {
    if (step === STEP.THEME) setStep(STEP.WELCOME);
    else if (step === STEP.WELCOME) setStep(STEP.PROFILE);
    else if (step === STEP.PROFILE) {
      if (!userForm.name || !userForm.email || !userForm.username) {
        setError('Please fill in your primary details.');
        return;
      }
      setError('');
      setStep(STEP.CREDS);
    }
  };

  const finalizeOnboarding = (e) => {
    e.preventDefault();
    if (!userForm.password) {
      setError('A secure sequence (password) is required.');
      return;
    }
    
    // Save User
    createUser({
      ...userForm,
      sentinelData: {
        bio: userForm.bio,
        onboardingDate: new Date().toISOString()
      }
    });

    setContext('normal', userForm.username);
    setStep(STEP.SUCCESS);
  };

  return (
    <div className="ob-page">
      <div className="ob-card">
        <div className="ob-brand">
          <Logo height={32} />
          <span className="ob-logo-text">Tesseract</span>
        </div>

        {/* ── STEP 0: Theme Selection ────────────────────────────────────────── */}
        {step === STEP.THEME && (
          <div className="ob-step ob-theme-picker">
            <div className="ob-icon-wrap ob-icon-purple"><Palette size={24} /></div>
            <h1 className="font-display text-4xl font-bold text-text-primary mb-sm">
              Preferred experience
            </h1>
            <p className="font-body text-lg text-text-secondary mb-xl">
              Choose how Vertex feels for you. You can change this any time from the top bar.
            </p>
            
            <div className="flex flex-col items-center w-full">
              <ModeToggle size="lg" />
              <div className="mt-lg flex justify-between w-full max-w-[200px]">
                <span className="font-body text-[11px] text-text-muted">
                  Aether — Cosmic
                </span>
                <span className="font-body text-[11px] text-text-muted">
                  Quasar — Minimal
                </span>
              </div>
            </div>

            <Button className="mt-xl w-full" onClick={handleNext}>Confirm Essence <ArrowRight size={16} /></Button>
          </div>
        )}

        {/* ── STEP 1: Welcome ────────────────────────────────────────────── */}
        {step === STEP.WELCOME && (
          <div className="ob-step ob-gateway">
            <h1 className="ob-title">Focus is the New High Performance</h1>
            <p className="ob-sub">Tesseract is your private operating system for craft. It stays offline, stays fast, and stays yours.</p>
            
            <div className="ob-welcome-hero">
               <Shield size={64} className="hero-icon" />
            </div>

            <Button className="ob-btn-primary" onClick={handleNext}>Initialize Instance <ArrowRight size={16} /></Button>
          </div>
        )}

        {/* ── STEP 1: Profile & Sentinel ───────────────────────────────────── */}
        {step === STEP.PROFILE && (
          <div className="ob-step">
            <div className="ob-icon-wrap ob-icon-indigo"><Sparkles size={24} /></div>
            <h1 className="ob-title">Identify Your Craft</h1>
            <p className="ob-sub">Sentinel uses this to personalize your insights.</p>

            <div className="ob-field-group">
              <input 
                className="ob-input" 
                placeholder="Full Name" 
                value={userForm.name}
                onChange={e => setUserForm({...userForm, name: e.target.value})}
              />
              <input 
                className="ob-input" 
                placeholder="Email Address" 
                value={userForm.email}
                onChange={e => setUserForm({...userForm, email: e.target.value})}
              />
              <input 
                className="ob-input" 
                placeholder="System Handle (Username)" 
                value={userForm.username}
                onChange={e => setUserForm({...userForm, username: e.target.value.toLowerCase().replace(/\s/g, '')})}
              />
              <textarea 
                className="ob-input ob-textarea" 
                placeholder="The Sentinel bio: What is your primary focus? (e.g. Building high-end mobile apps for startups)" 
                value={userForm.bio}
                onChange={e => setUserForm({...userForm, bio: e.target.value})}
              />
            </div>

            {error && <p className="ob-error">{error}</p>}
            <Button className="ob-btn-primary" onClick={handleNext}>Sequence Locked <ArrowRight size={16} /></Button>
          </div>
        )}

        {/* ── STEP 2: Credentials ────────────────────────────────────────── */}
        {step === STEP.CREDS && (
          <form className="ob-step" onSubmit={finalizeOnboarding}>
            <div className="ob-icon-wrap ob-icon-purple"><Shield size={24} /></div>
            <h1 className="ob-title">Secure Your Workspace</h1>
            <p className="ob-sub">This password is used for sensitive actions (Backups, Delete).</p>

            <div className="ob-field-group">
              <div className="ob-pin-wrap">
                <input 
                  type={showPin ? 'text' : 'password'}
                  className="ob-input ob-pin-input" 
                  placeholder="Master Sequence (Password)" 
                  value={userForm.password}
                  onChange={e => setUserForm({...userForm, password: e.target.value})}
                  autoFocus
                />
                <button type="button" className="ob-pin-toggle" onClick={() => setShowPin(!showPin)}>
                  {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="ob-error">{error}</p>}
            <Button type="submit" className="ob-btn-primary">Initialize Tesseract <ArrowRight size={16} /></Button>
          </form>
        )}

        {/* ── STEP 3: Success ────────────────────────────────────────────── */}
        {step === STEP.SUCCESS && (
          <div className="ob-step ob-done">
            <div className="ob-done-icon"><CheckCircle size={48} /></div>
            <h1 className="ob-title">Sequence Complete</h1>
            <p className="ob-sub">Welcome, {userForm.name.split(' ')[0]}. Your instance is now active.</p>
            
            <div className="ob-setup-tasks">
               <p className="setup-hint">Recommended first steps:</p>
               <ul className="setup-list">
                  <li><CheckCircle size={14}/> Add your first client</li>
                  <li><CheckCircle size={14}/> Define an active project</li>
                  <li><CheckCircle size={14}/> Schedule your first task</li>
               </ul>
            </div>

            <Button className="ob-btn-primary" onClick={() => navigate(`/${userForm.username}/dashboard`)}>
              Launch Dashboard <ArrowRight size={16} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

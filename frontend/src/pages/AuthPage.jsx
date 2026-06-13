import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Btn } from '../components/ui/Btn';
import { CheckCircle2, TrendingUp, ShieldCheck } from "lucide-react";

export function AuthPage({ toast }) {
  const [tab, setTab] = useState('login'); // 'login' or 'register'
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const { login, register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (tab === 'login') {
        await login(username, password);
        toast('Login successful', 'success');
      } else {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await register(username, email, password);
        toast('Registration successful! Please complete your company profile.', 'success');
      }
    } catch (err) {
      toast(err.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <style>{`
        .auth-hero {
          flex: 1.2;
          background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #3b82f6 100%);
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 80px;
          position: relative;
          overflow: hidden;
        }
        .auth-hero::before {
          content: '';
          position: absolute;
          width: 150%;
          height: 150%;
          background: radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, transparent 50%);
          top: -25%;
          left: -25%;
          animation: pulse-glow 8s ease-in-out infinite alternate;
        }
        @keyframes pulse-glow {
          0% { transform: scale(0.8) translate(0, 0); opacity: 0.5; }
          100% { transform: scale(1.2) translate(5%, 5%); opacity: 1; }
        }
        .auth-hero-content {
          position: relative;
          z-index: 2;
        }
        .auth-form-container {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg);
          padding: 24px;
        }
        .auth-card {
          background: var(--card);
          padding: 40px;
          border-radius: 16px;
          border: 1px solid var(--border);
          width: 100%;
          max-width: 440px;
          box-shadow: 0 20px 40px -15px rgba(0,0,0,0.05);
        }
        .auth-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--bg);
          color: var(--text);
          font-size: 15px;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }
        .auth-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
        }
        .auth-tab {
          flex: 1;
          padding: 12px 0;
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.3s ease;
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          font-size: 16px;
          color: rgba(255,255,255,0.9);
          background: rgba(255,255,255,0.05);
          padding: 16px 20px;
          border-radius: 12px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.1);
          transform: translateY(0);
          transition: transform 0.3s ease;
        }
        .feature-item:hover {
          transform: translateY(-5px);
          background: rgba(255,255,255,0.1);
        }
        @media (max-width: 900px) {
          .auth-hero { display: none; }
          .auth-card { padding: 32px 24px; box-shadow: none; border: none; background: transparent; }
          .auth-form-container { align-items: flex-start; padding-top: 10vh; }
        }
      `}</style>

      {/* Left Panel - Branding */}
      <div className="auth-hero">
        <div className="auth-hero-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: 30, marginBottom: 32, border: '1px solid rgba(255,255,255,0.2)' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 10px #4ade80' }} />
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 1 }}>SYSTEMS ONLINE</span>
          </div>
          
          <h1 style={{ fontSize: 48, fontWeight: 800, marginBottom: 16, lineHeight: 1.1, letterSpacing: '-0.5px' }}>
            Welcome to <br/><span style={{ color: '#93c5fd' }}>Mahavir Bills</span>
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: 'rgba(255,255,255,0.8)', marginBottom: 48, maxWidth: 500 }}>
            The professional billing and inventory management software built to streamline your business operations and accelerate growth.
          </p>

          <div style={{ maxWidth: 450 }}>
            <div className="feature-item">
              <CheckCircle2 color="#93c5fd" size={24} />
              <div>
                <strong style={{ display: 'block', marginBottom: 4 }}>Smart Invoicing</strong>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Create, track, and manage professional bills instantly.</span>
              </div>
            </div>
            <div className="feature-item">
              <TrendingUp color="#93c5fd" size={24} />
              <div>
                <strong style={{ display: 'block', marginBottom: 4 }}>Real-time Analytics</strong>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Monitor your revenue and party balances at a glance.</span>
              </div>
            </div>
            <div className="feature-item">
              <ShieldCheck color="#93c5fd" size={24} />
              <div>
                <strong style={{ display: 'block', marginBottom: 4 }}>Secure & Isolated</strong>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Enterprise-grade security ensuring your data remains private.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="auth-form-container">
        <div className="auth-card">
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, background: 'var(--primary)', borderRadius: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)' }}>
              <img src="/favicon.png" alt="logo" style={{ width: 32, height: 32, filter: 'brightness(0) invert(1)' }} />
            </div>
            <h2 style={{ margin: 0, color: 'var(--text)', fontSize: 24, fontWeight: 700 }}>Get Started</h2>
            <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: 14 }}>Sign in to your Mahavir Bills account</p>
          </div>
          
          <div style={{ display: 'flex', marginBottom: 32, background: 'var(--bg)', padding: 4, borderRadius: 12, border: '1px solid var(--border)' }}>
            <button 
              className="auth-tab"
              onClick={() => setTab('login')} 
              style={{ 
                color: tab === 'login' ? '#fff' : 'var(--text-muted)', 
                fontWeight: tab === 'login' ? 600 : 500, 
                background: tab === 'login' ? 'var(--primary)' : 'transparent', 
                borderRadius: 8,
                boxShadow: tab === 'login' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
              }}
            >
              Login
            </button>
            <button 
              className="auth-tab"
              onClick={() => setTab('register')} 
              style={{ 
                color: tab === 'register' ? '#fff' : 'var(--text-muted)', 
                fontWeight: tab === 'register' ? 600 : 500, 
                background: tab === 'register' ? 'var(--primary)' : 'transparent', 
                borderRadius: 8,
                boxShadow: tab === 'register' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
              }}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Username</label>
              <input 
                type="text" 
                className="auth-input"
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                required 
                placeholder="Enter your username"
              />
            </div>

            {tab === 'register' && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Email Address</label>
                <input 
                  type="email" 
                  className="auth-input"
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="name@company.com"
                />
              </div>
            )}

            <div style={{ marginBottom: tab === 'register' ? 20 : 32 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Password</label>
              <input 
                type="password" 
                className="auth-input"
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                placeholder="••••••••"
              />
            </div>

            {tab === 'register' && (
              <div style={{ marginBottom: 32 }}>
                <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Confirm Password</label>
                <input 
                  type="password" 
                  className="auth-input"
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  required 
                  placeholder="••••••••"
                />
              </div>
            )}

            <Btn type="submit" variant="primary" style={{ width: '100%', padding: '14px', justifyContent: 'center', fontSize: 16, fontWeight: 600, borderRadius: 10, boxShadow: '0 8px 20px -6px rgba(59, 130, 246, 0.5)' }} disabled={loading}>
              {loading ? (tab === 'login' ? 'Authenticating...' : 'Setting up workspace...') : (tab === 'login' ? 'Sign In to Dashboard' : 'Create Account')}
            </Btn>
          </form>
        </div>
      </div>
    </div>
  );
}

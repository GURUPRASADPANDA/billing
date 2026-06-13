import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Btn } from '../components/ui/Btn';

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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ background: 'var(--card)', padding: 32, borderRadius: 12, border: '1px solid var(--border)', width: '100%', maxWidth: 420 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24, color: 'var(--text)', fontSize: 24, fontWeight: 700 }}>Mahavir Billing</h2>
        
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 8 }}>
          <button 
            onClick={() => setTab('login')} 
            style={{ flex: 1, padding: '8px 0', border: 'none', background: 'transparent', color: tab === 'login' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: tab === 'login' ? 600 : 400, borderBottom: tab === 'login' ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Login
          </button>
          <button 
            onClick={() => setTab('register')} 
            style={{ flex: 1, padding: '8px 0', border: 'none', background: 'transparent', color: tab === 'register' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: tab === 'register' ? 600 : 400, borderBottom: tab === 'register' ? '2px solid var(--primary)' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'var(--text-muted)' }}>Username *</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} 
            />
          </div>

          {tab === 'register' && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'var(--text-muted)' }}>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} 
              />
            </div>
          )}

          <div style={{ marginBottom: tab === 'register' ? 16 : 24 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'var(--text-muted)' }}>Password *</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} 
            />
          </div>

          {tab === 'register' && (
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: 'var(--text-muted)' }}>Confirm Password *</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                required 
                style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} 
              />
            </div>
          )}

          <Btn type="submit" variant="primary" style={{ width: '100%', padding: 12, justifyContent: 'center' }} disabled={loading}>
            {loading ? (tab === 'login' ? 'Signing in...' : 'Creating account...') : (tab === 'login' ? 'Login' : 'Create Account')}
          </Btn>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { api } from '../../services/api';
import { Btn } from '../../components/ui/Btn';
import { ShieldAlert } from 'lucide-react';

export function AdminLoginPage({ toast, setAdminToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.adminLogin({ username, password });
      setAdminToken(data.token);
      toast('Admin Login successful', 'success');
    } catch (err) {
      toast(err.message || 'Invalid admin credentials', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0f172a' }}>
      <div style={{ background: '#1e293b', padding: 40, borderRadius: 16, width: '100%', maxWidth: 400, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '1px solid #334155' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <ShieldAlert color="#ef4444" size={48} style={{ marginBottom: 16 }} />
          <h2 style={{ margin: 0, color: '#f8fafc', fontSize: 24, fontWeight: 700 }}>Admin Portal</h2>
          <p style={{ margin: '8px 0 0', color: '#94a3b8', fontSize: 14 }}>Restricted access only</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: '#e2e8f0', textTransform: 'uppercase' }}>Admin Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid #475569', background: '#0f172a', color: '#f8fafc', fontSize: 15, boxSizing: 'border-box' }} 
            />
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 600, color: '#e2e8f0', textTransform: 'uppercase' }}>Admin Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid #475569', background: '#0f172a', color: '#f8fafc', fontSize: 15, boxSizing: 'border-box' }} 
            />
          </div>

          <Btn type="submit" style={{ width: '100%', background: '#ef4444', color: '#fff', border: 'none', padding: 14, justifyContent: 'center', fontSize: 16, fontWeight: 600, borderRadius: 10 }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Secure Login'}
          </Btn>
        </form>
      </div>
    </div>
  );
}

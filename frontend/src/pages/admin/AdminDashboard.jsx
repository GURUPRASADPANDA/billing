import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Btn } from '../../components/ui/Btn';
import { Users, LogOut, Trash2, UserPlus, Clock } from 'lucide-react';

export function AdminDashboard({ toast, adminToken, logout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await api.adminGetUsers(adminToken);
      setUsers(data);
    } catch (err) {
      toast('Failed to load users: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Are you absolutely sure you want to delete ${username} and ALL their data?`)) return;
    try {
      await api.adminDeleteUser(id, adminToken);
      toast('User deleted successfully', 'success');
      fetchUsers();
    } catch (err) {
      toast('Failed to delete user: ' + err.message, 'error');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.adminCreateUser(newUser, adminToken);
      toast('User created successfully', 'success');
      setShowAdd(false);
      setNewUser({ username: '', email: '', password: '' });
      fetchUsers();
    } catch (err) {
      toast('Failed to create user: ' + err.message, 'error');
    }
  };

  const activeUsers = users.filter(u => u.lastLogin && (new Date() - new Date(u.lastLogin)) < 1000 * 60 * 60 * 24); // Active in last 24h

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', color: '#0f172a', padding: '40px 20px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, background: '#fff', padding: '20px 32px', borderRadius: 16, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, background: '#ef4444', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Users size={24} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Admin Dashboard</h1>
              <span style={{ color: '#64748b', fontSize: 14 }}>System Management Portal</span>
            </div>
          </div>
          <Btn onClick={logout} style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' }}><LogOut size={16} style={{ marginRight: 8 }} /> Exit Admin</Btn>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24, marginBottom: 40 }}>
          <div style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ color: '#64748b', fontSize: 14, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>Total Users</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#0f172a' }}>{users.length}</div>
          </div>
          <div style={{ background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ color: '#64748b', fontSize: 14, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>Active Today</div>
            <div style={{ fontSize: 36, fontWeight: 800, color: '#10b981' }}>{activeUsers.length}</div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Registered Users</h2>
            <Btn onClick={() => setShowAdd(!showAdd)} style={{ background: '#3b82f6', color: '#fff', border: 'none' }}>
              <UserPlus size={16} style={{ marginRight: 8 }} /> Add User
            </Btn>
          </div>

          {showAdd && (
            <div style={{ padding: 24, background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>Create New Account</h3>
              <form onSubmit={handleAddUser} style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <label style={{ display: 'block', fontSize: 13, marginBottom: 6, fontWeight: 500 }}>Username *</label>
                  <input required value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <label style={{ display: 'block', fontSize: 13, marginBottom: 6, fontWeight: 500 }}>Email</label>
                  <input value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <label style={{ display: 'block', fontSize: 13, marginBottom: 6, fontWeight: 500 }}>Password *</label>
                  <input required type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', boxSizing: 'border-box' }} />
                </div>
                <Btn type="submit" style={{ background: '#10b981', color: '#fff', border: 'none', height: 40, padding: '0 24px' }}>Create</Btn>
              </form>
            </div>
          )}

          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Loading users...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '16px 24px', fontSize: 13, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>User Details</th>
                    <th style={{ padding: '16px 24px', fontSize: 13, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Joined</th>
                    <th style={{ padding: '16px 24px', fontSize: 13, fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Last Login</th>
                    <th style={{ padding: '16px 24px', fontSize: 13, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{user.username}</div>
                        <div style={{ fontSize: 13, color: '#64748b' }}>{user.email || 'No email provided'}</div>
                      </td>
                      <td style={{ padding: '16px 24px', color: '#475569', fontSize: 14 }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '16px 24px', color: '#475569', fontSize: 14 }}>
                        {user.lastLogin ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Clock size={14} color="#3b82f6" />
                            {new Date(user.lastLogin).toLocaleString()}
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Never logged in</span>
                        )}
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <button 
                          onClick={() => handleDelete(user._id, user.username)}
                          style={{ background: 'transparent', border: '1px solid #fecaca', color: '#ef4444', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, transition: 'all 0.2s' }}
                          onMouseOver={(e) => { e.currentTarget.style.background = '#fee2e2'; }}
                          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No users found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

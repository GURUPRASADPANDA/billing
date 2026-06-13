import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Btn } from '../../components/ui/Btn';
import { Users, LogOut, Trash2, UserPlus, Clock, Eye, X, RefreshCcw, ArchiveX } from 'lucide-react';

export function AdminDashboard({ toast, adminToken, logout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('active'); // 'active' | 'trash'

  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '' });

  const [selectedUser, setSelectedUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  // Extra Layer Security: Auto logout after 5 minutes of inactivity
  useEffect(() => {
    let timeoutId;
    const handleLogout = () => {
      window.alert("Security Alert: Your Admin session has expired after 5 minutes of inactivity. You will now be logged out.");
      logout();
    };

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(handleLogout, 5 * 60 * 1000); // 5 minutes
    };

    // Initialize timer
    resetTimer();

    // Reset timer on any user activity
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [logout]);

  useEffect(() => {
    fetchUsers();
  }, [view]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = view === 'active' 
        ? await api.adminGetUsers(adminToken)
        : await api.adminGetTrashedUsers(adminToken);
      setUsers(data);
    } catch (err) {
      toast('Failed to load users: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewData = async (user) => {
    setSelectedUser(user);
    setLoadingData(true);
    setUserData(null);
    try {
      const data = await api.adminGetUserData(user._id, adminToken);
      setUserData(data);
    } catch (err) {
      toast('Failed to load user data: ' + err.message, 'error');
      setSelectedUser(null);
    } finally {
      setLoadingData(false);
    }
  };

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Are you sure you want to move ${username} to Trash? They won't be able to log in.`)) return;
    try {
      await api.adminDeleteUser(id, adminToken);
      toast('User moved to trash', 'success');
      fetchUsers();
    } catch (err) {
      toast('Failed to delete user: ' + err.message, 'error');
    }
  };

  const handleRestore = async (id, username) => {
    try {
      await api.adminRestoreUser(id, adminToken);
      toast(`${username} restored successfully`, 'success');
      fetchUsers();
    } catch (err) {
      toast('Failed to restore user: ' + err.message, 'error');
    }
  };

  const handlePermanentDelete = async (id, username) => {
    if (!window.confirm(`WARNING: Are you absolutely sure you want to PERMANENTLY delete ${username} and ALL their data? This cannot be undone.`)) return;
    try {
      await api.adminPermanentDeleteUser(id, adminToken);
      toast('User permanently deleted', 'success');
      fetchUsers();
    } catch (err) {
      toast('Failed to permanently delete user: ' + err.message, 'error');
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
    <div style={{ minHeight: '100vh', background: '#f1f5f9', color: '#0f172a', padding: '40px 20px', position: 'relative' }}>
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
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', gap: 16, borderBottom: '2px solid transparent' }}>
              <button 
                onClick={() => setView('active')} 
                style={{ background: 'none', border: 'none', padding: '0 0 8px', fontSize: 16, fontWeight: 600, color: view === 'active' ? '#3b82f6' : '#64748b', borderBottom: view === 'active' ? '2px solid #3b82f6' : '2px solid transparent', cursor: 'pointer' }}
              >
                Active Users
              </button>
              <button 
                onClick={() => setView('trash')} 
                style={{ background: 'none', border: 'none', padding: '0 0 8px', fontSize: 16, fontWeight: 600, color: view === 'trash' ? '#ef4444' : '#64748b', borderBottom: view === 'trash' ? '2px solid #ef4444' : '2px solid transparent', cursor: 'pointer' }}
              >
                Recycle Bin
              </button>
            </div>
            {view === 'active' && (
              <Btn onClick={() => setShowAdd(!showAdd)} style={{ background: '#3b82f6', color: '#fff', border: 'none' }}>
                <UserPlus size={16} style={{ marginRight: 8 }} /> Add User
              </Btn>
            )}
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
                        <div style={{ display: 'inline-flex', gap: 8 }}>
                          <button 
                            onClick={() => handleViewData(user)}
                            style={{ background: 'transparent', border: '1px solid #bae6fd', color: '#0284c7', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, transition: 'all 0.2s' }}
                          >
                            <Eye size={14} /> View
                          </button>
                          {view === 'active' ? (
                            <button 
                              onClick={() => handleDelete(user._id, user.username)}
                              style={{ background: 'transparent', border: '1px solid #fca5a5', color: '#ef4444', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, transition: 'all 0.2s' }}
                            >
                              <Trash2 size={14} /> Trash
                            </button>
                          ) : (
                            <>
                              <button 
                                onClick={() => handleRestore(user._id, user.username)}
                                style={{ background: 'transparent', border: '1px solid #86efac', color: '#10b981', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, transition: 'all 0.2s' }}
                              >
                                <RefreshCcw size={14} /> Restore
                              </button>
                              <button 
                                onClick={() => handlePermanentDelete(user._id, user.username)}
                                style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, transition: 'all 0.2s' }}
                              >
                                <ArchiveX size={14} /> Delete
                              </button>
                            </>
                          )}
                        </div>
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

      {/* User Data Modal */}
      {selectedUser && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{selectedUser.username}'s Data</h2>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>ID: {selectedUser._id}</div>
              </div>
              <button onClick={() => setSelectedUser(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ padding: 24 }}>
              {loadingData ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Fetching detailed records...</div>
              ) : userData ? (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                    <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>Total Bills</div>
                      <div style={{ fontSize: 24, fontWeight: 700, color: '#3b82f6' }}>{userData.stats.bills}</div>
                    </div>
                    <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>Total Items</div>
                      <div style={{ fontSize: 24, fontWeight: 700, color: '#8b5cf6' }}>{userData.stats.items}</div>
                    </div>
                    <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>Total Parties</div>
                      <div style={{ fontSize: 24, fontWeight: 700, color: '#10b981' }}>{userData.stats.parties}</div>
                    </div>
                  </div>

                  <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, borderBottom: '1px solid #e2e8f0', paddingBottom: 8 }}>Company Profile</h3>
                  {userData.profile ? (
                    <div style={{ background: '#f8fafc', padding: 20, borderRadius: 12, border: '1px solid #e2e8f0', marginBottom: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div><strong style={{ display: 'block', fontSize: 12, color: '#64748b' }}>Company Name:</strong> {userData.profile.companyName}</div>
                      <div><strong style={{ display: 'block', fontSize: 12, color: '#64748b' }}>Phone:</strong> {userData.profile.phone}</div>
                      <div><strong style={{ display: 'block', fontSize: 12, color: '#64748b' }}>Email:</strong> {userData.profile.email || '-'}</div>
                      <div><strong style={{ display: 'block', fontSize: 12, color: '#64748b' }}>GST No:</strong> {userData.profile.gstNo || '-'}</div>
                      <div style={{ gridColumn: '1 / -1' }}><strong style={{ display: 'block', fontSize: 12, color: '#64748b' }}>Address:</strong> {userData.profile.address || '-'}</div>
                    </div>
                  ) : (
                    <div style={{ padding: 16, background: '#fffbeb', color: '#b45309', borderRadius: 12, marginBottom: 24 }}>Company profile not set up yet.</div>
                  )}

                  <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, borderBottom: '1px solid #e2e8f0', paddingBottom: 8 }}>Recent Bills</h3>
                  {userData.recentBills.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                      <thead>
                        <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                          <th style={{ padding: '8px 0', textAlign: 'left', fontWeight: 600 }}>Bill #</th>
                          <th style={{ padding: '8px 0', textAlign: 'left', fontWeight: 600 }}>Date</th>
                          <th style={{ padding: '8px 0', textAlign: 'left', fontWeight: 600 }}>Party</th>
                          <th style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600 }}>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userData.recentBills.map(bill => (
                          <tr key={bill._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '12px 0' }}>{bill.billNumber}</td>
                            <td style={{ padding: '12px 0' }}>{new Date(bill.billDate).toLocaleDateString()}</td>
                            <td style={{ padding: '12px 0' }}>{bill.party?.companyName || 'Unknown'}</td>
                            <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: 600 }}>₹{(bill.grandTotal || 0).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ color: '#64748b', fontStyle: 'italic' }}>No bills generated yet.</div>
                  )}
                </div>
              ) : (
                <div style={{ color: '#ef4444' }}>Failed to load data.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

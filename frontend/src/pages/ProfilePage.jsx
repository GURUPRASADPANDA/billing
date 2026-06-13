import React, { useState } from 'react';
import { User, LogOut, KeyRound } from "lucide-react";
import { api } from "../services/api";
import { Input } from "../components/ui/Input";
import { Btn } from "../components/ui/Btn";

export function ProfilePage({ toast, company, setCompany, user, logout }) {
  const [form, setForm] = useState(company);
  const [saving, setSaving] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [changingPassword, setChangingPassword] = useState(false);

  const save = async () => {
    if (!form.companyName.trim()) { toast("Company name is required", "error"); return; }
    setSaving(true);
    try {
      const updated = await api.updateProfile(form);
      setCompany(updated);
      toast("Profile updated successfully!", "success");
    } catch (e) { toast(e.message, "error"); }
    finally { setSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast("New passwords do not match", "error");
      return;
    }
    setChangingPassword(true);
    try {
      await api.changePassword({ oldPassword: passwordForm.oldPassword, newPassword: passwordForm.newPassword });
      toast("Password updated successfully!", "success");
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", paddingBottom: 40 }}>
      
      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 600, color: "var(--text)" }}>Account</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 'bold' }}>
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>{user?.username}</div>
            {user?.email && <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{user.email}</div>}
          </div>
        </div>
        <Btn onClick={logout} style={{ background: '#ef4444', color: '#fff', border: 'none' }}><LogOut size={16} style={{ marginRight: 6 }} /> Logout</Btn>
      </div>

      <h2 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <User size={20} />
          <span>Company Profile</span>
        </div>
      </h2>

      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <Input label="Company Name *" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} />
        <Input label="GST Number" value={form.gstNumber} onChange={e => setForm({ ...form, gstNumber: e.target.value })} />
        <Input label="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6 }}>Address</label>
          <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={4}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 14, outline: "none", boxSizing: "border-box", resize: "vertical" }} />
        </div>
        <Btn loading={saving} onClick={save} style={{ width: "100%", justifyContent: "center" }}>Save Profile</Btn>
      </div>

      <h2 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <KeyRound size={20} />
          <span>Change Password</span>
        </div>
      </h2>

      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
        <form onSubmit={handleChangePassword}>
          <Input label="Current Password" type="password" value={passwordForm.oldPassword} onChange={e => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })} required />
          <Input label="New Password" type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required />
          <Input label="Confirm New Password" type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} required />
          <Btn type="submit" loading={changingPassword} style={{ width: "100%", justifyContent: "center" }}>Update Password</Btn>
        </form>
      </div>

    </div>
  );
}

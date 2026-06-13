import React, { useState } from 'react';
import { Building2 } from "lucide-react";
import { api } from "../services/api";
import { Input } from "../components/ui/Input";
import { Btn } from "../components/ui/Btn";

export function OnboardingPage({ toast, setCompany }) {
  const [form, setForm] = useState({
    companyName: '',
    gstNumber: '',
    phone: '',
    address: ''
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!form.companyName.trim()) { toast("Company name is required", "error"); return; }
    setSaving(true);
    try {
      const updated = await api.updateProfile(form);
      setCompany(updated);
      toast("Welcome! Your profile is set up.", "success");
    } catch (e) { toast(e.message, "error"); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ background: 'var(--card)', padding: 32, borderRadius: 12, border: '1px solid var(--border)', width: '100%', maxWidth: 500 }}>
        
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, background: "var(--sidebar)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "var(--primary)" }}>
            <Building2 size={32} />
          </div>
          <h2 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 700, color: "var(--text)" }}>Company Setup</h2>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 14 }}>Let's set up your business profile before you start billing.</p>
        </div>

        <Input label="Company Name *" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} />
        <Input label="GST Number" value={form.gstNumber} onChange={e => setForm({ ...form, gstNumber: e.target.value })} />
        <Input label="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6 }}>Address</label>
          <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={4}
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 14, outline: "none", boxSizing: "border-box", resize: "vertical" }} />
        </div>
        
        <Btn loading={saving} onClick={save} style={{ width: "100%", justifyContent: "center", padding: 12 }}>Complete Setup</Btn>
      </div>
    </div>
  );
}

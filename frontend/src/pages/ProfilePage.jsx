import React, { useState } from 'react';
import { User } from "lucide-react";
import { api } from "../services/api";
import { Input } from "../components/ui/Input";
import { Btn } from "../components/ui/Btn";

export function ProfilePage({ toast, company, setCompany }) {
  const [form, setForm] = useState(company);
  const [saving, setSaving] = useState(false);

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

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <User size={20} />
          <span>Company Profile</span>
        </div>
      </h2>

      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
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
    </div>
  );
}

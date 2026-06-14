import React, { useState, useContext } from 'react';
import { Users, Pencil, Trash2, Phone, MapPin } from "lucide-react";
import { api } from "../services/api";
import { Input } from "../components/ui/Input";
import { Btn } from "../components/ui/Btn";
import { Modal } from "../components/ui/Modal";
import { PartiesSkeleton } from "../components/skeletons/PartiesSkeleton";

import { DataContext } from "../context/DataContext";

export function PartiesPage({ toast, isMobile }) {
  const { parties, loadingParties: loading, refreshParties } = useContext(DataContext);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ companyName: "", gstNumber: "", address: "", phone: "" });
  const [saving, setSaving] = useState(false);



  const openAdd = () => { setForm({ companyName: "", gstNumber: "", address: "", phone: "" }); setModal("add"); };
  const openEdit = (p) => { setForm({ companyName: p.companyName, gstNumber: p.gstNumber || "", address: p.address || "", phone: p.phone || "" }); setModal(p._id); };

  const save = async () => {
    if (!form.companyName.trim()) { toast("Company name is required", "error"); return; }
    setSaving(true);
    try {
      if (modal === "add") { await api.createParty(form); toast("Party added!", "success"); }
      else { await api.updateParty(modal, form); toast("Party updated!", "success"); }
      setModal(null); refreshParties();
    } catch (e) { toast(e.message, "error"); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm("Delete this party?")) return;
    try { await api.deleteParty(id); toast("Party deleted", "success"); refreshParties(); }
    catch (e) { toast(e.message, "error"); }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <Users size={20} />
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: "var(--text)" }}>Parties</h2>
        </div>
        <Btn onClick={openAdd}>+ Add Party</Btn>
      </div>
      <div style={{ marginBottom: 16 }}>
        <Input placeholder="Search parties..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 300 }} />
      </div>
      {loading ? <PartiesSkeleton isMobile={isMobile} /> :
        parties.length === 0 ? <div style={{ textAlign: "center", color: "var(--text-muted)", padding: 60 }}>No parties found. Add one!</div> :
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr": "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {parties.filter(p => p.companyName.toLowerCase().includes(search.toLowerCase()) || (p.phone && p.phone.includes(search))).map(p => (
            <div key={p._id} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#1d4ed8" }}>
                  {p.companyName.charAt(0).toUpperCase()}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn variant="ghost" onClick={() => openEdit(p)} style={{ padding: "6px 10px" }}><Pencil size={14} /></Btn>
                  <Btn variant="ghost" onClick={() => del(p._id)} style={{ padding: "6px 10px" }}><Trash2 size={14} /></Btn>
                </div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{p.companyName}</div>
              {p.gstNumber && <div style={{ fontSize: 12, color: "var(--text-muted)" }}>GST: {p.gstNumber}</div>}
              {p.phone && <div style={{ fontSize: 12, color: "var(--text-muted)" }}><Phone size={14} /> {p.phone}</div>}
              {p.address && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}><MapPin size={14} /> {p.address}</div>}
            </div>
          ))}
        </div>
      }
      {modal && (
        <Modal title={modal === "add" ? "Add Party" : "Edit Party"} onClose={() => setModal(null)}>
          <Input label="Company Name *" value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} placeholder="Enter company name" />
          <Input label="GST Number" value={form.gstNumber} onChange={e => setForm(f => ({ ...f, gstNumber: e.target.value }))} placeholder="e.g. 27AAGFM1234C1Z5" />
          <Input label="Phone Number" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" />
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6 }}>Address</label>
            <textarea value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
              placeholder="Enter full address" rows={3}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 14, outline: "none", boxSizing: "border-box", resize: "vertical" }} />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn loading={saving} onClick={save}>Save Party</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

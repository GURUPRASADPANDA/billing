import React, { useState, useContext } from 'react';
import { Box, Pencil, Trash2 } from "lucide-react";
import { api } from "../services/api";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Btn } from "../components/ui/Btn";
import { Modal } from "../components/ui/Modal";
import { ItemsSkeleton } from "../components/skeletons/ItemsSkeleton";
import { DataContext } from "../context/DataContext";

export function ItemsPage({ toast, isMobile }) {
  const { items, loadingItems: loading, refreshItems } = useContext(DataContext);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: "", defaultPrice: "", unit: "pcs" });
  const [saving, setSaving] = useState(false);



  const openAdd = () => { setForm({ name: "", defaultPrice: "", unit: "pcs" }); setModal("add"); };
  const openEdit = (item) => { setForm({ name: item.name, defaultPrice: item.defaultPrice || "", unit: item.unit || "pcs" }); setModal(item._id); };

  const save = async () => {
    if (!form.name.trim()) { toast("Item name is required", "error"); return; }
    setSaving(true);
    try {
      const data = { name: form.name.trim(), defaultPrice: parseFloat(form.defaultPrice) || 0, unit: form.unit };
      if (modal === "add") { await api.createItem(data); toast("Item added!", "success"); }
      else { await api.updateItem(modal, data); toast("Item updated!", "success"); }
      setModal(null); refreshItems();
    } catch (e) { toast(e.message, "error"); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm("Delete this item?")) return;
    try { await api.deleteItem(id); toast("Item deleted", "success"); refreshItems(); }
    catch (e) { toast(e.message, "error"); }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Box size={20} />
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: "var(--text)" }}>Items</h2>
        </div>
        <Btn onClick={openAdd}>+ Add Item</Btn>
      </div>
      <div style={{ marginBottom: 16 }}>
        <Input placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 300 }} />
      </div>
      {loading ? <ItemsSkeleton isMobile={isMobile} /> :
        items.length === 0 ? <div style={{ textAlign: "center", color: "var(--text-muted)", padding: 60 }}>No items found. Add one!</div> :
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            {!isMobile && (
              <thead>
                <tr style={{ background: "var(--sidebar)", color: "var(--text)" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left" }}>Item Name</th>
                  <th style={{ padding: "12px 16px", textAlign: "center" }}>Unit</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Price</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
            )}
            <tbody>
              {items.filter(item => item.name.toLowerCase().includes(search.toLowerCase())).map(item => (
                isMobile ? (
                  <tr key={item._id}>
                    <td colSpan="4" style={{ padding: 12, borderBottom: "1px solid var(--border)" }}>
                      <div style={{ fontWeight: 600, fontSize: 15, color: "var(--text)" }}>{item.name}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 13, color: "var(--text-muted)" }}>
                        <span>Unit: {item.unit}</span>
                        <span>Price: ₹{item.price || item.defaultPrice}</span>
                      </div>
                      <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                        <Btn variant="ghost" onClick={() => openEdit(item)}><Pencil size={14} /></Btn>
                        <Btn variant="ghost" onClick={() => del(item._id)}><Trash2 size={14} /></Btn>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr key={item._id} style={{ color: "var(--text)", borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "12px 16px" }}>{item.name}</td>
                    <td style={{ textAlign: "center" }}>{item.unit}</td>
                    <td style={{ textAlign: "right" }}>₹{item.price || item.defaultPrice}</td>
                    <td style={{ textAlign: "right" }}>
                      <Btn variant="ghost" onClick={() => openEdit(item)}><Pencil size={14} /></Btn>
                      <Btn variant="ghost" onClick={() => del(item._id)}><Trash2 size={14} /></Btn>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      }
      {modal && (
        <Modal title={modal === "add" ? "Add Item" : "Edit Item"} onClose={() => setModal(null)} width={400}>
          <Input label="Item Name *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Enter item name" />
          <Input label="Default Price (₹)" type="number" value={form.defaultPrice} onChange={e => setForm(f => ({ ...f, defaultPrice: e.target.value }))} placeholder="0.00" min="0" step="0.01" />
          <Select label="Unit" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}>
            <option value="pcs">Pieces (pcs)</option>
            <option value="kg">Kilogram (kg)</option>
            <option value="g">Gram (g)</option>
            <option value="ltr">Litre (ltr)</option>
            <option value="box">Box</option>
            <option value="pkt">Packet (pkt)</option>
            <option value="dozen">Dozen</option>
            <option value="meter">Meter</option>
          </Select>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => setModal(null)}>Cancel</Btn>
            <Btn loading={saving} onClick={save}>Save Item</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
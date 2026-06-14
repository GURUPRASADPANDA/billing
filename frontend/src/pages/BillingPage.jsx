import React, { useState, useEffect, useContext } from 'react';
import { api } from "../services/api";
import { Select } from "../components/ui/Select";
import { Input } from "../components/ui/Input";
import { Btn } from "../components/ui/Btn";
import { BillPreview } from "../components/pdf/BillPreview";
import { BillingSkeleton } from "../components/skeletons/BillingSkeleton";
import { DataContext } from "../context/DataContext";

export function BillingPage({ toast, company, isMobile }) {
  const { parties, items: allItems, loadingParties, loadingItems, refreshBills, refreshSummary } = useContext(DataContext);
  const [selectedParty, setSelectedParty] = useState("");
  const [billDate, setBillDate] = useState(new Date().toISOString().split("T")[0]);
  const [nextBillNum, setNextBillNum] = useState("...");
  const [gstPercent, setGstPercent] = useState(0);
  const [notes, setNotes] = useState("");
  const [rows, setRows] = useState([{ itemName: "", quantity: 1, price: 0, total: 0 }]);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getNextBillNumber().then(b => {
      setNextBillNum(b.nextNumber);
      setLoading(false);
    }).catch(() => {
      setNextBillNum("?");
      setLoading(false);
    });
  }, []);

  const updateRow = (i, field, val) => {
    setRows(rows => {
      const updated = [...rows];
      updated[i] = { ...updated[i], [field]: val };
      const q = parseFloat(updated[i].quantity) || 0;
      const p = parseFloat(updated[i].price) || 0;
      updated[i].total = q * p;
      if (field === "itemName") {
        const found = allItems.find(it => it.name === val);
        if (found && found.defaultPrice) {
          updated[i].price = found.defaultPrice;
          updated[i].total = q * found.defaultPrice;
        }
      }
      return updated;
    });
  };

  const addRow = () => setRows(r => [...r, { itemName: "", quantity: 1, price: 0, total: 0 }]);
  const removeRow = (i) => { if (rows.length === 1) return; setRows(r => r.filter((_, j) => j !== i)); };

  const subtotal = rows.reduce((s, r) => s + (r.total || 0), 0);
  const gstAmt = subtotal * (gstPercent / 100);
  const grandTotal = subtotal + gstAmt;

  const generate = async () => {
    if (!selectedParty) { toast("Please select a party", "error"); return; }
    const validRows = rows.filter(r => r.itemName && r.quantity > 0);
    if (validRows.length === 0) { toast("Add at least one valid item", "error"); return; }
    setSaving(true);
    try {
      const party = parties.find(p => p._id === selectedParty);
      const billData = {
        billDate,
        party: { id: party._id, companyName: party.companyName, gstNumber: party.gstNumber, address: party.address, phone: party.phone },
        items: validRows.map(r => ({ itemName: r.itemName, quantity: parseFloat(r.quantity), price: parseFloat(r.price), total: r.total })),
        subtotal, gstPercent: parseFloat(gstPercent), gstAmount: gstAmt, grandTotal, notes,
      };
      const saved = await api.createBill(billData);
      setPreview(saved);
      setRows([{ itemName: "", quantity: 1, price: 0, total: 0 }]);
      setSelectedParty(""); setNotes(""); setGstPercent(0);
      api.getNextBillNumber().then(r => setNextBillNum(r.nextNumber)).catch(() => {});
      refreshBills();
      refreshSummary();
      toast("Bill generated successfully!", "success");
    } catch (e) { toast(e.message, "error"); }
    finally { setSaving(false); }
  };

  if (loading || loadingParties || loadingItems) return <BillingSkeleton isMobile={isMobile} />;

  return (
    <div>
      <h2 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 600, color: "var(--text)" }}> Create New Bill</h2>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>BILL NUMBER</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#2563eb" }}>#{nextBillNum}</div>
        </div>
        <div>
          <Select label="Select Party *" value={selectedParty} onChange={e => setSelectedParty(e.target.value)}>
            <option value="">-- Choose Customer --</option>
            {parties.map(p => <option key={p._id} value={p._id}>{p.companyName}</option>)}
          </Select>
        </div>
        <div>
          <Input label="Bill Date *" type="date" value={billDate} onChange={e => setBillDate(e.target.value)} />
        </div>
      </div>

      <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, marginBottom: 20, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 600, color: "var(--text)" }}>Items</span>
          <Btn variant="secondary" onClick={addRow} style={{ padding: "7px 14px", fontSize: 13 }}>+ Add Item</Btn>
        </div>
        <div style={{ overflowX: "auto" }}>
          {isMobile ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "12px 16px" }}>
              {rows.map((row, i) => (
                <div key={i} style={{ padding: 12, border: "1px solid var(--border)", borderRadius: 8, background: "var(--sidebar)", position: "relative" }}>
                  <button onClick={() => removeRow(i)} style={{ position: "absolute", top: 8, right: 8, background: "none", border: "none", cursor: "pointer", color: "#dc2626", fontSize: 20, padding: 4, lineHeight: 1 }}>×</button>
                  <div style={{ display: "flex", gap: 10, marginBottom: 10, paddingRight: 24 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Item Name</label>
                      <select value={row.itemName} onChange={e => updateRow(i, "itemName", e.target.value)} style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 13 }}>
                        <option value="">-- Select Item --</option>
                        {allItems.map(it => <option key={it._id} value={it.name}>{it.name}</option>)}
                      </select>
                    </div>
                    <div style={{ width: 80 }}>
                      <label style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Qty</label>
                      <input type="number" value={row.quantity} min="0" step="0.01" onChange={e => updateRow(i, "quantity", e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 13, textAlign: "center", boxSizing: "border-box" }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Price (₹)</label>
                      <input type="number" value={row.price} min="0" step="0.01" onChange={e => updateRow(i, "price", e.target.value)} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 13, boxSizing: "border-box" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4, display: "block" }}>Total (₹)</label>
                      <div style={{ padding: "8px 12px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 13, fontWeight: 600, color: "var(--text)", boxSizing: "border-box", display: "flex", alignItems: "center" }}>
                        {row.total.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--sidebar)" }}>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>Item Name</th>
                  <th style={{ padding: "10px 12px", textAlign: "center", fontSize: 12, color: "var(--text-muted)", fontWeight: 600, width: 100 }}>Qty</th>
                  <th style={{ padding: "10px 12px", textAlign: "right", fontSize: 12, color: "var(--text-muted)", fontWeight: 600, width: 130 }}>Price (₹)</th>
                  <th style={{ padding: "10px 12px", textAlign: "right", fontSize: 12, color: "var(--text-muted)", fontWeight: 600, width: 130 }}>Total (₹)</th>
                  <th style={{ width: 48 }}></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                    <td style={{ padding: "8px 16px" }}>
                      <select value={row.itemName} onChange={e => updateRow(i, "itemName", e.target.value)} style={{
                        width: "100%", minWidth: "150px", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 13,
                      }}>
                        <option value="">-- Select Item --</option>
                        {allItems.map(it => <option key={it._id} value={it.name}>{it.name}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: "8px 12px" }}>
                      <input type="number" value={row.quantity} min="0" step="0.01" onChange={e => updateRow(i, "quantity", e.target.value)} style={{ width: "100%", padding: "8px 8px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 13, textAlign: "center" }} />
                    </td>
                    <td style={{ padding: "8px 12px" }}>
                      <input type="number" value={row.price} min="0" step="0.01" onChange={e => updateRow(i, "price", e.target.value)} style={{ width: "100%", padding: "8px 8px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 13, textAlign: "right" }} />
                    </td>
                    <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, color: "var(--text)", fontSize: 14 }}>
                      {row.total.toFixed(2)}
                    </td>
                    <td style={{ padding: "8px 8px", textAlign: "center" }}>
                      <button onClick={() => removeRow(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", fontSize: 16, padding: 4 }}>×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 320px", gap: 20, alignItems: "start" }}>
        <div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6 }}>Notes (optional)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Add any notes for this bill..."
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 14, resize: "vertical", boxSizing: "border-box" }} />
          </div>
        </div>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--text-muted)", marginBottom: 8 }}>
            <span>Subtotal</span><span style={{ color: "var(--text)", fontWeight: 500 }}>₹{subtotal.toFixed(2)}</span>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 13, color: "var(--text-muted)", marginBottom: 6 }}>GST %</label>
            <select value={gstPercent} onChange={e => setGstPercent(e.target.value)} style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 13 }}>
              <option value={0}>No GST (0%)</option>
              <option value={5}>5%</option>
              <option value={12}>12%</option>
              <option value={18}>18%</option>
              <option value={28}>28%</option>
            </select>
          </div>
          {gstPercent > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--text-muted)", marginBottom: 8 }}>
              <span>GST ({gstPercent}%)</span><span style={{ color: "var(--text)" }}>₹{gstAmt.toFixed(2)}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 700, color: "#2563eb", borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 4 }}>
            <span>Grand Total</span><span>₹{grandTotal.toFixed(2)}</span>
          </div>
          <Btn onClick={generate} loading={saving} style={{ width: "100%", marginTop: 16, justifyContent: "center", padding: "13px" }}>
             Generate Bill
          </Btn>
        </div>
      </div>
      {preview && <BillPreview bill={preview} onClose={() => setPreview(null)} company={company} />}
    </div>
  );
}

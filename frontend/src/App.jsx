import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";

const API_BASE = `${process.env.REACT_APP_API_URL}/api`;

async function apiFetch(path, options = {}) {
  const res = await fetch(API_BASE + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

const api = {
  getParties: (search = "") => apiFetch(`/parties${search ? `?search=${search}` : ""}`),
  createParty: (data) => apiFetch("/parties", { method: "POST", body: JSON.stringify(data) }),
  updateParty: (id, data) => apiFetch(`/parties/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteParty: (id) => apiFetch(`/parties/${id}`, { method: "DELETE" }),
  getItems: (search = "") => apiFetch(`/items${search ? `?search=${search}` : ""}`),
  createItem: (data) => apiFetch("/items", { method: "POST", body: JSON.stringify(data) }),
  updateItem: (id, data) => apiFetch(`/items/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteItem: (id) => apiFetch(`/items/${id}`, { method: "DELETE" }),
  getBills: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return apiFetch(`/bills${q ? `?${q}` : ""}`);
  },
  //timetabletable259@gmail.com 
  getNextBillNumber: () => apiFetch("/bills/next-number"),
  createBill: (data) => apiFetch("/bills", { method: "POST", body: JSON.stringify(data) }),
  getBill: (id) => apiFetch(`/bills/${id}`),
  getProfile: () => apiFetch("/profile"),
  updateProfile: (data) => apiFetch("/profile", { method: "PUT", body: JSON.stringify(data) }),
};

function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return size;
}

const ThemeContext = createContext();
const useTheme = () => useContext(ThemeContext);

// COMPANY is now fetched from the backend

function formatDate(d) {
  if (!d) return "";
  const date = new Date(d);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatCurrency(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n || 0);
}

function Toast({ toasts, remove }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map((t) => (
        <div key={t.id} onClick={() => remove(t.id)} style={{
          padding: "12px 20px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 500,
          background: t.type === "error" ? "#fee2e2" : t.type === "success" ? "#dcfce7" : "#dbeafe",
          color: t.type === "error" ? "#991b1b" : t.type === "success" ? "#166534" : "#1e40af",
          border: `1px solid ${t.type === "error" ? "#fca5a5" : t.type === "success" ? "#86efac" : "#93c5fd"}`,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)", minWidth: 220, maxWidth: 320,
        }}>
          {t.type === "success" ? "✓ " : t.type === "error" ? "✕ " : "ℹ "}{t.message}
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);
  const remove = useCallback((id) => setToasts(p => p.filter(t => t.id !== id)), []);
  return { toasts, toast: add, removeToast: remove };
}

function Modal({ title, children, onClose, width = 480 }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "var(--bg)", borderRadius: 16, width: "100%", maxWidth: width,
        maxHeight: "90vh", overflowY: "auto", border: "1px solid var(--border)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: "var(--text)" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "var(--text-muted)", lineHeight: 1 }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

function Input({ label, error, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6 }}>{label}</label>}
      <input {...props} style={{
        width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${error ? "#fca5a5" : "var(--border)"}`,
        background: "var(--bg)", color: "var(--text)", fontSize: 14, outline: "none", boxSizing: "border-box",
        transition: "border-color 0.15s",
        ...props.style,
      }} />
      {error && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#dc2626" }}>{error}</p>}
    </div>
  );
}

function Select({ label, children, error, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-muted)", marginBottom: 6 }}>{label}</label>}
      <select {...props} style={{
        width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${error ? "#fca5a5" : "var(--border)"}`,
        background: "var(--bg)", color: "var(--text)", fontSize: 14, outline: "none", boxSizing: "border-box",
        ...props.style,
      }}>
        {children}
      </select>
      {error && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#dc2626" }}>{error}</p>}
    </div>
  );
}

function Btn({ children, variant = "primary", loading, ...props }) {
  const styles = {
    primary: { background: "#2563eb", color: "#fff", border: "1px solid #2563eb" },
    secondary: { background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)" },
    danger: { background: "#dc2626", color: "#fff", border: "1px solid #dc2626" },
    ghost: { background: "transparent", color: "var(--text-muted)", border: "1px solid transparent" },
    success: { background: "#16a34a", color: "#fff", border: "1px solid #16a34a" },
  };
  return (
    <button {...props} disabled={loading || props.disabled} style={{
      padding: "10px 18px", borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer",
      display: "inline-flex", alignItems: "center", gap: 6, transition: "opacity 0.15s, transform 0.1s",
      opacity: (loading || props.disabled) ? 0.6 : 1, ...styles[variant],
      ...props.style,
    }}>
      {loading ? "⏳" : ""}{children}
    </button>
  );
}

function Sidebar({ page, setPage, dark, setDark, company }) {
  const navItems = [
    { id: "billing", label: "Create Bill", icon: "📋" },
    { id: "history", label: "Bill History", icon: "📚" },
    { id: "parties", label: "Parties", icon: "🏢" },
    { id: "items", label: "Items", icon: "📦" },
    { id: "profile", label: "Profile", icon: "⚙️" },
  ];
  return (
    <aside style={{
      width: 220, minHeight: "100vh", background: "var(--sidebar)", borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column", flexShrink: 0,
    }}>
      <div style={{ padding: "24px 20px 16px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
          <span style={{ color: "#fff", fontSize: 18 }}>₹</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", lineHeight: 1.3 }}>{company?.companyName || "Mohavhir"}</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>Enterprises</div>
      </div>
      <nav style={{ flex: 1, padding: "12px 12px" }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => setPage(item.id)} style={{
            width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 10, marginBottom: 4, textAlign: "left",
            background: page === item.id ? "#2563eb" : "transparent",
            color: page === item.id ? "#fff" : "var(--text-muted)",
            fontSize: 14, fontWeight: page === item.id ? 500 : 400,
            transition: "background 0.15s",
          }}>
            <span style={{ fontSize: 16 }}>{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
        <button onClick={() => setDark(!dark)} style={{
          width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)",
          background: "var(--bg)", color: "var(--text-muted)", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 8,
        }}>
          {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
    </aside>
  );
}

function BottomNav({ page, setPage }) {
  const navItems = [
    { id: "billing", label: "Bill", icon: "📋" },
    { id: "history", label: "History", icon: "📚" },
    { id: "parties", label: "Parties", icon: "🏢" },
    { id: "items", label: "Items", icon: "📦" },
    { id: "profile", label: "Profile", icon: "⚙️" },
  ];

  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0, background: "var(--sidebar)", borderTop: "1px solid var(--border)",
      display: "flex", justifyContent: "space-around", padding: "8px 12px 16px", zIndex: 100, boxShadow: "0 -4px 20px rgba(0,0,0,0.1)"
    }}>
      {navItems.map(item => (
        <button key={item.id} onClick={() => setPage(item.id)} style={{
          background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer",
          color: page === item.id ? "#2563eb" : "var(--text-muted)", transition: "color 0.15s, transform 0.1s", padding: 8,
          transform: page === item.id ? "scale(1.1)" : "scale(1)",
        }}>
          <span style={{ fontSize: 20 }}>{item.icon}</span>
          <span style={{ fontSize: 10, fontWeight: page === item.id ? 700 : 500 }}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

function ProfilePage({ toast, company, setCompany }) {
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
      <h2 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>⚙️ Company Profile</h2>
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

function PartiesPage({ toast }) {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ companyName: "", gstNumber: "", address: "", phone: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setParties(await api.getParties(search)); }
    catch (e) { toast(e.message, "error"); }
    finally { setLoading(false); }
  }, [search, toast]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm({ companyName: "", gstNumber: "", address: "", phone: "" }); setModal("add"); };
  const openEdit = (p) => { setForm({ companyName: p.companyName, gstNumber: p.gstNumber || "", address: p.address || "", phone: p.phone || "" }); setModal(p._id); };

  const save = async () => {
    if (!form.companyName.trim()) { toast("Company name is required", "error"); return; }
    setSaving(true);
    try {
      if (modal === "add") { await api.createParty(form); toast("Party added!", "success"); }
      else { await api.updateParty(modal, form); toast("Party updated!", "success"); }
      setModal(null); load();
    } catch (e) { toast(e.message, "error"); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm("Delete this party?")) return;
    try { await api.deleteParty(id); toast("Party deleted", "success"); load(); }
    catch (e) { toast(e.message, "error"); }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: "var(--text)" }}>🏢 Parties</h2>
        <Btn onClick={openAdd}>+ Add Party</Btn>
      </div>
      <div style={{ marginBottom: 16 }}>
        <Input placeholder="Search parties..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 300 }} />
      </div>
      {loading ? <div style={{ textAlign: "center", color: "var(--text-muted)", padding: 40 }}>Loading...</div> :
        parties.length === 0 ? <div style={{ textAlign: "center", color: "var(--text-muted)", padding: 60 }}>No parties found. Add one!</div> :
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {parties.map(p => (
            <div key={p._id} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#1d4ed8" }}>
                  {p.companyName.charAt(0).toUpperCase()}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Btn variant="ghost" onClick={() => openEdit(p)} style={{ padding: "6px 10px" }}>✏️</Btn>
                  <Btn variant="ghost" onClick={() => del(p._id)} style={{ padding: "6px 10px" }}>🗑️</Btn>
                </div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{p.companyName}</div>
              {p.gstNumber && <div style={{ fontSize: 12, color: "var(--text-muted)" }}>GST: {p.gstNumber}</div>}
              {p.phone && <div style={{ fontSize: 12, color: "var(--text-muted)" }}>📞 {p.phone}</div>}
              {p.address && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>📍 {p.address}</div>}
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

function ItemsPage({ toast }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name: "", defaultPrice: "", unit: "pcs" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await api.getItems(search)); }
    catch (e) { toast(e.message, "error"); }
    finally { setLoading(false); }
  }, [search, toast]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm({ name: "", defaultPrice: "", unit: "pcs" }); setModal("add"); };
  const openEdit = (item) => { setForm({ name: item.name, defaultPrice: item.defaultPrice || "", unit: item.unit || "pcs" }); setModal(item._id); };

  const save = async () => {
    if (!form.name.trim()) { toast("Item name is required", "error"); return; }
    setSaving(true);
    try {
      const data = { name: form.name.trim(), defaultPrice: parseFloat(form.defaultPrice) || 0, unit: form.unit };
      if (modal === "add") { await api.createItem(data); toast("Item added!", "success"); }
      else { await api.updateItem(modal, data); toast("Item updated!", "success"); }
      setModal(null); load();
    } catch (e) { toast(e.message, "error"); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!confirm("Delete this item?")) return;
    try { await api.deleteItem(id); toast("Item deleted", "success"); load(); }
    catch (e) { toast(e.message, "error"); }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: "var(--text)" }}>📦 Items</h2>
        <Btn onClick={openAdd}>+ Add Item</Btn>
      </div>
      <div style={{ marginBottom: 16 }}>
        <Input placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 300 }} />
      </div>
      {loading ? <div style={{ textAlign: "center", color: "var(--text-muted)", padding: 40 }}>Loading...</div> :
        items.length === 0 ? <div style={{ textAlign: "center", color: "var(--text-muted)", padding: 60 }}>No items found. Add one!</div> :
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr style={{ background: "var(--sidebar)" }}>
                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Item Name</th>
                <th style={{ padding: "12px 16px", textAlign: "right", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Default Price</th>
                <th style={{ padding: "12px 16px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Unit</th>
                <th style={{ padding: "12px 16px", textAlign: "right", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item._id} style={{ borderTop: i > 0 ? "1px solid var(--border)" : "none" }}>
                  <td style={{ padding: "13px 16px", color: "var(--text)", fontWeight: 500 }}>{item.name}</td>
                  <td style={{ padding: "13px 16px", color: "var(--text)", textAlign: "right" }}>{item.defaultPrice ? formatCurrency(item.defaultPrice) : "—"}</td>
                  <td style={{ padding: "13px 16px", color: "var(--text-muted)", textAlign: "center", fontSize: 13 }}>{item.unit}</td>
                  <td style={{ padding: "13px 16px", textAlign: "right" }}>
                    <Btn variant="ghost" onClick={() => openEdit(item)} style={{ padding: "6px 10px", marginRight: 4 }}>✏️</Btn>
                    <Btn variant="ghost" onClick={() => del(item._id)} style={{ padding: "6px 10px" }}>🗑️</Btn>
                  </td>
                </tr>
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

function BillPreview({ bill, onClose, onPrint, company }) {
  const printRef = useRef();
  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html><html><head>
      <title>Bill #${bill.billNumber} - ${company?.companyName || "Company"}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; background: #fff; }
        .bill-wrap { max-width: 794px; margin: 0 auto; padding: 40px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 24px; }
        .company-name { font-size: 26px; font-weight: 700; color: #1d3170; }
        .company-detail { font-size: 12px; color: #555; margin-top: 4px; }
        .bill-title { font-size: 28px; font-weight: 700; color: #2563eb; }
        .bill-meta { font-size: 13px; color: #333; text-align: right; margin-top: 6px; }
        .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
        .party-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; }
        .party-label { font-size: 11px; font-weight: 700; color: #2563eb; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
        .party-name { font-size: 15px; font-weight: 600; color: #1a1a1a; margin-bottom: 4px; }
        .party-detail { font-size: 12px; color: #555; line-height: 1.5; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        th { background: #1d3170; color: #fff; padding: 10px 12px; text-align: left; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        th:last-child, td:last-child { text-align: right; }
        th:nth-child(2), th:nth-child(3), td:nth-child(2), td:nth-child(3) { text-align: center; }
        td { padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #e2e8f0; }
        tr:nth-child(even) td { background: #f8fafc; }
        .totals { display: flex; justify-content: flex-end; margin-bottom: 32px; }
        .totals-box { width: 260px; }
        .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; color: #333; }
        .total-row.grand { border-top: 2px solid #2563eb; margin-top: 8px; padding-top: 10px; font-weight: 700; font-size: 16px; color: #1d3170; }
        .footer { text-align: center; font-size: 12px; color: #999; border-top: 1px solid #e2e8f0; padding-top: 16px; }
        @media print { @page { size: A4; margin: 0; } body { padding: 20px; } }
      </style></head><body>
      <div class="bill-wrap">${content}</div>
      </body></html>
    `);
    win.document.close();
    setTimeout(() => { win.print(); }, 500);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 2000, display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 16px", overflowY: "auto" }}>
      <div style={{ background: "var(--bg)", borderRadius: 16, width: "100%", maxWidth: 860, boxShadow: "0 24px 80px rgba(0,0,0,0.3)" }}>
        <div style={{ padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "var(--text)" }}>Bill Preview — #{bill.billNumber}</h3>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="success" onClick={handlePrint}>🖨️ Print / Download PDF</Btn>
            <Btn variant="secondary" onClick={onClose}>Close</Btn>
          </div>
        </div>
        <div style={{ padding: 24, background: "#f1f5f9", minHeight: 400 }}>
          <div ref={printRef} style={{ background: "#fff", borderRadius: 8, padding: 40, maxWidth: 794, margin: "0 auto", boxShadow: "0 2px 20px rgba(0,0,0,0.08)" }}>
            <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #2563eb", paddingBottom: 20, marginBottom: 24 }}>
              <div>
                <div className="company-name" style={{ fontSize: 24, fontWeight: 700, color: "#1d3170" }}>{company?.companyName}</div>
                <div className="company-detail" style={{ fontSize: 12, color: "#555", marginTop: 4 }}>GST: {company?.gstNumber}</div>
                <div className="company-detail" style={{ fontSize: 12, color: "#555" }}>📍 {company?.address}</div>
                <div className="company-detail" style={{ fontSize: 12, color: "#555" }}>📞 {company?.phone}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="bill-title" style={{ fontSize: 26, fontWeight: 700, color: "#2563eb" }}>TAX INVOICE</div>
                <div className="bill-meta" style={{ fontSize: 13, color: "#333", marginTop: 6 }}>
                  <div><b>Bill No:</b> #{String(bill.billNumber).padStart(4, "0")}</div>
                  <div><b>Date:</b> {formatDate(bill.billDate)}</div>
                </div>
              </div>
            </div>
            <div className="parties" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>From</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>{company?.companyName}</div>
                <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>
                  <div>GST: {company?.gstNumber}</div>
                  <div>{company?.address}</div>
                  <div>{company?.phone}</div>
                </div>
              </div>
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Bill To</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>{bill.party.companyName}</div>
                <div style={{ fontSize: 12, color: "#555", lineHeight: 1.6 }}>
                  {bill.party.gstNumber && <div>GST: {bill.party.gstNumber}</div>}
                  {bill.party.address && <div>{bill.party.address}</div>}
                  {bill.party.phone && <div>{bill.party.phone}</div>}
                </div>
              </div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
              <thead>
                <tr>
                  <th style={{ background: "#1d3170", color: "#fff", padding: "10px 12px", textAlign: "left", fontSize: 12, fontWeight: 600 }}>#</th>
                  <th style={{ background: "#1d3170", color: "#fff", padding: "10px 12px", textAlign: "left", fontSize: 12, fontWeight: 600 }}>Item Name</th>
                  <th style={{ background: "#1d3170", color: "#fff", padding: "10px 12px", textAlign: "center", fontSize: 12, fontWeight: 600 }}>Qty</th>
                  <th style={{ background: "#1d3170", color: "#fff", padding: "10px 12px", textAlign: "right", fontSize: 12, fontWeight: 600 }}>Rate (₹)</th>
                  <th style={{ background: "#1d3170", color: "#fff", padding: "10px 12px", textAlign: "right", fontSize: 12, fontWeight: 600 }}>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {bill.items.map((item, i) => (
                  <tr key={i} style={{ background: i % 2 === 1 ? "#f8fafc" : "#fff" }}>
                    <td style={{ padding: "10px 12px", fontSize: 13, borderBottom: "1px solid #e2e8f0", color: "#666" }}>{i + 1}</td>
                    <td style={{ padding: "10px 12px", fontSize: 13, borderBottom: "1px solid #e2e8f0", fontWeight: 500 }}>{item.itemName}</td>
                    <td style={{ padding: "10px 12px", fontSize: 13, borderBottom: "1px solid #e2e8f0", textAlign: "center" }}>{item.quantity}</td>
                    <td style={{ padding: "10px 12px", fontSize: 13, borderBottom: "1px solid #e2e8f0", textAlign: "right" }}>{item.price.toFixed(2)}</td>
                    <td style={{ padding: "10px 12px", fontSize: 13, borderBottom: "1px solid #e2e8f0", textAlign: "right", fontWeight: 500 }}>{item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 32 }}>
              <div style={{ width: 280 }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13, color: "#333" }}>
                  <span>Subtotal</span><span>₹{bill.subtotal.toFixed(2)}</span>
                </div>
                {bill.gstPercent > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13, color: "#333" }}>
                    <span>GST ({bill.gstPercent}%)</span><span>₹{bill.gstAmount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontSize: 17, fontWeight: 700, color: "#1d3170", borderTop: "2px solid #2563eb", marginTop: 6 }}>
                  <span>Grand Total</span><span>₹{bill.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
            





            <div style={{ borderTop: "1px solid #000", paddingTop: 10, fontSize: 12 }}>

  {/* Top Section */}
  <div style={{ display: "flex", justifyContent: "space-between" }}>
    
    {/* Bank Box (Left) */}
    <div
      style={{
        border: "2px solid #000",
        padding: 10,
        width: "40%",
        textAlign: "center",
        fontWeight: "500",
        boxShadow: "3px 3px 0px #000",
      }}
    >
      <div>UCO BANK</div>
      <div>NUAPADA BRANCH</div>
      <div>A/C - 13190210002636</div>
      <div>IFSC - UCBA0001319</div>
    </div>

    {/* Right empty space (like bill layout) */}
    <div style={{ width: "55%" }}></div>
  </div>

  {/* Bottom Section */}
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginTop: 15,
    }}
  >
    
    {/* Terms & Conditions (Left) */}
    <div style={{ width: "60%" }}>
      <strong>Terms & Conditions:</strong>
      <p style={{ margin: "5px 0" }}>
        1) Goods once sold will not be taken back or exchanged.
        <br />
        2) Subject to Cuttack jurisdiction.
      </p>
    </div>

    {/* Signature Section (Right) */}
    <div style={{ width: "35%", textAlign: "center" }}>
      <div style={{ fontWeight: "bold" }}>
        For MAHAVIR ENTERPRISES
      </div>

      <div style={{ marginTop: 40 }}>
        Auth. Signatory
      </div>
    </div>
  </div>
</div>

            





            
          </div>
        </div>
      </div>
    </div>
  );
}

function BillingPage({ toast, company, isMobile }) {
  const [parties, setParties] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [selectedParty, setSelectedParty] = useState("");
  const [billDate, setBillDate] = useState(new Date().toISOString().split("T")[0]);
  const [nextBillNum, setNextBillNum] = useState("...");
  const [gstPercent, setGstPercent] = useState(0);
  const [notes, setNotes] = useState("");
  const [rows, setRows] = useState([{ itemName: "", quantity: 1, price: 0, total: 0 }]);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getParties().then(setParties).catch(() => {});
    api.getItems().then(setAllItems).catch(() => {});
    api.getNextBillNumber().then(r => setNextBillNum(r.nextNumber)).catch(() => setNextBillNum("?"));
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
      toast("Bill generated successfully!", "success");
    } catch (e) { toast(e.message, "error"); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <h2 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>📋 Create New Bill</h2>
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
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
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
                      width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 13,
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
            ✅ Generate Bill
          </Btn>
        </div>
      </div>
      {preview && <BillPreview bill={preview} onClose={() => setPreview(null)} company={company} />}
    </div>
  );
}

function HistoryPage({ toast, company, isMobile }) {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [preview, setPreview] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      setBills(await api.getBills(params));
    } catch (e) { toast(e.message, "error"); }
    finally { setLoading(false); }
  }, [startDate, endDate, toast]);

  useEffect(() => { load(); }, [load]);

  const del = async (id) => {
    if (!confirm("Delete this bill?")) return;
    try { await apiFetch(`/bills/${id}`, { method: "DELETE" }); toast("Bill deleted", "success"); load(); }
    catch (e) { toast(e.message, "error"); }
  };

  return (
    <div>
      <h2 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 600, color: "var(--text)" }}>📚 Bill History</h2>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>From Date</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 13 }} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>To Date</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 13 }} />
        </div>
        <Btn variant="secondary" onClick={() => { setStartDate(""); setEndDate(""); }}>Clear</Btn>
      </div>
      {loading ? <div style={{ textAlign: "center", color: "var(--text-muted)", padding: 40 }}>Loading...</div> :
        bills.length === 0 ? <div style={{ textAlign: "center", color: "var(--text-muted)", padding: 60 }}>No bills found.</div> :
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr style={{ background: "var(--sidebar)" }}>
                {["Bill #", "Date", "Party", "Items", "Grand Total", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: h === "Grand Total" ? "right" : "left", fontSize: 12, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bills.map((bill, i) => (
                <tr key={bill._id} style={{ borderTop: i > 0 ? "1px solid var(--border)" : "none" }}>
                  <td style={{ padding: "13px 16px", fontWeight: 700, color: "#2563eb", fontSize: 14 }}>#{String(bill.billNumber).padStart(4, "0")}</td>
                  <td style={{ padding: "13px 16px", color: "var(--text)", fontSize: 13 }}>{formatDate(bill.billDate)}</td>
                  <td style={{ padding: "13px 16px", color: "var(--text)", fontWeight: 500 }}>{bill.party?.companyName}</td>
                  <td style={{ padding: "13px 16px", color: "var(--text-muted)", fontSize: 13 }}>{bill.items?.length} item{bill.items?.length !== 1 ? "s" : ""}</td>
                  <td style={{ padding: "13px 16px", textAlign: "right", fontWeight: 700, color: "var(--text)", fontSize: 15 }}>{formatCurrency(bill.grandTotal)}</td>
                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn variant="secondary" onClick={() => setPreview(bill)} style={{ padding: "6px 12px", fontSize: 12 }}>👁 View</Btn>
                      <Btn variant="ghost" onClick={() => del(bill._id)} style={{ padding: "6px 10px" }}>🗑️</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
      {preview && <BillPreview bill={preview} onClose={() => setPreview(null)} company={company} />}
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(false);
  const [page, setPage] = useState("billing");
  const { toasts, toast, removeToast } = useToast();
  const [company, setCompany] = useState(null);
  const { width } = useWindowSize();
  const isMobile = width < 768;

  useEffect(() => {
    api.getProfile().then(setCompany).catch(() => {});
  }, []);

  const theme = {
    "--bg": dark ? "#0f172a" : "#ffffff",
    "--sidebar": dark ? "#1e293b" : "#f8fafc",
    "--card": dark ? "#1e293b" : "#ffffff",
    "--text": dark ? "#f1f5f9" : "#0f172a",
    "--text-muted": dark ? "#94a3b8" : "#64748b",
    "--border": dark ? "#334155" : "#e2e8f0",
  };

  if (!company) return <div style={{...theme, background: "var(--bg)", color: "var(--text)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center"}}>Loading app...</div>;

  return (
    <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", minHeight: "100vh", background: dark ? "#0f172a" : "#f1f5f9", ...theme }}>
      {!isMobile && <Sidebar page={page} setPage={setPage} dark={dark} setDark={setDark} company={company} />}
      
      {isMobile && (
        <header style={{ background: "var(--sidebar)", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", position: "sticky", top: 0, zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700 }}>₹</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{company.companyName}</div>
          </div>
          <button onClick={() => setDark(!dark)} style={{ background: "none", border: "none", fontSize: 20 }}>{dark ? "☀️" : "🌙"}</button>
        </header>
      )}

      <main style={{ flex: 1, padding: isMobile ? "20px 16px 80px" : "32px 36px", overflowY: "auto", minWidth: 0 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {page === "billing" && <BillingPage toast={toast} company={company} isMobile={isMobile} />}
          {page === "history" && <HistoryPage toast={toast} company={company} isMobile={isMobile} />}
          {page === "parties" && <PartiesPage toast={toast} isMobile={isMobile} />}
          {page === "items" && <ItemsPage toast={toast} isMobile={isMobile} />}
          {page === "profile" && <ProfilePage toast={toast} company={company} setCompany={setCompany} />}
        </div>
      </main>

      {isMobile && <BottomNav page={page} setPage={setPage} />}
      <Toast toasts={toasts} remove={removeToast} />
    </div>
  );
}

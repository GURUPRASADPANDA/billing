const API_BASE = process.env.NODE_ENV === "production" 
  ? "https://billing-0b7n.onrender.com/api" 
  : "http://localhost:5000/api";

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

export const api = {
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
  getNextBillNumber: () => apiFetch("/bills/next-number"),
  createBill: (data) => apiFetch("/bills", { method: "POST", body: JSON.stringify(data) }),
  getBill: (id) => apiFetch(`/bills/${id}`),
  getBillSummary: () => apiFetch("/bills/summary"),
  
  getProfile: () => apiFetch("/profile"),
  updateProfile: (data) => apiFetch("/profile", { method: "PUT", body: JSON.stringify(data) }),
  
  getTrash: (type) => apiFetch(`/trash/${type}`),
  restoreTrash: (type, id) => apiFetch(`/trash/restore/${type}/${id}`, { method: "POST" }),
  permanentDelete: (type, id) => apiFetch(`/trash/permanent/${type}/${id}`, { method: "DELETE" }),
};

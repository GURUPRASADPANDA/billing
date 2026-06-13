const API_BASE = process.env.NODE_ENV === "production" 
  ? "https://billing-0b7n.onrender.com/api" 
  : "http://localhost:5000/api";

let currentToken = null;

async function apiFetch(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (currentToken && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${currentToken}`;
  }

  const res = await fetch(API_BASE + path, {
    ...options,
    headers,
  });

  if (!res.ok) {
    if (res.status === 401) {
      // Optional: trigger global logout event if needed
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("unauthorized"));
      }
    }
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

export const api = {
  setToken: (token) => { currentToken = token; },

  login: (data) => apiFetch("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  register: (data) => apiFetch("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  getMe: () => apiFetch("/auth/me"),
  changePassword: (data) => apiFetch("/auth/password", { method: "PUT", body: JSON.stringify(data) }),

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
  deleteBill: (id) => apiFetch(`/bills/${id}`, { method: "DELETE" }),
  getBillSummary: () => apiFetch("/bills/summary"),
  
  getProfile: () => apiFetch("/profile"),
  updateProfile: (data) => apiFetch("/profile", { method: "PUT", body: JSON.stringify(data) }),
  
  getTrash: (type) => apiFetch(`/trash/${type}`),
  restoreTrash: (type, id) => apiFetch(`/trash/restore/${type}/${id}`, { method: "POST" }),
  permanentDelete: (type, id) => apiFetch(`/trash/permanent/${type}/${id}`, { method: "DELETE" }),
  
  // Admin
  adminLogin: (data) => apiFetch("/admin/login", { method: "POST", body: JSON.stringify(data) }),
  adminGetUsers: (adminToken) => apiFetch("/admin/users", { headers: { "Authorization": `Bearer ${adminToken}` } }),
  adminCreateUser: (data, adminToken) => apiFetch("/admin/users", { method: "POST", body: JSON.stringify(data), headers: { "Authorization": `Bearer ${adminToken}` } }),
  adminDeleteUser: (id, adminToken) => apiFetch(`/admin/users/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${adminToken}` } }),
  adminGetUserData: (id, adminToken) => apiFetch(`/admin/users/${id}/data`, { headers: { "Authorization": `Bearer ${adminToken}` } })
};

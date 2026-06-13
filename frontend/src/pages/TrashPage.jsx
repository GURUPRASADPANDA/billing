import React, { useState, useEffect, useCallback } from 'react';
import { Archive, Trash2 } from "lucide-react";
import { api } from "../services/api";
import { Btn } from "../components/ui/Btn";
import { TableSkeleton } from "../components/skeletons/TableSkeleton";

export function TrashPage({ toast }) {
  const [activeTab, setActiveTab] = useState("bills");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getTrash(activeTab);
      setItems(data);
    } catch (e) { toast(e.message, "error"); }
    finally { setLoading(false); }
  }, [activeTab, toast]);

  useEffect(() => { load(); }, [load]);

  const restore = async (id) => {
    try {
      await api.restoreTrash(activeTab, id);
      toast("Restored successfully", "success");
      load();
    } catch (e) { toast(e.message, "error"); }
  };

  const permaDelete = async (id) => {
    if (!confirm("Permanently delete? This cannot be undone.")) return;
    try {
      await api.permanentDelete(activeTab, id);
      toast("Permanently deleted", "success");
      load();
    } catch (e) { toast(e.message, "error"); }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
        <Archive size={20} />
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: "var(--text)" }}>Trash / Backup</h2>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["bills", "parties", "items"].map(tab => (
          <Btn key={tab} variant={activeTab === tab ? "primary" : "secondary"} onClick={() => setActiveTab(tab)} style={{ textTransform: "capitalize" }}>
            {tab}
          </Btn>
        ))}
      </div>
      
      {loading ? <TableSkeleton hideTitle={true} /> :
       items.length === 0 ? <div style={{ textAlign: "center", color: "var(--text-muted)", padding: 60 }}>Trash is empty.</div> :
       <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, overflowX: "auto" }}>
         <table style={{ width: "100%", borderCollapse: "collapse" }}>
           <thead>
             <tr style={{ background: "var(--sidebar)", color: "var(--text)" }}>
               <th style={{ padding: "12px 16px", textAlign: "left" }}>Name / Info</th>
               <th style={{ padding: "12px 16px", textAlign: "left" }}>Deleted At</th>
               <th style={{ padding: "12px 16px", textAlign: "right" }}>Actions</th>
             </tr>
           </thead>
           <tbody>
             {items.map(item => (
               <tr key={item._id} style={{ borderBottom: "1px solid var(--border)", color: "var(--text)" }}>
                 <td style={{ padding: "12px 16px" }}>
                   {activeTab === "bills" ? `#${String(item.billNumber).padStart(4, "0")} - ${item.party?.companyName}` :
                    activeTab === "parties" ? item.companyName :
                    item.name}
                 </td>
                 <td style={{ padding: "12px 16px" }}>{new Date(item.deletedAt).toLocaleDateString()}</td>
                 <td style={{ padding: "12px 16px", textAlign: "right" }}>
                   <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                     <Btn variant="ghost" onClick={() => restore(item._id)} style={{ padding: "6px 12px", color: "#16a34a" }}>Restore</Btn>
                     <Btn variant="ghost" onClick={() => permaDelete(item._id)} style={{ padding: "6px 12px", color: "#dc2626" }}><Trash2 size={14}/></Btn>
                   </div>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
      }
    </div>
  );
}

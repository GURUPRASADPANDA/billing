import React, { useState, useMemo, useContext } from 'react';
import { History, Printer, Eye, Trash2 } from "lucide-react";
import { api } from "../services/api";
import { Btn } from "../components/ui/Btn";
import { BillPreview } from "../components/pdf/BillPreview";
import { StatementModal } from "../components/pdf/StatementModal";
import { HistorySkeleton } from "../components/skeletons/HistorySkeleton";
import { formatDate, formatCurrency } from "../utils/formatters";

import { DataContext } from "../context/DataContext";

export function HistoryPage({ toast, company, isMobile }) {
  const { bills: allBills, summary, loadingBills: loading, refreshBills, refreshSummary } = useContext(DataContext);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [preview, setPreview] = useState(null);
  const [statementModalOpen, setStatementModalOpen] = useState(false);

  const bills = useMemo(() => {
    let filtered = allBills;
    if (startDate) {
      filtered = filtered.filter(b => new Date(b.billDate) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(b => new Date(b.billDate) <= new Date(endDate));
    }
    return filtered;
  }, [allBills, startDate, endDate]);

  const del = async (id) => {
    if (!confirm("Delete this bill?")) return;
    try { await api.deleteBill(id); toast("Bill deleted", "success"); refreshBills(); refreshSummary(); }
    catch (e) { toast(e.message, "error"); }
  };

  if (loading) return <HistorySkeleton isMobile={isMobile} />;

  return (
    <div>
      <h2 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 600, color: "var(--text)" }}><History size={20} /> Bill History</h2>

      <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>From Date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 13 }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>To Date</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 13 }} />
          </div>
          <Btn variant="primary" onClick={() => setStatementModalOpen(true)}><Printer size={14} /> Print Statements</Btn>
        </div>

        {summary && (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", width: isMobile ? "100%" : "auto" }}>
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 16px", flex: isMobile ? "1" : "none", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Prev Month</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{formatCurrency(summary.previousMonthTotal)}</div>
            </div>
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 16px", flex: isMobile ? "1" : "none", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Curr Month</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#2563eb" }}>{formatCurrency(summary.currentMonthTotal)}</div>
            </div>
          </div>
        )}
      </div>
      {bills.length === 0 ? <div style={{ textAlign: "center", color: "var(--text-muted)", padding: 60 }}>No bills found.</div> :
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }}>
         <div style={{ overflowX: "auto" }}>
          {isMobile ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {bills.map((bill, i) => (
                <div key={bill._id} style={{ padding: 16, borderBottom: i < bills.length - 1 ? "1px solid var(--border)" : "none", display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <span style={{ fontWeight: 700, color: "#2563eb", fontSize: 15 }}>#{String(bill.billNumber).padStart(4, "0")}</span>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{formatDate(bill.billDate)}</span>
                    </div>
                    <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                      <span style={{ fontWeight: 600, color: "var(--text)", fontSize: 14 }}>{bill.party?.companyName}</span>
                      <span style={{ fontSize: 12, color: "var(--text-muted)", background: "var(--sidebar)", padding: "2px 8px", borderRadius: 12 }}>{bill.items?.length} item{bill.items?.length !== 1 ? "s" : ""}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed var(--border)", paddingTop: 12 }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>Grand Total</span>
                      <span style={{ fontWeight: 700, color: "var(--text)", fontSize: 16 }}>{formatCurrency(bill.grandTotal)}</span>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn variant="secondary" onClick={() => setPreview(bill)} style={{ padding: "6px 12px", fontSize: 12 }}><Eye size={14} /> View</Btn>
                      <Btn variant="ghost" onClick={() => del(bill._id)} style={{ padding: "6px 10px" }}><Trash2 size={14} /></Btn>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
                        <Btn variant="secondary" onClick={() => setPreview(bill)} style={{ padding: "6px 12px", fontSize: 12 }}><Eye size={14} /> View</Btn>
                        <Btn variant="ghost" onClick={() => del(bill._id)} style={{ padding: "6px 10px" }}><Trash2 size={14} /></Btn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        </div>
      }
      {preview && <BillPreview bill={preview} onClose={() => setPreview(null)} company={company} />}
      {statementModalOpen && <StatementModal company={company} onClose={() => setStatementModalOpen(false)} toast={toast} />}
    </div>
  );
}

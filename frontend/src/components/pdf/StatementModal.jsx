import React, { useState, useEffect, useRef } from 'react';
import { Printer } from "lucide-react";
import { api } from "../../services/api";
import { formatDate, formatCurrency } from "../../utils/formatters";
import { Modal } from "../ui/Modal";
import { Btn } from "../ui/Btn";
import { ModalSkeleton } from "../skeletons/ModalSkeleton";

export function StatementModal({ onClose, company, toast }) {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}-01`;
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    const y = lastDay.getFullYear();
    const m = String(lastDay.getMonth() + 1).padStart(2, '0');
    const day = String(lastDay.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  });
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const printRef = useRef();

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      setBills(await api.getBills(params));
    } catch (e) { toast(e.message, "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [startDate, endDate]);

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open("", "_blank");
    win.document.write(`
      <!DOCTYPE html><html><head>
      <title>Statements - ${company?.companyName || "Company"}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; background: #fff; padding: 20px; }
        .header { text-align: center; margin-bottom: 20px; }
        .company-name { font-size: 24px; font-weight: 700; }
        .report-title { font-size: 18px; margin-top: 5px; }
        .date-range { font-size: 14px; color: #555; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 13px; }
        th { background-color: #f4f4f4; font-weight: bold; }
        .text-right { text-align: right; }
        @media print { @page { size: A4; margin: 20mm; } }
      </style></head><body>
      ${content}
      </body></html>
    `);
    win.document.close();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  return (
    <Modal title="Print Statements" onClose={onClose} width={700}>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "flex-end" }}>
        <div>
          <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>From Date</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 13 }} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>To Date</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 13 }} />
        </div>
        <div style={{ display: "flex", flex: 1, justifyContent: "flex-end" }}>
           <Btn onClick={handlePrint} disabled={bills.length === 0} style={{ padding: "10px 16px" }}><Printer size={16} /> Print</Btn>
        </div>
      </div>
      
      {loading ? <ModalSkeleton /> : 
       bills.length === 0 ? <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>No bills found for this duration.</div> :
       <div style={{ maxHeight: 400, overflowY: "auto", border: "1px solid var(--border)", borderRadius: 8, padding: 16 }}>
         <div ref={printRef}>
            <div className="header" style={{ textAlign: "center", marginBottom: 20 }}>
              <div className="company-name" style={{ fontSize: 24, fontWeight: "bold" }}>{company?.companyName || "Company"}</div>
              <div className="report-title" style={{ fontSize: 18, margin: "5px 0" }}>Monthly Statement</div>
              {(startDate || endDate) && <div className="date-range" style={{ fontSize: 14, color: "#555", margin: "5px 0" }}>
                {startDate ? formatDate(startDate) : "Any"} to {endDate ? formatDate(endDate) : "Any"}
              </div>}
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd", color: "#000" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={{ padding: 8, border: "1px solid #ddd", textAlign: "left", color: "#333" }}>Date</th>
                  <th style={{ padding: 8, border: "1px solid #ddd", textAlign: "left", color: "#333" }}>Bill No</th>
                  <th style={{ padding: 8, border: "1px solid #ddd", textAlign: "left", color: "#333" }}>Party Name</th>
                  <th style={{ padding: 8, border: "1px solid #ddd", textAlign: "right", color: "#333" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {bills.map(b => (
                  <tr key={b._id}>
                    <td style={{ padding: 8, border: "1px solid #ddd" }}>{formatDate(b.billDate)}</td>
                    <td style={{ padding: 8, border: "1px solid #ddd" }}>#{String(b.billNumber).padStart(4, "0")}</td>
                    <td style={{ padding: 8, border: "1px solid #ddd" }}>{b.party?.companyName}</td>
                    <td style={{ padding: 8, border: "1px solid #ddd", textAlign: "right" }}>{formatCurrency(b.grandTotal)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: "#f4f4f4", fontWeight: "bold" }}>
                  <td colSpan="3" style={{ padding: 8, border: "1px solid #ddd", textAlign: "right", color: "#333" }}>Total Amount</td>
                  <td style={{ padding: 8, border: "1px solid #ddd", textAlign: "right", color: "#333" }}>{formatCurrency(bills.reduce((sum, b) => sum + (b.grandTotal || 0), 0))}</td>
                </tr>
              </tfoot>
            </table>
         </div>
       </div>
      }
    </Modal>
  );
}

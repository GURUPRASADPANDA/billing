import React, { useState, useRef } from 'react';
import html2pdf from "html2pdf.js";
import { Printer, Download, Share2, MapPin, Phone } from "lucide-react";
import { Btn } from "../ui/Btn";
import { formatDate } from "../../utils/formatters";

export function BillPreview({ bill, onClose, company }) {
  const [openMenu, setOpenMenu] = useState(false);
  const printRef = useRef();

  const handleDownload = () => {
    const element = printRef.current;
    const opt = {
      margin: 0.5,
      filename: `Bill-${bill.billNumber}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  const shareBill = async () => {
    try {
      const element = printRef.current;
      const opt = {
        margin: 0.5,
        filename: `Bill-${bill.billNumber}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };
      const pdfBlob = await html2pdf().set(opt).from(element).outputPdf("blob");
      const file = new File([pdfBlob], `Bill-${bill.billNumber}.pdf`, { type: "application/pdf" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: `Bill #${bill.billNumber}`, text: "Here is your bill" });
      } else {
        alert("Sharing file not supported on this device. Downloading instead.");
        handleDownload();
      }
    } catch (err) {
      console.log(err);
    }
  };

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
          <div style={{ display: "flex", gap: 10, position: "relative" }}>
            <div style={{ position: "relative" }}>
              <Btn variant="success" onClick={() => setOpenMenu(!openMenu)} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Printer size={14} /> Actions
              </Btn>
              {openMenu && (
                <div style={{ position: "absolute", right: 0, top: "110%", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, boxShadow: "0 10px 25px rgba(0,0,0,0.15)", minWidth: 180, zIndex: 1000 }}>
                  <div onClick={() => { handlePrint(); setOpenMenu(false); }} style={{ padding: "10px 14px", cursor: "pointer", color: "#000" }}><Printer size={14} /> Print</div>
                  <div onClick={() => { handleDownload(); setOpenMenu(false); }} style={{ padding: "10px 14px", cursor: "pointer", color: "#000" }}><Download size={14} /> Download PDF</div>
                  <div onClick={() => { shareBill(); setOpenMenu(false); }} style={{ padding: "10px 14px", cursor: "pointer", color: "#000" }}><Share2 size={14} /> Share</div>
                </div>
              )}
            </div>
            <Btn variant="secondary" onClick={onClose}>Close</Btn>
          </div>
        </div>
        <div style={{ padding: 24, background: "#f1f5f9", minHeight: 400 }}>
          <div ref={printRef} style={{ background: "#fff", borderRadius: 8, padding: 40, maxWidth: 794, margin: "0 auto", boxShadow: "0 2px 20px rgba(0,0,0,0.08)" }}>
            <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #2563eb", paddingBottom: 20, marginBottom: 24 }}>
              <div>
                <div className="company-name" style={{ fontSize: 24, fontWeight: 700, color: "#1d3170" }}>{company?.companyName}</div>
                <div className="company-detail" style={{ fontSize: 12, color: "#555", marginTop: 4 }}>GST: {company?.gstNumber}</div>
                <div className="company-detail" style={{ fontSize: 12, color: "#555" }}><MapPin size={14} /> {company?.address}</div>
                <div className="company-detail" style={{ fontSize: 12, color: "#555" }}><Phone size={14} /> {company?.phone}</div>
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
                    <td style={{ padding: "10px 12px", fontSize: 13, borderBottom: "1px solid #e2e8f0", fontWeight: 500, color: "#000" }}>{item.itemName}</td>
                    <td style={{ padding: "10px 12px", fontSize: 13, borderBottom: "1px solid #e2e8f0", textAlign: "center", color: "#000" }}>{item.quantity}</td>
                    <td style={{ padding: "10px 12px", fontSize: 13, borderBottom: "1px solid #e2e8f0", textAlign: "right", color: "#000" }}>{item.price.toFixed(2)}</td>
                    <td style={{ padding: "10px 12px", fontSize: 13, borderBottom: "1px solid #e2e8f0", textAlign: "right", fontWeight: 500, color: "#000" }}>{item.total.toFixed(2)}</td>
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
            <div style={{ borderTop: "1px solid #000", paddingTop: 10, fontSize: 12, color: "#000" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ border: "2px solid #000", padding: 10, width: "40%", textAlign: "center", fontWeight: "500", boxShadow: "3px 3px 0px #000" }}>
                  <div>UCO BANK</div>
                  <div>NUAPADA BRANCH</div>
                  <div>A/C - 13190210002636</div>
                  <div>IFSC - UCBA0001319</div>
                </div>
                <div style={{ width: "55%" }}></div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 15 }}>
                <div style={{ width: "60%" }}>
                  <strong>Terms & Conditions:</strong>
                  <p style={{ margin: "5px 0" }}>1) Goods once sold will not be taken back or exchanged.<br />2) Subject to Cuttack jurisdiction.</p>
                </div>
                <div style={{ width: "35%", textAlign: "center" }}>
                  <div style={{ fontWeight: "bold" }}>For MAHAVIR ENTERPRISES</div>
                  <div style={{ marginTop: 40 }}>Auth. Signatory</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

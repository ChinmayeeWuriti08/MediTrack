"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function BillingPage() {
  const [bills, setBills] = useState<any[]>([]);

  useEffect(() => {
    // Load bills from localStorage
    const savedBills = localStorage.getItem("bills");
    if (savedBills) {
      setBills(JSON.parse(savedBills));
    } else {
      // Sample bills if none exist
      const sampleBills = [
        { id: "INV-001", date: "2024-03-15", doctorName: "Dr. Rajesh Kumar", specialization: "Cardiologist", amount: 800, status: "Paid", paymentMethod: "UPI", transactionId: "TXN123456" },
        { id: "INV-002", date: "2024-03-10", doctorName: "Dr. Priya Sharma", specialization: "Neurologist", amount: 900, status: "Paid", paymentMethod: "Credit Card", transactionId: "TXN123457" },
      ];
      setBills(sampleBills);
      localStorage.setItem("bills", JSON.stringify(sampleBills));
    }
  }, []);

  /*
  const exportBillingToCSV = () => {
    const header = "Invoice,Date,Doctor,Amount\n";
    const rows = bills.map(b => `${b.id},${b.date},${b.doctorName},${b.amount}`).join("\n");
    const link = document.createElement("a");
    link.href = 'data:text/csv;charset=utf-8,' + encodeURI(header + rows);
    link.download = "billing_summary.csv";
  };
  */

  const downloadInvoice = (bill: any) => {
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${bill.id}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #06b6d4; padding-bottom: 20px; }
          .hospital-name { font-size: 28px; color: #06b6d4; font-weight: bold; }
          .invoice-title { font-size: 24px; margin: 20px 0; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
          th { background: #f5f5f5; }
          .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
          .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="hospital-name">MediTrack Healthcare</div>
          <p>123 Healthcare Lane, Medical District</p>
        </div>
        <div class="invoice-title">TAX INVOICE</div>
        <p><strong>Invoice No:</strong> ${bill.id}</p>
        <p><strong>Date:</strong> ${bill.date}</p>
        <p><strong>Transaction ID:</strong> ${bill.transactionId}</p>
        <table>
          <tr><th>Description</th><th>Amount</th></tr>
          <tr><td>Consultation - Dr. ${bill.doctorName} (${bill.specialization})</td><td>₹${bill.amount}</td></tr>
          <tr><td>GST (5%)</td><td>₹${(bill.amount * 0.05).toFixed(2)}</td></tr>
          <tr style="font-weight:bold"><td>Total</td><td>₹${(bill.amount * 1.05).toFixed(2)}</td></tr>
        </table>
        <div class="footer">Thank you for choosing MediTrack</div>
      </body>
      </html>
    `;
    
    const blob = new Blob([invoiceHTML], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice_${bill.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f" }}>
      <div style={{ background: "rgba(20,20,30,0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(6,182,212,0.2)", padding: "16px 32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Link href="/patient" style={{ color: "#06b6d4", textDecoration: "none" }}>Back</Link>
          <h2>Billing History</h2>
          <div style={{ width: "80px" }} />
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px" }}>
        {bills.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", background: "rgba(20,20,30,0.4)", borderRadius: "20px" }}>
            <p>No billing history found. Book an appointment to see invoices here.</p>
          </div>
        ) : (
          <div style={{ background: "rgba(20,20,30,0.6)", borderRadius: "20px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ background: "rgba(0,0,0,0.4)" }}>
                <tr>
                  <th style={{ padding: "16px", textAlign: "left" }}>Invoice No</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Date</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Doctor</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Amount</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Status</th>
                  <th style={{ padding: "16px", textAlign: "left" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {bills.map(bill => (
                  <tr key={bill.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <td style={{ padding: "16px" }}>{bill.id}</td>
                    <td style={{ padding: "16px" }}>{bill.date}</td>
                    <td style={{ padding: "16px" }}>{bill.doctorName}</td>
                    <td style={{ padding: "16px", color: "#10b981" }}>₹{bill.amount}</td>
                    <td style={{ padding: "16px" }}><span style={{ padding: "4px 12px", background: "rgba(16,185,129,0.2)", borderRadius: "20px", fontSize: "12px" }}>{bill.status}</span></td>
                    <td style={{ padding: "16px" }}>
                      <button onClick={() => downloadInvoice(bill)} style={{ padding: "6px 16px", background: "#3b82f6", border: "none", borderRadius: "8px", cursor: "pointer", color: "white" }}>
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}